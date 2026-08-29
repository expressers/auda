"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Field } from "@/components/field"
import { VerificationBadge } from "@/components/status-badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ACCOUNT_TYPE_LABEL } from "@/lib/labels"
import { useMockStore } from "@/lib/mock/store"
import type { UploadedDocument } from "@/lib/types"

export default function VerificationPage() {
  const { currentUser, submitVerification } = useMockStore()
  const [address, setAddress] = useState(currentUser?.address ?? "")
  const [phone, setPhone] = useState(currentUser?.phone ?? "")
  const [bi, setBi] = useState(currentUser?.bi ?? "")
  const [nif, setNif] = useState(currentUser?.nif ?? "")
  const [legalName, setLegalName] = useState(currentUser?.legalName ?? "")
  const [legalObject, setLegalObject] = useState(currentUser?.legalObject ?? "")
  const [documents, setDocuments] = useState<UploadedDocument[]>(currentUser?.documents ?? [])

  const isIndividual = currentUser?.accountType === "individual"

  function onFiles(list: FileList | null) {
    if (!list) return
    const next = [...documents]
    for (const file of Array.from(list)) {
      next.push({ name: file.name, uploadedAt: new Date().toISOString() })
    }
    setDocuments(next)
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!address.trim() || !phone.trim()) {
      toast.error("Indique morada e contactos.")
      return
    }
    if (isIndividual && !bi.trim()) {
      toast.error("Indique o número do BI.")
      return
    }
    if (!nif.trim()) {
      toast.error("Indique o NIF / número de contribuinte.")
      return
    }
    if (!isIndividual && (!legalName.trim() || !legalObject.trim())) {
      toast.error("Indique o nome legal e o objecto social.")
      return
    }
    if (documents.length === 0) {
      toast.error("Anexe pelo menos um documento (cópia do BI ou reconhecimento legal).")
      return
    }
    const result = submitVerification({
      address,
      phone,
      bi: isIndividual ? bi : undefined,
      nif,
      legalName: isIndividual ? undefined : legalName,
      legalObject: isIndividual ? undefined : legalObject,
      documents,
    })
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success("Dados submetidos. A administração vai analisar o pedido.")
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Verificação</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {currentUser?.accountType
              ? ACCOUNT_TYPE_LABEL[currentUser.accountType]
              : "Organizador"}
          </p>
        </div>
        <VerificationBadge status={currentUser?.verificationStatus ?? "nao_submetido"} />
      </div>

      {currentUser?.verificationStatus === "verificado" ? (
        <Alert>
          <AlertTitle>Organizador verificado</AlertTitle>
          <AlertDescription>
            O selo aparece nas campanhas públicas. Pode submeter novos projectos.
          </AlertDescription>
        </Alert>
      ) : null}

      {currentUser?.verificationStatus === "rejeitado" ? (
        <Alert variant="destructive">
          <AlertTitle>Pedido rejeitado</AlertTitle>
          <AlertDescription>
            {currentUser.verificationRejectionReason || "Corrija os dados e volte a submeter."}
          </AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Dados para validação</CardTitle>
          <CardDescription>
            A administração valida manualmente a identidade antes da publicação de campanhas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {!isIndividual ? (
              <>
                <Field label="Nome legal" htmlFor="legalName">
                  <Input
                    id="legalName"
                    value={legalName}
                    onChange={(event) => setLegalName(event.target.value)}
                  />
                </Field>
                <Field label="Objecto social" htmlFor="legalObject">
                  <Textarea
                    id="legalObject"
                    rows={3}
                    value={legalObject}
                    onChange={(event) => setLegalObject(event.target.value)}
                  />
                </Field>
              </>
            ) : null}
            <Field label="Morada" htmlFor="address">
              <Input
                id="address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
            </Field>
            <Field label="Contactos" htmlFor="phone">
              <Input
                id="phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </Field>
            {isIndividual ? (
              <Field label="Bilhete de identidade" htmlFor="bi">
                <Input id="bi" value={bi} onChange={(event) => setBi(event.target.value)} />
              </Field>
            ) : null}
            <Field
              label={isIndividual ? "Número de contribuinte" : "NIF"}
              htmlFor="nif"
            >
              <Input id="nif" value={nif} onChange={(event) => setNif(event.target.value)} />
            </Field>
            <Field
              label="Documentos"
              htmlFor="docs"
              hint="Cópia do BI, NIF ou documentos de reconhecimento legal. O envio é simulado."
            >
              <Input
                id="docs"
                type="file"
                multiple
                onChange={(event) => onFiles(event.target.files)}
              />
            </Field>
            {documents.length > 0 ? (
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                {documents.map((doc) => (
                  <li key={`${doc.name}-${doc.uploadedAt}`}>{doc.name}</li>
                ))}
              </ul>
            ) : null}
            <Button type="submit" disabled={currentUser?.verificationStatus === "pendente"}>
              {currentUser?.verificationStatus === "pendente"
                ? "Aguardar análise"
                : "Submeter para análise"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
