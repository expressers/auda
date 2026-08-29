"use client"

import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

import { ProjectForm, valuesFromProject, type ProjectFormValues } from "@/components/project-form"
import { canEditProject } from "@/lib/format"
import { useMockStore } from "@/lib/mock/store"

export default function EditProjectPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { currentUser, state, updateProject } = useMockStore()
  const project = state.projects.find(
    (item) => item.id === params.id && item.organizerId === currentUser?.id
  )

  if (!project) {
    return <p className="text-sm text-muted-foreground">Projecto não encontrado.</p>
  }

  if (!canEditProject(project)) {
    return (
      <p className="text-sm text-muted-foreground">
        Este projecto já foi publicado e não pode ser editado.
      </p>
    )
  }

  function handleSubmit(values: ProjectFormValues) {
    const result = updateProject(project!.id, {
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
    toast.success("Projecto actualizado.")
    router.push(`/organizador/projectos/${project!.id}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Editar projecto</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A edição só é possível antes da publicação.
        </p>
      </div>
      <ProjectForm
        initial={valuesFromProject(project)}
        submitLabel="Guardar alterações"
        onSubmit={handleSubmit}
      />
    </div>
  )
}
