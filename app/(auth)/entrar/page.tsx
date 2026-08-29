"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Field } from "@/components/field"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DEMO_PASSWORD } from "@/lib/mock/seed"
import { useMockStore } from "@/lib/mock/store"

export default function LoginPage() {
  const router = useRouter()
  const { login, currentUser, hydrated } = useMockStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (!hydrated || !currentUser) return
    router.replace(currentUser.role === "admin" ? "/admin" : "/organizador")
  }, [hydrated, currentUser, router])

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const result = login(email, password)
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    router.push(result.role === "admin" ? "/admin" : "/organizador")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Aceda à área do organizador ou à administração.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <Field label="E-mail" htmlFor="email">
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </Field>
          <Field label="Palavra-passe" htmlFor="password">
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </Field>
          <Button type="submit">Entrar</Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          <Link href="/recuperar-palavra-passe" className="hover:text-foreground">
            Recuperar palavra-passe
          </Link>
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Ainda não tem conta?{" "}
          <Link href="/criar-conta" className="text-foreground underline-offset-4 hover:underline">
            Criar conta
          </Link>
        </p>
        <div className="mt-6 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Contas de demonstração</p>
          <p className="mt-2">organizador@auda.ao · {DEMO_PASSWORD}</p>
          <p>admin@auda.ao · {DEMO_PASSWORD}</p>
        </div>
      </CardContent>
    </Card>
  )
}
