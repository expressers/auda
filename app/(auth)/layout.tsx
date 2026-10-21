import { Logo } from "@/components/logo"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50">
      <div className="flex justify-center px-4 py-8">
        <Logo />
      </div>
      <div className="mx-auto w-full max-w-md flex-1 px-4 pb-16">{children}</div>
    </div>
  )
}
