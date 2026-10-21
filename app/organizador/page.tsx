"use client"

import Link from "next/link"

import { ContributionChart } from "@/components/contribution-chart"
import { StatusBadge, VerificationBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatKz, projectProgress } from "@/lib/format"
import { useMockStore } from "@/lib/mock/store"

export default function OrganizerDashboardPage() {
  const { currentUser, state } = useMockStore()
  const projects = state.projects.filter((project) => project.organizerId === currentUser?.id)
  const contributions = state.contributions.filter((item) =>
    projects.some((project) => project.id === item.projectId)
  )
  const raised = projects.reduce((sum, project) => sum + project.raisedAmount, 0)
  const contributors = projects.reduce((sum, project) => sum + project.contributorCount, 0)
  const unread = state.notifications.filter(
    (item) => item.userId === currentUser?.id && !item.read
  ).length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Olá, {currentUser?.name.split(" ")[0]}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acompanhe as campanhas e o valor angariado.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <VerificationBadge status={currentUser?.verificationStatus ?? "nao_submetido"} />
          <Button asChild>
            <Link href="/organizador/projectos/novo">Novo projecto</Link>
          </Button>
        </div>
      </div>

      {currentUser?.verificationStatus !== "verificado" ? (
        <Card>
          <CardHeader>
            <CardTitle>Verificação pendente</CardTitle>
            <CardDescription>
              Submeta os documentos para obter o selo de organizador verificado e poder publicar
              campanhas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/organizador/verificacao">Completar verificação</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total angariado</CardDescription>
            <CardTitle className="text-2xl">{formatKz(raised)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Contribuintes</CardDescription>
            <CardTitle className="text-2xl">{contributors}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Notificações</CardDescription>
            <CardTitle className="text-2xl">{unread}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evolução das contribuições</CardTitle>
          <CardDescription>Últimos 14 dias, em todos os seus projectos.</CardDescription>
        </CardHeader>
        <CardContent>
          <ContributionChart contributions={contributions} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Projectos</CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <p className="text-sm text-muted-foreground">Ainda não submeteu projectos.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead className="text-right">Angariado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <Link
                        href={`/organizador/projectos/${project.id}`}
                        className="font-medium hover:underline"
                      >
                        {project.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={project.status} />
                    </TableCell>
                    <TableCell>{projectProgress(project)}%</TableCell>
                    <TableCell className="text-right">{formatKz(project.raisedAmount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
