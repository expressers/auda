"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { formatDate, formatKz } from "@/lib/format"
import { CATEGORY_LABEL } from "@/lib/labels"
import { useMockStore } from "@/lib/mock/store"

export default function AdminProjectDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const {
    state,
    reviewProject,
    pauseProject,
    resumeProject,
    closeProject,
    removeProject,
  } = useMockStore()
  const project = state.projects.find((item) => item.id === params.id)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [removeOpen, setRemoveOpen] = useState(false)
  const [reason, setReason] = useState("")

  if (!project) {
    return <p className="text-sm text-muted-foreground">Projecto não encontrado.</p>
  }

  const organizer = state.users.find((user) => user.id === project.organizerId)

  function run(action: () => { ok: boolean; error?: string }, success: string) {
    const result = action()
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success(success)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{project.title}</h1>
            <StatusBadge status={project.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {CATEGORY_LABEL[project.category]} · {project.location}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.status === "em_analise" ? (
            <>
              <Button onClick={() => run(() => reviewProject(project.id, "approve"), "Projecto aprovado.")}>
                Aprovar
              </Button>
              <Button variant="destructive" onClick={() => setRejectOpen(true)}>
                Rejeitar
              </Button>
            </>
          ) : null}
          {project.status === "publicado" ? (
            <Button variant="outline" onClick={() => run(() => pauseProject(project.id), "Pausado.")}>
              Pausar
            </Button>
          ) : null}
          {project.status === "pausado" ? (
            <Button variant="outline" onClick={() => run(() => resumeProject(project.id), "Retomado.")}>
              Retomar
            </Button>
          ) : null}
          {project.status === "publicado" || project.status === "pausado" ? (
            <Button variant="outline" onClick={() => run(() => closeProject(project.id), "Encerrado.")}>
              Encerrar
            </Button>
          ) : null}
          <Button variant="destructive" onClick={() => setRemoveOpen(true)}>
            Remover
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Angariado</CardDescription>
            <CardTitle>{formatKz(project.raisedAmount)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Meta</CardDescription>
            <CardTitle>{formatKz(project.goalAmount)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Limite</CardDescription>
            <CardTitle className="text-base">{formatDate(project.deadline)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organizador</CardTitle>
          <CardDescription>{organizer?.email}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          <p className="font-medium">{organizer?.legalName || organizer?.name}</p>
          <p className="mt-1 text-muted-foreground">{organizer?.address}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>História</CardTitle>
        </CardHeader>
        <CardContent className="whitespace-pre-line text-sm leading-7">{project.story}</CardContent>
      </Card>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar projecto</DialogTitle>
            <DialogDescription>Indique o motivo visível para o organizador.</DialogDescription>
          </DialogHeader>
          <Textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={4} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!reason.trim()) {
                  toast.error("Indique o motivo.")
                  return
                }
                run(() => reviewProject(project.id, "reject", reason.trim()), "Projecto rejeitado.")
                setRejectOpen(false)
                setReason("")
              }}
            >
              Rejeitar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover projecto</DialogTitle>
            <DialogDescription>
              Esta acção retira a campanha da plataforma. Não pode ser desfeita neste protótipo.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                run(() => removeProject(project.id), "Projecto removido.")
                setRemoveOpen(false)
                router.push("/admin/projectos")
              }}
            >
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
