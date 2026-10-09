import { Spinner } from "@/components/ui/spinner"

export default function LoadingPage() {
  return (
    <main className="bg-background flex min-h-dvh items-center justify-center px-4">
      <div role="status" aria-live="polite" className="text-muted-foreground flex items-center gap-2">
        <Spinner aria-hidden="true" role="presentation" />
        <span>Loading</span>
      </div>
    </main>
  )
}
