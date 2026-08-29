"use client"

import Link from "next/link"
import { BadgeCheckIcon, CreditCardIcon, FileCheckIcon } from "lucide-react"

import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { isPubliclyVisible } from "@/lib/format"
import { useMockStore } from "@/lib/mock/store"

const STEPS = [
  {
    icon: FileCheckIcon,
    title: "Crie a conta e verifique-se",
    body: "Pessoas, empresas e organizações submetem identificação. A administração valida os dados.",
  },
  {
    icon: BadgeCheckIcon,
    title: "Submeta o projecto",
    body: "A campanha só é publicada depois de analisada. Organizadores verificados recebem um selo público.",
  },
  {
    icon: CreditCardIcon,
    title: "Receba via Multicaixa Express",
    body: "As contribuições ficam associadas ao projecto. Não existe carteira digital interna.",
  },
]

export default function HomePage() {
  const { state } = useMockStore()
  const featured = state.projects
    .filter((project) => project.status === "publicado")
    .slice(0, 3)
  const organizers = state.users

  return (
    <div>
      <section className="mx-auto w-full max-w-6xl px-4 py-20 md:py-28">
        <p className="text-sm font-medium text-primary">Crowdfunding em Angola</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">
          Angarie fundos com transparência.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          A AUDA ajuda pessoas, empresas e organizações a publicar campanhas e a receber
          contribuições via Multicaixa Express — com verificação e acompanhamento claro.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" asChild>
            <Link href="/projectos">Explorar projectos</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/criar-conta">Criar conta</Link>
          </Button>
        </div>
      </section>

      <section id="como-funciona" className="border-y bg-zinc-50">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <div key={step.title} className="space-y-3">
              <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <step.icon className="size-4" />
              </div>
              <p className="text-xs font-medium text-muted-foreground">0{index + 1}</p>
              <h2 className="text-lg font-semibold">{step.title}</h2>
              <p className="text-sm text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Projectos em destaque</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Campanhas públicas com organizadores identificados.
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/projectos">Ver todos</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              organizer={organizers.find((user) => user.id === project.organizerId)}
            />
          ))}
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-16 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold tracking-tight">Confiança em primeiro lugar</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Só projectos aprovados são publicados. Organizadores verificados mostram um selo
              visível. {state.projects.filter(isPubliclyVisible).length} campanhas públicas neste
              momento.
            </p>
          </div>
          <Button size="lg" asChild>
            <Link href="/criar-conta">Começar um projecto</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
