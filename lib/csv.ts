import { ACCOUNT_TYPE_LABEL, STATUS_LABEL } from "@/lib/labels"
import type { MockState } from "@/lib/types"

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
        .join(",")
    )
    .join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function exportFinancialCsv(state: MockState) {
  const rows = [
    ["Projecto", "Organizador", "Estado", "Meta (Kz)", "Angariado (Kz)", "Contribuintes"],
    ...state.projects.map((project) => {
      const organizer = state.users.find((user) => user.id === project.organizerId)
      return [
        project.title,
        organizer?.legalName || organizer?.name || "",
        STATUS_LABEL[project.status],
        String(project.goalAmount),
        String(project.raisedAmount),
        String(project.contributorCount),
      ]
    }),
  ]
  downloadCsv("auda-relatorio-financeiro.csv", rows)
}

export function exportOperationalCsv(state: MockState) {
  const rows = [
    ["Organizador", "Tipo", "E-mail", "Verificação", "Projectos"],
    ...state.users
      .filter((user) => user.role === "organizador")
      .map((user) => [
        user.legalName || user.name,
        user.accountType ? ACCOUNT_TYPE_LABEL[user.accountType] : "",
        user.email,
        user.verificationStatus,
        String(state.projects.filter((project) => project.organizerId === user.id).length),
      ]),
  ]
  downloadCsv("auda-relatorio-operacional.csv", rows)
}
