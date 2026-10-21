import { STATUS_LABEL, VERIFICATION_LABEL } from "@/lib/labels"
import type { ProjectStatus, VerificationStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const STATUS_CLASS: Record<ProjectStatus, string> = {
  em_analise: "bg-amber-50 text-amber-800",
  aprovado: "bg-sky-50 text-sky-800",
  rejeitado: "bg-red-50 text-red-800",
  publicado: "bg-emerald-50 text-emerald-800",
  pausado: "bg-zinc-100 text-zinc-700",
  encerrado: "bg-blue-50 text-blue-800",
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-full px-2 text-xs font-medium",
        STATUS_CLASS[status]
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}

const VERIFICATION_CLASS: Record<VerificationStatus, string> = {
  nao_submetido: "bg-zinc-50 text-zinc-700",
  pendente: "bg-amber-50 text-amber-800",
  verificado: "bg-emerald-50 text-emerald-800",
  rejeitado: "bg-red-50 text-red-800",
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-full px-2 text-xs font-medium",
        VERIFICATION_CLASS[status]
      )}
    >
      {VERIFICATION_LABEL[status]}
    </span>
  )
}
