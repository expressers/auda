"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { ProjectForm, type ProjectFormValues } from "@/components/project-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useMockStore } from "@/lib/mock/store"

export default function NewProjectPage() {
  const router = useRouter()
  const { currentUser, createProject } = useMockStore()
  const verified = currentUser?.verificationStatus === "verificado"

  function handleSubmit(values: ProjectFormValues) {
    const result = createProject({
      title: values.title,
      summary: values.summary,
      story: values.story,
      category: values.category,
      location: values.location,
      goalAmount: Number(values.goalAmount.replace(/\s/g, "")),
      deadline: values.deadline,
    })
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success("Projecto submetido. Entrou em análise.")
    router.push(`/organizador/projectos/${result.id}`)
  }

  if (!verified) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <Alert>
          <AlertTitle>Verificação necessária</AlertTitle>
          <AlertDescription>
            Só organizadores verificados podem submeter projectos.
          </AlertDescription>
        </Alert>
        <Button asChild>
          <Link href="/organizador/verificacao">Ir para verificação</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Novo projecto</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A campanha entra automaticamente em análise após a submissão.
        </p>
      </div>
      <ProjectForm submitLabel="Submeter para análise" onSubmit={handleSubmit} />
    </div>
  )
}
