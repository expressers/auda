"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { toast } from "sonner"

import { VerificationBadge } from "@/components/status-badge"
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
import { ACCOUNT_TYPE_LABEL } from "@/lib/labels"
import { useMockStore } from "@/lib/mock/store"

export default function AdminOrganizerDetailPage() {
  const params = useParams<{ id: string }>()
  const { state, reviewOrganizer } = useMockStore()
  const user = state.users.find((item) => item.id === params.id && item.role === "organizador")
  const [rejectOpen, setRejectOpen] = useState(false)
  const [reason, setReason] = useState("")

  if (!user) {
    return <p className="text-sm text-muted-foreground">Organizador não encontrado.</p>
  }

  const projects = state.projects.filter((project) => project.organizerId === user.id)

  function decide(decision: "approve" | "reject", message?: string) {
    const result = reviewOrganizer(user!.id, decision, message)
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success(decision === "approve" ? "Organizador verificado." : "Pedido rejeitado.")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{user.legalName || user.name}</h1>
            <VerificationBadge status={user.verificationStatus} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {user.accountType ? ACCOUNT_TYPE_LABEL[user.accountType] : "Organizador"} · {user.email}
          </p>
        </div>
        {user.verificationStatus === "pendente" ? (
          <div className="flex gap-2">
            <Button onClick={() => decide("approve")}>Aprovar</Button>
            <Button variant="destructive" onClick={() => setRejectOpen(true)}>
              Rejeitar
            </Button>
          </div>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados submetidos</CardTitle>
          <CardDescription>Validação manual pela administração.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <p><span className="text-muted-foreground">Responsável:</span> {user.name}</p>
          <p><span className="text-muted-foreground">Telemóvel:</span> {user.phone || "—"}</p>
          <p><span className="text-muted-foreground">Morada:</span> {user.address || "—"}</p>
          {user.bi ? <p><span className="text-muted-foreground">BI:</span> {user.bi}</p> : null}
          {user.nif ? <p><span className="text-muted-foreground">NIF:</span> {user.nif}</p> : null}
          {user.legalObject ? (
            <p><span className="text-muted-foreground">Objecto social:</span> {user.legalObject}</p>
          ) : null}
          <div>
            <p className="text-muted-foreground">Documentos</p>
            {user.documents.length === 0 ? (
              <p>Nenhum ficheiro.</p>
            ) : (
              <ul className="mt-1 list-disc pl-5">
                {user.documents.map((doc) => (
                  <li key={`${doc.name}-${doc.uploadedAt}`}>{doc.name}</li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Projectos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {projects.length === 0 ? (
            <p className="text-muted-foreground">Ainda sem projectos.</p>
          ) : (
            projects.map((project) => (
              <p key={project.id}>{project.title}</p>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar verificação</DialogTitle>
            <DialogDescription>O organizador vê este motivo na área de verificação.</DialogDescription>
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
                decide("reject", reason.trim())
                setRejectOpen(false)
                setReason("")
              }}
            >
              Rejeitar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
