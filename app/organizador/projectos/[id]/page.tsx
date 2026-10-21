"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

import { ContributionChart } from "@/components/contribution-chart"
import { ProjectProgressBar } from "@/components/project-progress"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { canEditProject, formatDate, formatKz } from "@/lib/format"
import { useMockStore } from "@/lib/mock/store"

export default function OrganizerProjectPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { currentUser, state, publishProject, pauseProject, resumeProject, closeProject } =
    useMockStore()
  const project = state.projects.find(
    (item) => item.id === params.id && item.organizerId === currentUser?.id
  )

  if (!project) {
    return <p className="text-sm text-muted-foreground">Projecto não encontrado.</p>
  }

  const contributions = state.contributions.filter((item) => item.projectId === project.id)

  function run(action: () => { ok: boolean; error?: string }, success: string) {
    const result = action()
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success(success)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{project.title}</h1>
            <StatusBadge status={project.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {project.location} · até {formatDate(project.deadline)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canEditProject(project) ? (
            <Button variant="outline" asChild>
              <Link href={`/organizador/projectos/${project.id}/editar`}>Editar</Link>
            </Button>
          ) : null}
          {project.status === "aprovado" ? (
            <Button onClick={() => run(() => publishProject(project.id), "Campanha publicada.")}>
              Publicar
            </Button>
          ) : null}
          {project.status === "publicado" ? (
            <Button
              variant="outline"
              onClick={() => run(() => pauseProject(project.id), "Campanha pausada.")}
            >
              Pausar
            </Button>
          ) : null}
          {project.status === "pausado" ? (
            <Button
              variant="outline"
              onClick={() => run(() => resumeProject(project.id), "Campanha retomada.")}
            >
              Retomar
            </Button>
          ) : null}
          {project.status === "publicado" || project.status === "pausado" ? (
            <Button
              variant="destructive"
              onClick={() => {
                run(() => closeProject(project.id), "Campanha encerrada.")
                router.refresh()
              }}
            >
              Encerrar
            </Button>
          ) : null}
          {project.status === "publicado" ? (
            <Button variant="ghost" asChild>
              <Link href={`/projectos/${project.slug}`}>Ver página pública</Link>
            </Button>
          ) : null}
        </div>
      </div>

      {project.status === "rejeitado" && project.rejectionReason ? (
        <p className="text-sm text-destructive">Motivo da rejeição: {project.rejectionReason}</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Angariado</CardDescription>
            <CardTitle>{formatKz(project.raisedAmount)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Contribuintes</CardDescription>
            <CardTitle>{project.contributorCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Meta</CardDescription>
            <CardTitle>{formatKz(project.goalAmount)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progresso</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectProgressBar project={project} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Evolução temporal</CardTitle>
        </CardHeader>
        <CardContent>
          <ContributionChart contributions={contributions} projectId={project.id} />
        </CardContent>
      </Card>
    </div>
  )
}
