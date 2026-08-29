"use client"

import Link from "next/link"

import { VerificationBadge } from "@/components/status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ACCOUNT_TYPE_LABEL } from "@/lib/labels"
import { useMockStore } from "@/lib/mock/store"

export default function AdminOrganizersPage() {
  const { state } = useMockStore()
  const organizers = state.users.filter((user) => user.role === "organizador")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Organizadores</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Validação manual de identidade e documentos.
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Verificação</TableHead>
            <TableHead>Projectos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Link
                  href={`/admin/organizadores/${user.id}`}
                  className="font-medium hover:underline"
                >
                  {user.legalName || user.name}
                </Link>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </TableCell>
              <TableCell>
                {user.accountType ? ACCOUNT_TYPE_LABEL[user.accountType] : "—"}
              </TableCell>
              <TableCell>
                <VerificationBadge status={user.verificationStatus} />
              </TableCell>
              <TableCell>
                {state.projects.filter((project) => project.organizerId === user.id).length}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
