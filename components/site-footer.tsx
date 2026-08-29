"use client"

import Link from "next/link"

import { Logo } from "@/components/logo"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Plataforma de angariação de fundos para pessoas, empresas e organizações em Angola.
            Sem carteira interna. Contribuições via Multicaixa Express.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div className="space-y-2">
            <p className="font-medium">Plataforma</p>
            <Link href="/projectos" className="block text-muted-foreground hover:text-foreground">
              Projectos
            </Link>
            <Link href="/criar-conta" className="block text-muted-foreground hover:text-foreground">
              Criar conta
            </Link>
            <Link href="/entrar" className="block text-muted-foreground hover:text-foreground">
              Entrar
            </Link>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Confiança</p>
            <p className="text-muted-foreground">Organizadores verificados</p>
            <p className="text-muted-foreground">Validação humana</p>
            <p className="text-muted-foreground">Luanda, Angola</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
