"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { MockStoreProvider } from "@/lib/mock/store"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <MockStoreProvider>
        {children}
        <Toaster position="top-center" />
      </MockStoreProvider>
    </TooltipProvider>
  )
}
