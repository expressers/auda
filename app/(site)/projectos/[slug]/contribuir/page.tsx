"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

import { Field } from "@/components/field"
import { McxDialog } from "@/components/mcx-dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { canContribute, formatKz } from "@/lib/format"
import { useMockStore } from "@/lib/mock/store"

const PRESETS = [5_000, 10_000, 25_000, 50_000, 100_000]

export default function ContributePage() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const { state, contribute } = useMockStore()
  const project = state.projects.find((item) => item.slug === params.slug)

  const [amount, setAmount] = useState(10_000)
  const [custom, setCustom] = useState("")
  const [name, setName] = useState("")
  const [anonymous, setAnonymous] = useState(false)
  const [message, setMessage] = useState("")
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState<{ reference: string; amount: number } | null>(null)

  if (!project || !canContribute(project)) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20">
        <h1 className="text-2xl font-semibold">Contribuição indisponível</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Esta campanha não está a aceitar pagamentos neste momento.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/projectos">Ver projectos</Link>
        </Button>
      </div>
    )
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20">
        <p className="text-sm font-medium text-primary">Pagamento confirmado</p>
        <h1 className="mt-2 text-2xl font-semibold">Obrigado pela contribuição</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {formatKz(done.amount)} foram associados a «{project.title}». Referência Multicaixa
          Express {done.reference}.
        </p>
        <Button className="mt-6" asChild>
          <Link href={`/projectos/${project.slug}`}>Voltar ao projecto</Link>
        </Button>
      </div>
    )
  }

  const selectedAmount = custom ? Number(custom.replace(/\s/g, "")) || 0 : amount

  function openCheckout() {
    if (!Number.isFinite(selectedAmount) || selectedAmount < 1000) {
      toast.error("O valor mínimo é 1.000 Kz.")
      return
    }
    if (!anonymous && !name.trim()) {
      toast.error("Indique o nome ou escolha contribuir em anónimo.")
      return
    }
    setOpen(true)
  }

  function confirm(phone: string) {
    const result = contribute({
      projectId: project!.id,
      amount: selectedAmount,
      contributorName: anonymous ? null : name.trim(),
      message: message.trim() || undefined,
      phone,
    })
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    setOpen(false)
    setDone({ reference: result.reference ?? "", amount: selectedAmount })
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <p className="text-sm text-muted-foreground">
        <Link href={`/projectos/${project.slug}`} className="hover:text-foreground">
          {project.title}
        </Link>
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Contribuir</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Pagamento simulado via Multicaixa Express. Não é criada uma carteira na AUDA.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {PRESETS.map((value) => (
          <Button
            key={value}
            type="button"
            variant={!custom && amount === value ? "default" : "outline"}
            onClick={() => {
              setAmount(value)
              setCustom("")
            }}
          >
            {formatKz(value)}
          </Button>
        ))}
      </div>

      <div className="mt-6 grid gap-5">
        <Field label="Outro valor (Kz)" htmlFor="custom">
          <Input
            id="custom"
            inputMode="numeric"
            placeholder="15000"
            value={custom}
            onChange={(event) => setCustom(event.target.value)}
          />
        </Field>
        <Field label="Nome" htmlFor="name">
          <Input
            id="name"
            value={name}
            disabled={anonymous}
            onChange={(event) => setName(event.target.value)}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={anonymous}
            onCheckedChange={(checked) => setAnonymous(Boolean(checked))}
          />
          Contribuir em anónimo
        </label>
        <Field label="Mensagem (opcional)" htmlFor="message">
          <Textarea
            id="message"
            rows={3}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </Field>
        <Button onClick={openCheckout}>Continuar para Multicaixa Express</Button>
      </div>

      <McxDialog
        open={open}
        onOpenChange={setOpen}
        amount={selectedAmount}
        projectTitle={project.title}
        onConfirm={confirm}
      />
    </div>
  )
}
