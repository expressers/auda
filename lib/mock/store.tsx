"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { uniqueSlug } from "@/lib/format"
import { seedState } from "@/lib/mock/seed"
import type {
  AccountType,
  AppNotification,
  Contribution,
  MockState,
  Project,
  ProjectCategory,
  UploadedDocument,
  User,
} from "@/lib/types"

const STORAGE_KEY = "auda-mock-v1"

type RegisterInput = {
  email: string
  password: string
  name: string
  phone: string
  accountType: AccountType
}

type VerificationInput = {
  address: string
  phone: string
  bi?: string
  nif?: string
  legalName?: string
  legalObject?: string
  documents: UploadedDocument[]
}

type ProjectInput = {
  title: string
  summary: string
  story: string
  category: ProjectCategory
  location: string
  goalAmount: number
  deadline: string
}

type ContributeInput = {
  projectId: string
  amount: number
  contributorName: string | null
  message?: string
  phone: string
}

type ActionResult = { ok: true } | { ok: false; error: string }

type MockStoreValue = {
  hydrated: boolean
  state: MockState
  currentUser: User | null
  login: (email: string, password: string) => ActionResult & { role?: User["role"] }
  logout: () => void
  register: (input: RegisterInput) => ActionResult
  submitVerification: (input: VerificationInput) => ActionResult
  reviewOrganizer: (
    userId: string,
    decision: "approve" | "reject",
    reason?: string
  ) => ActionResult
  createProject: (input: ProjectInput) => ActionResult & { id?: string }
  updateProject: (id: string, input: ProjectInput) => ActionResult
  publishProject: (id: string) => ActionResult
  pauseProject: (id: string) => ActionResult
  resumeProject: (id: string) => ActionResult
  closeProject: (id: string) => ActionResult
  reviewProject: (
    id: string,
    decision: "approve" | "reject",
    reason?: string
  ) => ActionResult
  removeProject: (id: string) => ActionResult
  contribute: (input: ContributeInput) => ActionResult & { reference?: string }
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
}

const MockStoreContext = createContext<MockStoreValue | null>(null)

function createId() {
  return crypto.randomUUID()
}

function now() {
  return new Date().toISOString()
}

function pushNotification(
  notifications: AppNotification[],
  payload: Omit<AppNotification, "id" | "read" | "createdAt">
) {
  notifications.unshift({
    ...payload,
    id: createId(),
    read: false,
    createdAt: now(),
  })
}

function generateReference() {
  return String(Math.floor(100_000_000 + Math.random() * 900_000_000))
}

