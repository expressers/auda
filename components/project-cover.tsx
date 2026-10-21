import {
  ChurchIcon,
  DropletsIcon,
  GraduationCapIcon,
  HeartPulseIcon,
  StoreIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"

import type { ProjectCategory } from "@/lib/types"
import { cn } from "@/lib/utils"

const COVER: Record<ProjectCategory, { gradient: string; icon: LucideIcon }> = {
  agua: { gradient: "from-sky-500 to-blue-800", icon: DropletsIcon },
  educacao: { gradient: "from-blue-500 to-indigo-800", icon: GraduationCapIcon },
  saude: { gradient: "from-cyan-600 to-blue-900", icon: HeartPulseIcon },
  religiao: { gradient: "from-indigo-500 to-slate-800", icon: ChurchIcon },
  empreendedorismo: { gradient: "from-blue-600 to-slate-900", icon: StoreIcon },
  comunidade: { gradient: "from-sky-600 to-slate-800", icon: UsersIcon },
}

export function ProjectCover({
  category,
  className,
}: {
  category: ProjectCategory
  className?: string
}) {
  const { gradient, icon: Icon } = COVER[category]
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-gradient-to-br text-white",
        gradient,
        className
      )}
    >
      <span suppressHydrationWarning>
        <Icon className="size-10 opacity-90" />
      </span>
    </div>
  )
}
