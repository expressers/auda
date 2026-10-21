"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Field } from "@/components/field"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ACCOUNT_TYPE_LABEL } from "@/lib/labels"
import { useMockStore } from "@/lib/mock/store"
import type { AccountType } from "@/lib/types"

const TYPES: AccountType[] = ["individual", "empresa", "organizacao"]

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useMockStore()
  const [accountType, setAccountType] = useState<AccountType>("individual")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (password.length < 4) {
      toast.error("A palavra-passe deve ter pelo menos 4 caracteres.")
      return
    }
    if (password !== confirm) {
      toast.error("As palavras-passe não coincidem.")
      return
    }
    const result = register({
      accountType,
      name,
      email,
      phone,
      password,
    })
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success("Conta criada. Complete a verificação para submeter projectos.")
    router.push("/organizador/verificacao")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar conta</CardTitle>
        <CardDescription>
          Contas para pessoas individuais, empresas e organizações reconhecidas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <Field label="Tipo de conta">
            <RadioGroup
              value={accountType}
              onValueChange={(value) => setAccountType(value as AccountType)}
              className="grid gap-2"
            >
              {TYPES.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 rounded-lg border p-3 text-sm has-[[data-state=checked]]:border-primary"
                >
                  <RadioGroupItem value={type} id={type} />
                  <span>{ACCOUNT_TYPE_LABEL[type]}</span>
                </label>
              ))}
            </RadioGroup>
          </Field>
          <Field
            label={accountType === "individual" ? "Nome completo" : "Nome do responsável"}
            htmlFor="name"
          >
            <Input id="name" value={name} onChange={(event) => setName(event.target.value)} required />
          </Field>
          <Field label="E-mail" htmlFor="email">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </Field>
          <Field label="Telemóvel" htmlFor="phone">
            <Input
              id="phone"
              placeholder="+244 9XX XXX XXX"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
            />
          </Field>
          <Field label="Palavra-passe" htmlFor="password">
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </Field>
          <Field label="Confirmar palavra-passe" htmlFor="confirm">
            <Input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              required
            />
          </Field>
          <Button type="submit">Criar conta</Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link href="/entrar" className="text-foreground underline-offset-4 hover:underline">
            Entrar
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
