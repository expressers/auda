"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"

import { Field } from "@/components/field"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RecoverPasswordPage() {
  const [channel, setChannel] = useState<"email" | "sms">("email")
  const [value, setValue] = useState("")
  const [sent, setSent] = useState(false)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!value.trim()) {
      toast.error("Indique o e-mail ou o telemóvel.")
      return
    }
    setSent(true)
    toast.success(
      channel === "email"
        ? "Se o e-mail existir, enviaremos instruções de recuperação."
        : "Se o número existir, enviaremos um código por SMS."
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recuperar palavra-passe</CardTitle>
        <CardDescription>
          Escolha e-mail ou SMS. Neste protótipo a mensagem é apenas simulada.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sent ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Verifique o {channel === "email" ? "e-mail" : "telemóvel"} {value}. Pode voltar a
              entrar com a palavra-passe de demonstração nas contas de teste.
            </p>
            <Button asChild>
              <Link href="/entrar">Voltar a entrar</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4">
            <RadioGroup
              value={channel}
              onValueChange={(next) => setChannel(next as "email" | "sms")}
              className="grid gap-2"
            >
              <label className="flex items-center gap-2 text-sm">
                <RadioGroupItem value="email" id="email-channel" />
                <span>E-mail</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <RadioGroupItem value="sms" id="sms-channel" />
                <span>SMS</span>
              </label>
            </RadioGroup>
            <Field
              label={channel === "email" ? "E-mail" : "Telemóvel"}
              htmlFor="recover"
            >
              <Input
                id="recover"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder={channel === "email" ? "nome@email.ao" : "923 000 000"}
              />
            </Field>
            <Button type="submit">Enviar instruções</Button>
          </form>
        )}
        <p className="mt-4 text-sm text-muted-foreground">
          <Link href="/entrar" className="hover:text-foreground">
            Voltar ao início de sessão
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
