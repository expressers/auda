import { formatKz, projectProgress } from "@/lib/format"
import type { Project } from "@/lib/types"

export function ProjectProgressBar({ project }: { project: Project }) {
  const value = projectProgress(project)
  return (
    <div className="grid gap-2">
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary" style={{ width: `${value}%` }} />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          <span className="font-medium text-foreground">{formatKz(project.raisedAmount)}</span>{" "}
          angariados
        </span>
        <span>
          {value}% de {formatKz(project.goalAmount)}
        </span>
      </div>
    </div>
  )
}
