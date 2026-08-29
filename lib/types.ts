export type AccountType = "individual" | "empresa" | "organizacao"
export type Role = "organizador" | "admin"
export type VerificationStatus =
  | "nao_submetido"
  | "pendente"
  | "verificado"
  | "rejeitado"
export type ProjectStatus =
  | "em_analise"
  | "aprovado"
  | "rejeitado"
  | "publicado"
  | "pausado"
  | "encerrado"
export type ProjectCategory =
  | "agua"
  | "educacao"
  | "saude"
  | "religiao"
  | "empreendedorismo"
  | "comunidade"

export type UploadedDocument = {
  name: string
  uploadedAt: string
}

export type User = {
  id: string
  email: string
  password: string
  name: string
  role: Role
  accountType?: AccountType
  phone?: string
  address?: string
  bi?: string
  nif?: string
  legalName?: string
  legalObject?: string
  documents: UploadedDocument[]
  verificationStatus: VerificationStatus
  verificationRejectionReason?: string
}

export type ProjectUpdate = {
  id: string
  title: string
  body: string
  createdAt: string
}

export type Project = {
  id: string
  slug: string
  organizerId: string
  title: string
  summary: string
  story: string
  category: ProjectCategory
  location: string
  goalAmount: number
  raisedAmount: number
  contributorCount: number
  deadline: string
  status: ProjectStatus
  rejectionReason?: string
  createdAt: string
  publishedAt?: string
  updates: ProjectUpdate[]
}

export type Contribution = {
  id: string
  projectId: string
  amount: number
  contributorName: string | null
  message?: string
  phone: string
  reference: string
  createdAt: string
}

export type AppNotification = {
  id: string
  userId: string
  title: string
  body: string
  read: boolean
  createdAt: string
  href?: string
}

export type MockState = {
  users: User[]
  projects: Project[]
  contributions: Contribution[]
  notifications: AppNotification[]
  currentUserId: string | null
}
