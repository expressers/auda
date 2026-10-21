"use client"

import {
  FolderKanbanIcon,
  LayoutDashboardIcon,
  UsersIcon,
} from "lucide-react"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardShell } from "@/components/dashboard-shell"

const ITEMS = [
  { href: "/admin", label: "Painel", icon: LayoutDashboardIcon },
  { href: "/admin/projectos", label: "Projectos", icon: FolderKanbanIcon },
  { href: "/admin/organizadores", label: "Organizadores", icon: UsersIcon },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard role="admin">
      <DashboardShell items={ITEMS} homeHref="/admin">
        {children}
      </DashboardShell>
    </AuthGuard>
  )
}
