import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col items-start justify-center px-4 py-24">
      <h1 className="text-2xl font-semibold">Página não encontrada</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        O endereço não existe ou o conteúdo deixou de estar disponível.
      </p>
      <Button className="mt-6" asChild>
        <Link href="/">Ir para o início</Link>
      </Button>
    </div>
  )
}
