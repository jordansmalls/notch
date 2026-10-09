import { useRef, useState } from "react"
import { useSelector } from "react-redux"
import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon, Delete02Icon, Edit02Icon, RefreshIcon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import { type Counter, useDeleteCounterMutation, useResetCounterMutation, useUpdateCounterMutation } from "@/slices/counters-api-slice"
import { getErrorMessage } from "@/lib/utils"
import type { RootState } from "@/store"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"

type Action = "edit" | "reset" | "delete" | null
type EditDraft = { name: string; description: string; count: string; originalCount: string; createdAt: string }

const actionButtons = [
  { action: "copy", label: "Copy public key", icon: Copy01Icon },
  { action: "reset", label: "Reset count", icon: RefreshIcon },
  { action: "edit", label: "Update counter", icon: Edit02Icon },
  { action: "delete", label: "Delete counter", icon: Delete02Icon },
] as const

export function CounterActions({ counter }: { counter: Counter }) {
  const [action, setAction] = useState<Action>(null)
  const [tooltipAction, setTooltipAction] = useState<typeof actionButtons[number]["action"] | null>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const submitting = useRef(false)
  const [draft, setDraft] = useState<EditDraft | null>(null)
  const [updateCounter, update] = useUpdateCounterMutation()
  const [resetCounter, reset] = useResetCounterMutation()
  const [deleteCounter, remove] = useDeleteCounterMutation()
  const pending = useSelector((state: RootState) => state.optimisticCounters.some((change) =>
    change.userId === state.auth.userInfo?._id && change.counterId === counter._id && change.status === "pending",
  ))
  const busy = pending || update.isLoading || reset.isLoading || remove.isLoading

  async function copyKey() {
    try {
      await navigator.clipboard.writeText(counter.public_key)
      toast.success("Public key copied")
    } catch {
      toast.error("Couldn't copy the public key. Please try again.")
    }
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft || busy || submitting.current) return
    const name = draft.name.trim()
    const description = draft.description.trim()
    const count = draft.count.trim()
    if (name.length < 3 || name.length > 55 || !description || description.length > 255) {
      toast.error("Use a name of 3 to 55 characters and a description of 1 to 255 characters.")
      return
    }
    if (count !== "" && (!Number.isSafeInteger(Number(count)) || Number(count) < 0)) {
      toast.error("Count must be a non-negative whole number within the safe integer range.")
      return
    }
    const date = draft.createdAt ? new Date(`${draft.createdAt}T00:00:00`) : null
    if (date && Number.isNaN(date.getTime())) {
      toast.error("Please provide a valid creation date.")
      return
    }
    submitting.current = true
    setAction(null)
    const toastId = toast.loading(`Saving "${name}"...`)
    try {
      await updateCounter({
        id: counter._id,
        name,
        description,
        ...(count !== "" && count !== draft.originalCount ? { count: Number(count) } : {}),
        ...(date ? { createdAt: date.toISOString() } : {}),
      }).unwrap()
      setDraft(null)
      toast.success("Counter updated", { id: toastId })
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't confirm the update. Refresh to check the latest value."), {
        id: toastId,
        description: "Your edits are kept while you stay on this page.",
        action: { label: "Review edits", onClick: () => setAction("edit") },
      })
    } finally {
      submitting.current = false
    }
  }

  async function confirm() {
    if (busy || submitting.current || (action !== "reset" && action !== "delete")) return
    submitting.current = true
    const confirmedAction = action
    setAction(null)
    const toastId = toast.loading(confirmedAction === "reset" ? `Resetting "${counter.name}"...` : `Deleting "${counter.name}"...`)
    try {
      if (confirmedAction === "reset") await resetCounter(counter._id).unwrap()
      else await deleteCounter(counter._id).unwrap()
      toast.success(confirmedAction === "reset" ? "Counter reset to zero" : "Counter deleted", { id: toastId })
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't confirm the change. Refresh to check the latest data."), { id: toastId })
    } finally {
      submitting.current = false
    }
  }

  function restoreFocus(event: Event) {
    event.preventDefault()
    if (trigger.current?.isConnected) trigger.current.focus()
    else document.querySelector<HTMLElement>("[data-counter-overview]")?.focus()
  }

  function openAction(nextAction: Action, button: HTMLButtonElement) {
    trigger.current = button
    setTooltipAction(null)
    if (nextAction === "edit" && !draft) {
      setDraft({ name: counter.name, description: counter.description, count: String(counter.count), originalCount: String(counter.count), createdAt: "" })
    }
    setAction(nextAction)
  }

  return (
    <>
      <div role="group" aria-label={`Controls for ${counter.name}`} className="ml-auto flex shrink-0 items-center gap-0">
        {busy && <span role="status" className="mr-2 text-xs text-muted-foreground">Saving...</span>}
        {actionButtons.map(({ action: nextAction, label, icon }) => (
          <Tooltip
            key={label}
            open={action === null && tooltipAction === nextAction}
            onOpenChange={(open) => setTooltipAction((current) => open ? nextAction : current === nextAction ? null : current)}
          >
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`${label} for ${counter.name}`}
                disabled={nextAction !== "copy" && busy}
                onClick={(event) => {
                  if (nextAction === "copy") {
                    setTooltipAction(null)
                    void copyKey()
                  }
                  else openAction(nextAction, event.currentTarget)
                }}
                className={`h-11 w-9 active:scale-[0.97] sm:size-7 [@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:w-9 ${nextAction === "delete" ? "text-destructive hover:bg-destructive/10 hover:text-destructive" : "text-muted-foreground"}`}
              >
                <HugeiconsIcon icon={icon} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={6}>{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
      <Dialog open={action === "edit"} onOpenChange={(open) => { if (!open && !busy) setAction(null) }}>
        <DialogContent className="sm:max-w-md" onCloseAutoFocus={restoreFocus}>
          <form onSubmit={save}>
            <DialogHeader>
              <DialogTitle>Update counter</DialogTitle>
              <DialogDescription>Update the details and count for this counter.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-6">
              <div className="grid gap-2">
                <Label htmlFor={`name-${counter._id}`}>Name</Label>
                <Input id={`name-${counter._id}`} name="name" value={draft?.name ?? ""} onChange={(event) => setDraft((current) => current && { ...current, name: event.target.value })} minLength={3} maxLength={55} required disabled={busy} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`description-${counter._id}`}>Description</Label>
                <Textarea id={`description-${counter._id}`} name="description" value={draft?.description ?? ""} onChange={(event) => setDraft((current) => current && { ...current, description: event.target.value })} maxLength={255} required disabled={busy} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`count-${counter._id}`}>Count (optional)</Label>
                <Input id={`count-${counter._id}`} name="count" type="number" min={0} max={Number.MAX_SAFE_INTEGER} step={1} value={draft?.count ?? ""} onChange={(event) => setDraft((current) => current && { ...current, count: event.target.value })} disabled={busy} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`date-${counter._id}`}>Creation date (optional)</Label>
                <Input id={`date-${counter._id}`} name="createdAt" type="date" value={draft?.createdAt ?? ""} onChange={(event) => setDraft((current) => current && { ...current, createdAt: event.target.value })} aria-describedby={`date-hint-${counter._id}`} disabled={busy} />
                <p id={`date-hint-${counter._id}`} className="text-xs text-muted-foreground">Leave blank to keep the current date.</p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" disabled={busy} onClick={() => { setDraft(null); setAction(null) }}>Cancel</Button>
              <Button type="submit" disabled={busy}>{busy ? "Saving..." : "Save changes"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={action === "reset" || action === "delete"} onOpenChange={(open) => { if (!open && !busy) setAction(null) }}>
        <AlertDialogContent onCloseAutoFocus={restoreFocus}>
          <AlertDialogHeader>
            <AlertDialogTitle>{action === "reset" ? "Reset counter?" : "Delete counter?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {action === "reset" ? `This resets the count for "${counter.name}" to zero. This cannot be undone.` : `This permanently deletes "${counter.name}" and its public key. This cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
            <Button variant="destructive" disabled={busy} onClick={confirm}>
              {busy ? "Working..." : action === "reset" ? "Reset count" : "Delete counter"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
