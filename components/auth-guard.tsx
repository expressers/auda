"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useMockStore } from "@/lib/mock/store"
import type { Role } from "@/lib/types"

export function AuthGuard({
  role,
  children,
}: {
  role: Role
  children: React.ReactNode
}) {
  const router = useRouter()
  const { currentUser, hydrated } = useMockStore()

  useEffect(() => {
    if (!hydrated) return
    if (!currentUser) {
      router.replace("/entrar")
      return
    }
    if (currentUser.role !== role) {
      router.replace(currentUser.role === "admin" ? "/admin" : "/organizador")
    }
  }, [hydrated, currentUser, role, router])

  if (!hydrated || !currentUser || currentUser.role !== role) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
        A carregar…
      </div>
    )
  }

  return <>{children}</>
}
