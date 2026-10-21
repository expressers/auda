"use client"

import { useState } from "react"

import { Field } from "@/components/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CATEGORIES, CATEGORY_LABEL } from "@/lib/labels"
import type { Project, ProjectCategory } from "@/lib/types"

export type ProjectFormValues = {
  title: string
  summary: string
  story: string
  category: ProjectCategory
  location: string
  goalAmount: string
  deadline: string
}

export function valuesFromProject(project: Project): ProjectFormValues {
  return {
    title: project.title,
    summary: project.summary,
    story: project.story,
    category: project.category,
    location: project.location,
    goalAmount: String(project.goalAmount),
    deadline: project.deadline.slice(0, 10),
  }
}

export function ProjectForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: ProjectFormValues
  submitLabel: string
  onSubmit: (values: ProjectFormValues) => void
}) {
  const [values, setValues] = useState<ProjectFormValues>(
    initial ?? {
      title: "",
      summary: "",
      story: "",
      category: "comunidade",
      location: "",
      goalAmount: "",
      deadline: "",
    }
  )
  const [error, setError] = useState("")

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!values.title.trim() || !values.summary.trim() || !values.story.trim()) {
      setError("Preencha o título, o resumo e a história do projecto.")
      return
    }
    if (!values.location.trim() || !values.deadline) {
      setError("Indique a localização e a data limite.")
      return
    }
    const amount = Number(values.goalAmount.replace(/\s/g, ""))
    if (!Number.isFinite(amount) || amount < 10000) {
      setError("A meta deve ser pelo menos 10.000 Kz.")
      return
    }
    setError("")
    onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} className="grid max-w-2xl gap-5">
      <Field label="Título" htmlFor="title">
        <Input
          id="title"
          value={values.title}
          onChange={(event) => setValues({ ...values, title: event.target.value })}
        />
      </Field>
      <Field label="Resumo" htmlFor="summary" hint="Uma ou duas frases para a listagem pública.">
        <Textarea
          id="summary"
          rows={3}
          value={values.summary}
          onChange={(event) => setValues({ ...values, summary: event.target.value })}
        />
      </Field>
      <Field label="História" htmlFor="story">
        <Textarea
          id="story"
          rows={8}
          value={values.story}
          onChange={(event) => setValues({ ...values, story: event.target.value })}
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Categoria">
          <Select
            value={values.category}
            onValueChange={(value) =>
              setValues({ ...values, category: value as ProjectCategory })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {CATEGORY_LABEL[category]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Localização" htmlFor="location">
          <Input
            id="location"
            placeholder="Samba, Luanda"
            value={values.location}
            onChange={(event) => setValues({ ...values, location: event.target.value })}
          />
        </Field>
        <Field label="Meta (Kz)" htmlFor="goal">
          <Input
            id="goal"
            inputMode="numeric"
            value={values.goalAmount}
            onChange={(event) => setValues({ ...values, goalAmount: event.target.value })}
          />
        </Field>
        <Field label="Data limite" htmlFor="deadline">
          <Input
            id="deadline"
            type="date"
            value={values.deadline}
            onChange={(event) => setValues({ ...values, deadline: event.target.value })}
          />
        </Field>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}
