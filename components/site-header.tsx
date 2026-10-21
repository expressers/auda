"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BellIcon, LogOutIcon, ShieldIcon, UserRoundIcon } from "lucide-react"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMockStore } from "@/lib/mock/store"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/projectos", label: "Projectos" },
  { href: "/#como-funciona", label: "Como funciona" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { currentUser, logout, state } = useMockStore()
  const unread = currentUser
    ? state.notifications.filter((item) => item.userId === currentUser.id && !item.read).length
    : 0

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-5 text-sm text-muted-foreground sm:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "hover:text-foreground",
                  pathname.startsWith("/projectos") && item.href === "/projectos" && "text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {currentUser ? (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href={currentUser.role === "admin" ? "/admin" : "/organizador/notificacoes"}
                  aria-label="Notificações"
                >
                  <span className="relative">
                    <BellIcon />
                    {unread > 0 ? (
                      <span className="absolute -top-1 -right-1 size-1.5 rounded-full bg-primary" />
                    ) : null}
                  </span>
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <UserRoundIcon />
                    {currentUser.name.split(" ")[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel className="font-normal">
                    <p className="text-sm font-medium">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {currentUser.role === "admin" ? (
                    <DropdownMenuItem onClick={() => router.push("/admin")}>
                      <ShieldIcon />
                      Administração
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => router.push("/organizador")}>
                      <UserRoundIcon />
                      Área do organizador
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => {
                      logout()
                      router.push("/")
                    }}
                  >
                    <LogOutIcon />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/entrar">Entrar</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/criar-conta">Criar conta</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
