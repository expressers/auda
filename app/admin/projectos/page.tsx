"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

import { StatusBadge } from "@/components/status-badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatKz } from "@/lib/format"
import { STATUS_LABEL } from "@/lib/labels"
import { useMockStore } from "@/lib/mock/store"
import type { ProjectStatus } from "@/lib/types"

const STATUSES: ProjectStatus[] = [
  "em_analise",
  "aprovado",
  "rejeitado",
  "publicado",
  "pausado",
  "encerrado",
]

export default function AdminProjectsPage() {
  const { state } = useMockStore()
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("todos")

  const projects = useMemo(() => {
    return state.projects.filter((project) => {
      if (status !== "todos" && project.status !== status) return false
      const organizer = state.users.find((user) => user.id === project.organizerId)
      const haystack = `${project.title} ${organizer?.name ?? ""}`.toLowerCase()
      return haystack.includes(query.trim().toLowerCase())
    })
  }, [state.projects, state.users, query, status])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Projectos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Aprovar, rejeitar, pausar, encerrar ou remover campanhas.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          placeholder="Pesquisar"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os estados</SelectItem>
            {STATUSES.map((item) => (
              <SelectItem key={item} value={item}>
                {STATUS_LABEL[item]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Projecto</TableHead>
            <TableHead>Organizador</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Angariado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => {
            const organizer = state.users.find((user) => user.id === project.organizerId)
            return (
              <TableRow key={project.id}>
                <TableCell>
                  <Link
                    href={`/admin/projectos/${project.id}`}
                    className="font-medium hover:underline"
                  >
                    {project.title}
                  </Link>
                </TableCell>
                <TableCell>{organizer?.legalName || organizer?.name}</TableCell>
                <TableCell>
                  <StatusBadge status={project.status} />
                </TableCell>
                <TableCell className="text-right">{formatKz(project.raisedAmount)}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
