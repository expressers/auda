import Link from "next/link"

import { ProjectCover } from "@/components/project-cover"
import { ProjectProgressBar } from "@/components/project-progress"
import { StatusBadge } from "@/components/status-badge"
import { VerifiedBadge } from "@/components/verified-badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CATEGORY_LABEL } from "@/lib/labels"
import type { Project, User } from "@/lib/types"

export function ProjectCard({
  project,
  organizer,
}: {
  project: Project
  organizer?: User
}) {
  return (
    <Card className="h-full py-0">
      <Link href={`/projectos/${project.slug}`} className="flex h-full flex-col">
        <ProjectCover category={project.category} className="h-36 w-full rounded-t-xl" />
        <CardHeader className="gap-2 pt-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">{CATEGORY_LABEL[project.category]}</p>
            <StatusBadge status={project.status} />
          </div>
          <CardTitle className="text-base leading-snug">{project.title}</CardTitle>
          <p className="line-clamp-2 text-sm text-muted-foreground">{project.summary}</p>
        </CardHeader>
        <CardContent className="mt-auto">
          <ProjectProgressBar project={project} />
        </CardContent>
        <CardFooter className="border-t text-xs text-muted-foreground">
          <div className="flex w-full items-center justify-between gap-2">
            <span>{organizer?.legalName || organizer?.name || "Organizador"}</span>
            {organizer?.verificationStatus === "verificado" ? <VerifiedBadge /> : null}
          </div>
        </CardFooter>
      </Link>
    </Card>
  )
}
