"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { useMockStore } from "@/lib/mock/store"
import { formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"

export default function NotificationsPage() {
  const { currentUser, state, markNotificationRead, markAllNotificationsRead } = useMockStore()
  const items = state.notifications.filter((item) => item.userId === currentUser?.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Notificações</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Contribuições, alterações de estado e alertas administrativos.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={markAllNotificationsRead}>
          Marcar todas como lidas
        </Button>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sem notificações.</p>
      ) : (
        <div className="divide-y rounded-xl border">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href || "/organizador"}
              onClick={() => markNotificationRead(item.id)}
              className={cn("block p-4 hover:bg-muted/40", !item.read && "bg-accent/40")}
            >
              <p className="text-sm font-medium">{item.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              <p className="mt-2 text-xs text-muted-foreground">{formatDate(item.createdAt)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
