import type { Contribution, Project } from "@/lib/types"

const MONTHS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
]

const MONTHS_SHORT = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
]

export function formatKz(value: number) {
  const digits = Math.round(value).toString()
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  return `${grouped} Kz`
}

export function formatDate(iso: string) {
  const date = new Date(iso)
  const day = date.getUTCDate()
  const month = MONTHS[date.getUTCMonth()]
  const year = date.getUTCFullYear()
  return `${day} de ${month} de ${year}`
}

export function formatShortDate(iso: string) {
  const date = new Date(iso)
  return `${date.getUTCDate()} ${MONTHS_SHORT[date.getUTCMonth()]}`
}

export function projectProgress(project: Project) {
  if (project.goalAmount <= 0) return 0
  return Math.min(100, Math.round((project.raisedAmount / project.goalAmount) * 100))
}

export function isPubliclyVisible(project: Project) {
  return (
    project.status === "publicado" ||
    project.status === "pausado" ||
    project.status === "encerrado"
  )
}

export function canContribute(project: Project) {
  return project.status === "publicado"
}

export function canEditProject(project: Project) {
  return (
    project.status === "em_analise" ||
    project.status === "aprovado" ||
    project.status === "rejeitado"
  )
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function dailyRaised(
  contributions: Contribution[],
  options?: { projectId?: string; days?: number }
) {
  const days = options?.days ?? 14
  const filtered = options?.projectId
    ? contributions.filter((item) => item.projectId === options.projectId)
    : contributions

  const map = new Map<string, number>()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const key = date.toISOString().slice(0, 10)
    map.set(key, 0)
  }

  for (const contribution of filtered) {
    const key = contribution.createdAt.slice(0, 10)
    if (map.has(key)) {
      map.set(key, (map.get(key) ?? 0) + contribution.amount)
    }
  }

  return [...map.entries()].map(([date, total]) => ({ date, total }))
}

export function uniqueSlug(title: string, existing: string[]) {
  const base = slugify(title) || "projecto"
  let slug = base
  let i = 2
  while (existing.includes(slug)) {
    slug = `${base}-${i}`
    i += 1
  }
  return slug
}
