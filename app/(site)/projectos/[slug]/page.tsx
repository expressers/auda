"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { MapPinIcon } from "lucide-react"

import { ProjectCover } from "@/components/project-cover"
import { ProjectProgressBar } from "@/components/project-progress"
import { StatusBadge } from "@/components/status-badge"
import { VerifiedBadge } from "@/components/verified-badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { canContribute, formatDate, formatKz, isPubliclyVisible } from "@/lib/format"
import { CATEGORY_LABEL } from "@/lib/labels"
import { useMockStore } from "@/lib/mock/store"

export default function ProjectDetailPage() {
  const params = useParams<{ slug: string }>()
  const { state } = useMockStore()
  const project = state.projects.find((item) => item.slug === params.slug)

  if (!project || !isPubliclyVisible(project)) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <h1 className="text-2xl font-semibold">Projecto indisponível</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Esta campanha não está publicada ou foi removida.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/projectos">Voltar aos projectos</Link>
        </Button>
      </div>
    )
  }

  const organizer = state.users.find((user) => user.id === project.organizerId)
  const contributions = state.contributions.filter((item) => item.projectId === project.id)

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[1fr_320px]">
      <article>
        <ProjectCover category={project.category} className="h-52 w-full rounded-xl md:h-64" />
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>{CATEGORY_LABEL[project.category]}</span>
          <StatusBadge status={project.status} />
          <span className="inline-flex items-center gap-1">
            <MapPinIcon className="size-3.5" />
            {project.location}
          </span>
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{project.title}</h1>
        <p className="mt-3 text-muted-foreground">{project.summary}</p>
        <div className="mt-8 space-y-4 whitespace-pre-line text-sm leading-7">{project.story}</div>

        {project.updates.length > 0 ? (
          <section className="mt-12">
            <h2 className="text-lg font-semibold">Actualizações</h2>
            <div className="mt-4 space-y-4">
              {project.updates.map((update) => (
                <div key={update.id} className="rounded-lg border p-4">
                  <p className="text-sm font-medium">{update.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDate(update.createdAt)}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{update.body}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-12">
          <h2 className="text-lg font-semibold">Contribuintes</h2>
          <div className="mt-4 divide-y rounded-lg border">
            {contributions.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">Ainda sem contribuições.</p>
            ) : (
              contributions.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 p-4 text-sm">
                  <div>
                    <p className="font-medium">{item.contributorName ?? "Anónimo"}</p>
                    {item.message ? (
                      <p className="text-muted-foreground">{item.message}</p>
                    ) : null}
                  </div>
                  <p className="font-medium">{formatKz(item.amount)}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </article>

      <aside className="h-fit rounded-xl border p-5 lg:sticky lg:top-20">
        <ProjectProgressBar project={project} />
        <p className="mt-3 text-xs text-muted-foreground">
          {project.contributorCount} contribuintes · até {formatDate(project.deadline)}
        </p>
        <Separator className="my-4" />
        <p className="text-sm font-medium">{organizer?.legalName || organizer?.name}</p>
        {organizer?.verificationStatus === "verificado" ? (
          <VerifiedBadge className="mt-1" />
        ) : null}
        <p className="mt-2 text-xs text-muted-foreground">{organizer?.address}</p>
        {canContribute(project) ? (
          <Button className="mt-5 w-full" asChild>
            <Link href={`/projectos/${project.slug}/contribuir`}>Contribuir</Link>
          </Button>
        ) : (
          <p className="mt-5 text-sm text-muted-foreground">
            Esta campanha não está a aceitar contribuições.
          </p>
        )}
      </aside>
    </div>
  )
}
