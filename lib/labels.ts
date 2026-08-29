import type {
  AccountType,
  ProjectCategory,
  ProjectStatus,
  VerificationStatus,
} from "@/lib/types"

export const ACCOUNT_TYPE_LABEL: Record<AccountType, string> = {
  individual: "Pessoa individual",
  empresa: "Empresa",
  organizacao: "Organização",
}

export const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  agua: "Água e saneamento",
  educacao: "Educação",
  saude: "Saúde",
  religiao: "Fé e comunidade",
  empreendedorismo: "Empreendedorismo",
  comunidade: "Comunidade",
}

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  em_analise: "Em análise",
  aprovado: "Aprovado",
  rejeitado: "Rejeitado",
  publicado: "Publicado",
  pausado: "Pausado",
  encerrado: "Encerrado",
}

export const VERIFICATION_LABEL: Record<VerificationStatus, string> = {
  nao_submetido: "Não submetido",
  pendente: "Pendente",
  verificado: "Verificado",
  rejeitado: "Rejeitado",
}

export const CATEGORIES = Object.keys(CATEGORY_LABEL) as ProjectCategory[]
