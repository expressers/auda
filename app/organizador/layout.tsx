"use client"

import {
  BellIcon,
  FolderKanbanIcon,
  LayoutDashboardIcon,
  ShieldCheckIcon,
} from "lucide-react"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardShell } from "@/components/dashboard-shell"

const ITEMS = [
  { href: "/organizador", label: "Painel", icon: LayoutDashboardIcon },
  { href: "/organizador/projectos/novo", label: "Novo projecto", icon: FolderKanbanIcon },
  { href: "/organizador/verificacao", label: "Verificação", icon: ShieldCheckIcon },
  { href: "/organizador/notificacoes", label: "Notificações", icon: BellIcon },
]

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard role="organizador">
      <DashboardShell items={ITEMS} homeHref="/organizador">
        {children}
      </DashboardShell>
    </AuthGuard>
  )
}