export function MockStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MockState>(seedState)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as MockState
        if (parsed?.users && parsed?.projects) {
          // Hydrate after mount so SSR and the first client paint stay aligned.
          // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage restore
          setState(parsed)
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [hydrated, state])

  const currentUser = useMemo(
    () => state.users.find((user) => user.id === state.currentUserId) ?? null,
    [state.users, state.currentUserId]
  )

  const login = useCallback((email: string, password: string) => {
    let result: ActionResult & { role?: User["role"] } = {
      ok: false,
      error: "E-mail ou palavra-passe incorrectos.",
    }
    setState((current) => {
      const user = current.users.find(
        (item) =>
          item.email.toLowerCase() === email.trim().toLowerCase() &&
          item.password === password
      )
      if (!user) return current
      result = { ok: true, role: user.role }
      return { ...current, currentUserId: user.id }
    })
    return result
  }, [])

  const logout = useCallback(() => {
    setState((current) => ({ ...current, currentUserId: null }))
  }, [])

  const register = useCallback((input: RegisterInput) => {
    let result: ActionResult = { ok: false, error: "Não foi possível criar a conta." }
    setState((current) => {
      const exists = current.users.some(
        (user) => user.email.toLowerCase() === input.email.trim().toLowerCase()
      )
      if (exists) {
        result = { ok: false, error: "Já existe uma conta com este e-mail." }
        return current
      }
      const user: User = {
        id: createId(),
        email: input.email.trim().toLowerCase(),
        password: input.password,
        name: input.name.trim(),
        role: "organizador",
        accountType: input.accountType,
        phone: input.phone.trim(),
        documents: [],
        verificationStatus: "nao_submetido",
      }
      result = { ok: true }
      return {
        ...current,
        users: [...current.users, user],
        currentUserId: user.id,
      }
    })
    return result
  }, [])

  const submitVerification = useCallback((input: VerificationInput) => {
    let result: ActionResult = { ok: false, error: "Inicie sessão para continuar." }
    setState((current) => {
      if (!current.currentUserId) return current
      const users = current.users.map((user) =>
        user.id === current.currentUserId
          ? {
              ...user,
              address: input.address,
              phone: input.phone,
              bi: input.bi,
              nif: input.nif,
              legalName: input.legalName,
              legalObject: input.legalObject,
              documents: input.documents,
              verificationStatus: "pendente" as const,
              verificationRejectionReason: undefined,
            }
          : user
      )
      const organizer = users.find((user) => user.id === current.currentUserId)
      const notifications = [...current.notifications]
      const admins = users.filter((user) => user.role === "admin")
      for (const admin of admins) {
        pushNotification(notifications, {
          userId: admin.id,
          title: "Verificação pendente",
          body: `${organizer?.name ?? "Um organizador"} submeteu dados para validação.`,
          href: `/admin/organizadores/${current.currentUserId}`,
        })
      }
      result = { ok: true }
      return { ...current, users, notifications }
    })
    return result
  }, [])

  const reviewOrganizer = useCallback(
    (userId: string, decision: "approve" | "reject", reason?: string) => {
      let result: ActionResult = { ok: false, error: "Organizador não encontrado." }
      setState((current) => {
        const target = current.users.find((user) => user.id === userId)
        if (!target) return current
        const users = current.users.map((user) =>
          user.id === userId
            ? {
                ...user,
                verificationStatus:
                  decision === "approve" ? ("verificado" as const) : ("rejeitado" as const),
                verificationRejectionReason:
                  decision === "reject" ? reason : undefined,
              }
            : user
        )
        const notifications = [...current.notifications]
        pushNotification(notifications, {
          userId,
          title: decision === "approve" ? "Organizador verificado" : "Verificação rejeitada",
          body:
            decision === "approve"
              ? "O seu perfil foi verificado. Já pode submeter projectos."
              : reason || "A administração rejeitou os dados submetidos.",
          href: "/organizador/verificacao",
        })
        result = { ok: true }
        return { ...current, users, notifications }
      })
      return result
    },
    []
  )

  const createProject = useCallback((input: ProjectInput) => {
    let result: ActionResult & { id?: string } = {
      ok: false,
      error: "Inicie sessão para continuar.",
    }
    setState((current) => {
      const organizer = current.users.find((user) => user.id === current.currentUserId)
      if (!organizer || organizer.role !== "organizador") return current
      if (organizer.verificationStatus !== "verificado") {
        result = {
          ok: false,
          error: "Só organizadores verificados podem submeter projectos.",
        }
        return current
      }
      const id = createId()
      const project: Project = {
        id,
        slug: uniqueSlug(
          input.title,
          current.projects.map((item) => item.slug)
        ),
        organizerId: organizer.id,
        title: input.title.trim(),
        summary: input.summary.trim(),
        story: input.story.trim(),
        category: input.category,
        location: input.location.trim(),
        goalAmount: input.goalAmount,
        raisedAmount: 0,
        contributorCount: 0,
        deadline: input.deadline,
        status: "em_analise",
        createdAt: now(),
        updates: [],
      }
      const notifications = [...current.notifications]
      const admins = current.users.filter((user) => user.role === "admin")
      for (const admin of admins) {
        pushNotification(notifications, {
          userId: admin.id,
          title: "Projecto em análise",
          body: `${project.title} foi submetido e aguarda decisão.`,
          href: `/admin/projectos/${id}`,
        })
      }
      pushNotification(notifications, {
        userId: organizer.id,
        title: "Projecto submetido",
        body: `${project.title} entrou em análise.`,
        href: `/organizador/projectos/${id}`,
      })
      result = { ok: true, id }
      return {
        ...current,
        projects: [project, ...current.projects],
        notifications,
      }
    })
    return result
  }, [])

  const updateProject = useCallback((id: string, input: ProjectInput) => {
    let result: ActionResult = { ok: false, error: "Projecto não encontrado." }
    setState((current) => {
      const project = current.projects.find((item) => item.id === id)
      if (!project) return current
      if (
        project.status === "publicado" ||
        project.status === "pausado" ||
        project.status === "encerrado"
      ) {
        result = {
          ok: false,
          error: "Não é possível editar um projecto depois de publicado.",
        }
        return current
      }
      result = { ok: true }
      return {
        ...current,
        projects: current.projects.map((item) =>
          item.id === id
            ? {
                ...item,
                title: input.title.trim(),
                summary: input.summary.trim(),
                story: input.story.trim(),
                category: input.category,
                location: input.location.trim(),
                goalAmount: input.goalAmount,
                deadline: input.deadline,
                slug:
                  item.slug ||
                  uniqueSlug(
                    input.title,
                    current.projects.filter((other) => other.id !== id).map((other) => other.slug)
                  ),
              }
            : item
        ),
      }
    })
    return result
  }, [])

  const publishProject = useCallback((id: string) => {
    let result: ActionResult = { ok: false, error: "Projecto não encontrado." }
    setState((current) => {
      const project = current.projects.find((item) => item.id === id)
      if (!project) return current
      if (project.status !== "aprovado") {
        result = { ok: false, error: "Só projectos aprovados podem ser publicados." }
        return current
      }
      result = { ok: true }
      return {
        ...current,
        projects: current.projects.map((item) =>
          item.id === id
            ? { ...item, status: "publicado" as const, publishedAt: now() }
            : item
        ),
      }
    })
    return result
  }, [])

  const pauseProject = useCallback((id: string) => {
    let result: ActionResult = { ok: false, error: "Projecto não encontrado." }
    setState((current) => {
      const project = current.projects.find((item) => item.id === id)
      if (!project) return current
      if (project.status !== "publicado") {
        result = { ok: false, error: "Só é possível pausar projectos publicados." }
        return current
      }
      const notifications = [...current.notifications]
      pushNotification(notifications, {
        userId: project.organizerId,
        title: "Projecto pausado",
        body: `${project.title} foi pausado.`,
        href: `/organizador/projectos/${id}`,
      })
      result = { ok: true }
      return {
        ...current,
        notifications,
        projects: current.projects.map((item) =>
          item.id === id ? { ...item, status: "pausado" as const } : item
        ),
      }
    })
    return result
  }, [])

  const resumeProject = useCallback((id: string) => {
    let result: ActionResult = { ok: false, error: "Projecto não encontrado." }
    setState((current) => {
      const project = current.projects.find((item) => item.id === id)
      if (!project || project.status !== "pausado") {
        result = { ok: false, error: "Só é possível retomar projectos pausados." }
        return current
      }
      result = { ok: true }
      return {
        ...current,
        projects: current.projects.map((item) =>
          item.id === id ? { ...item, status: "publicado" as const } : item
        ),
      }
    })
    return result
  }, [])

  const closeProject = useCallback((id: string) => {
    let result: ActionResult = { ok: false, error: "Projecto não encontrado." }
    setState((current) => {
      const project = current.projects.find((item) => item.id === id)
      if (!project) return current
      if (project.status !== "publicado" && project.status !== "pausado") {
        result = { ok: false, error: "Só é possível encerrar campanhas públicas." }
        return current
      }
      const notifications = [...current.notifications]
      pushNotification(notifications, {
        userId: project.organizerId,
        title: "Projecto encerrado",
        body: `${project.title} foi encerrado.`,
        href: `/organizador/projectos/${id}`,
      })
      result = { ok: true }
      return {
        ...current,
        notifications,
        projects: current.projects.map((item) =>
          item.id === id ? { ...item, status: "encerrado" as const } : item
        ),
      }
    })
    return result
  }, [])

  const reviewProject = useCallback(
    (id: string, decision: "approve" | "reject", reason?: string) => {
      let result: ActionResult = { ok: false, error: "Projecto não encontrado." }
      setState((current) => {
        const project = current.projects.find((item) => item.id === id)
        if (!project) return current
        const notifications = [...current.notifications]
        pushNotification(notifications, {
          userId: project.organizerId,
          title: decision === "approve" ? "Projecto aprovado" : "Projecto rejeitado",
          body:
            decision === "approve"
              ? `${project.title} foi aprovado. Já pode publicar a campanha.`
              : reason || `${project.title} foi rejeitado.`,
          href: `/organizador/projectos/${id}`,
        })
        result = { ok: true }
        return {
          ...current,
          notifications,
          projects: current.projects.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status:
                    decision === "approve" ? ("aprovado" as const) : ("rejeitado" as const),
                  rejectionReason: decision === "reject" ? reason : undefined,
                }
              : item
          ),
        }
      })
      return result
    },
    []
  )

  const removeProject = useCallback((id: string) => {
    let result: ActionResult = { ok: false, error: "Projecto não encontrado." }
    setState((current) => {
      const project = current.projects.find((item) => item.id === id)
      if (!project) return current
      result = { ok: true }
      return {
        ...current,
        projects: current.projects.filter((item) => item.id !== id),
        contributions: current.contributions.filter((item) => item.projectId !== id),
      }
    })
    return result
  }, [])

  const contribute = useCallback((input: ContributeInput) => {
    let result: ActionResult & { reference?: string } = {
      ok: false,
      error: "Projecto indisponível.",
    }
    setState((current) => {
      const project = current.projects.find((item) => item.id === input.projectId)
      if (!project || project.status !== "publicado") return current
      const reference = generateReference()
      const contribution: Contribution = {
        id: createId(),
        projectId: project.id,
        amount: input.amount,
        contributorName: input.contributorName,
        message: input.message,
        phone: input.phone,
        reference,
        createdAt: now(),
      }
      const notifications = [...current.notifications]
      pushNotification(notifications, {
        userId: project.organizerId,
        title: "Nova contribuição",
        body: `Recebeu ${new Intl.NumberFormat("pt-PT").format(input.amount)} Kz em ${project.title}.`,
        href: `/organizador/projectos/${project.id}`,
      })
      result = { ok: true, reference }
      return {
        ...current,
        contributions: [contribution, ...current.contributions],
        notifications,
        projects: current.projects.map((item) =>
          item.id === project.id
            ? {
                ...item,
                raisedAmount: item.raisedAmount + input.amount,
                contributorCount: item.contributorCount + 1,
              }
            : item
        ),
      }
    })
    return result
  }, [])

  const markNotificationRead = useCallback((id: string) => {
    setState((current) => ({
      ...current,
      notifications: current.notifications.map((item) =>
        item.id === id ? { ...item, read: true } : item
      ),
    }))
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setState((current) => ({
      ...current,
      notifications: current.notifications.map((item) =>
        current.currentUserId && item.userId === current.currentUserId
          ? { ...item, read: true }
          : item
      ),
    }))
  }, [])

  const value = useMemo<MockStoreValue>(
    () => ({
      hydrated,
      state,
      currentUser,
      login,
      logout,
      register,
      submitVerification,
      reviewOrganizer,
      createProject,
      updateProject,
      publishProject,
      pauseProject,
      resumeProject,
      closeProject,
      reviewProject,
      removeProject,
      contribute,
      markNotificationRead,
      markAllNotificationsRead,
    }),
    [
      hydrated,
      state,
      currentUser,
      login,
      logout,
      register,
      submitVerification,
      reviewOrganizer,
      createProject,
      updateProject,
      publishProject,
      pauseProject,
      resumeProject,
      closeProject,
      reviewProject,
      removeProject,
      contribute,
      markNotificationRead,
      markAllNotificationsRead,
    ]
  )

  return <MockStoreContext.Provider value={value}>{children}</MockStoreContext.Provider>
}

export function useMockStore() {
  const context = useContext(MockStoreContext)
  if (!context) {
    throw new Error("useMockStore deve ser usado dentro de MockStoreProvider.")
  }
  return context
}
