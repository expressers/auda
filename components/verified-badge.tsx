import { BadgeCheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium text-primary",
        className
      )}
    >
      <BadgeCheckIcon className="size-3.5" />
      Organizador verificado
    </span>
  )
}
