"use client"

import { useMemo, useState } from "react"

import { ProjectCard } from "@/components/project-card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { isPubliclyVisible } from "@/lib/format"
import { CATEGORIES, CATEGORY_LABEL } from "@/lib/labels"
import { useMockStore } from "@/lib/mock/store"

export default function ProjectsPage() {
  const { state } = useMockStore()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<string>("todas")
  const [status, setStatus] = useState<string>("publicados")

  const projects = useMemo(() => {
    return state.projects.filter((project) => {
      if (!isPubliclyVisible(project)) return false
      if (status === "publicados" && project.status !== "publicado") return false
      if (status !== "todos" && status !== "publicados" && project.status !== status) {
        return false
      }
      if (category !== "todas" && project.category !== category) return false
      const haystack = `${project.title} ${project.summary} ${project.location}`.toLowerCase()
      return haystack.includes(query.trim().toLowerCase())
    })
  }, [state.projects, query, category, status])

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Projectos</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Campanhas públicas em Angola. Contribua via Multicaixa Express.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Input
          placeholder="Pesquisar por nome ou local"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as categorias</SelectItem>
            {CATEGORIES.map((item) => (
              <SelectItem key={item} value={item}>
                {CATEGORY_LABEL[item]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="publicados">A angariar</SelectItem>
            <SelectItem value="pausado">Pausados</SelectItem>
            <SelectItem value="encerrado">Encerrados</SelectItem>
            <SelectItem value="todos">Todos os públicos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {projects.length === 0 ? (
        <p className="mt-16 text-sm text-muted-foreground">Nenhum projecto corresponde à pesquisa.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              organizer={state.users.find((user) => user.id === project.organizerId)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
