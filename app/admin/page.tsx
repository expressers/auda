"use client"

import Link from "next/link"

import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { exportFinancialCsv, exportOperationalCsv } from "@/lib/csv"
import { formatKz } from "@/lib/format"
import { STATUS_LABEL } from "@/lib/labels"
import { useMockStore } from "@/lib/mock/store"
import type { ProjectStatus } from "@/lib/types"

const STATUSES: ProjectStatus[] = [
  "em_analise",
  "aprovado",
  "publicado",
  "pausado",
  "encerrado",
  "rejeitado",
]

export default function AdminOverviewPage() {
  const { state } = useMockStore()
  const raised = state.projects.reduce((sum, project) => sum + project.raisedAmount, 0)
  const pendingOrganizers = state.users.filter(
    (user) => user.role === "organizador" && user.verificationStatus === "pendente"
  )
  const pendingProjects = state.projects.filter((project) => project.status === "em_analise")

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Administração</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Validação de organizadores, publicação de campanhas e totais da plataforma.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportFinancialCsv(state)}>
            Relatório financeiro
          </Button>
          <Button variant="outline" onClick={() => exportOperationalCsv(state)}>
            Relatório operacional
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total angariado</CardDescription>
            <CardTitle className="text-2xl">{formatKz(raised)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Projectos em análise</CardDescription>
            <CardTitle className="text-2xl">{pendingProjects.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Verificações pendentes</CardDescription>
            <CardTitle className="text-2xl">{pendingOrganizers.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projectos por estado</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {STATUSES.map((status) => {
            const count = state.projects.filter((project) => project.status === status).length
            return (
              <div key={status} className="rounded-lg border px-3 py-2 text-sm">
                <StatusBadge status={status} />
                <p className="mt-2 font-medium">{count}</p>
                <p className="text-xs text-muted-foreground">{STATUS_LABEL[status]}</p>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>À espera de decisão</CardTitle>
            <CardDescription>Projectos em análise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nada pendente.</p>
            ) : (
              pendingProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/admin/projectos/${project.id}`}
                  className="block text-sm font-medium hover:underline"
                >
                  {project.title}
                </Link>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Organizadores</CardTitle>
            <CardDescription>Pedidos de verificação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingOrganizers.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nada pendente.</p>
            ) : (
              pendingOrganizers.map((user) => (
                <Link
                  key={user.id}
                  href={`/admin/organizadores/${user.id}`}
                  className="block text-sm font-medium hover:underline"
                >
                  {user.name}
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
