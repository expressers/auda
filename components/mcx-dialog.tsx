"use client"

import { useState } from "react"

import { Field } from "@/components/field"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { formatKz } from "@/lib/format"

export function McxDialog({
  open,
  onOpenChange,
  amount,
  projectTitle,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  amount: number
  projectTitle: string
  onConfirm: (phone: string) => void
}) {
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const digits = phone.replace(/\D/g, "")

  function confirm() {
    if (!/^9\d{8}$/.test(digits)) {
      setError("Introduza um telemóvel angolano válido (9 dígitos, a começar por 9).")
      return
    }
    setError("")
    onConfirm(digits)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Multicaixa Express</DialogTitle>
          <DialogDescription>
            Confirme o pagamento de {formatKz(amount)} para «{projectTitle}». Não é criada
            uma carteira na AUDA.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="rounded-lg bg-muted/60 p-3 text-sm">
            <p>
              <span className="text-muted-foreground">Entidade</span>
              <span className="ml-2 font-medium">AUDA</span>
            </p>
            <p>
              <span className="text-muted-foreground">Montante</span>
              <span className="ml-2 font-medium">{formatKz(amount)}</span>
            </p>
          </div>
          <Field
            label="Telemóvel Multicaixa Express"
            htmlFor="mcx-phone"
            hint="Formato: 9XX XXX XXX"
            error={error}
          >
            <Input
              id="mcx-phone"
              inputMode="numeric"
              placeholder="923 000 000"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={confirm}>Confirmar pagamento</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
