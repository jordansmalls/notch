import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/lib/utils"
import { useDeleteAllCountersMutation } from "../../slices/counters-api-slice"
import AlertDialogCustom from "./alert-dialog-custom"

const pluralize = (count: number) => `${count} ${count === 1 ? "counter" : "counters"}`

export function DeleteCountersDialog({ count, disabled = false }: { count: number | undefined; disabled?: boolean }) {
  const [deleteCounters, { isLoading }] = useDeleteAllCountersMutation()

  const handleConfirm = async () => {
    try {
      const res = await deleteCounters().unwrap()
      toast.success("Counters deleted.", { description: `Removed ${pluralize(res.deletedCount)}.` })
    } catch (err) {
      toast.error("Oops! Something went wrong.", {
        description: getErrorMessage(err, "We couldn't delete your counters. Try again."),
      })
    }
  }

  return (
    <AlertDialogCustom
      title="Delete all counters?"
      description={`This permanently deletes ${count === undefined ? "all of your counters" : `your ${pluralize(count)}`} and their public keys. Sites using those keys will stop counting. This can't be undone.`}
      actionCancel="Cancel"
      actionConfirm="Delete counters"
      actionLoadingText="Deleting…"
      loading={isLoading}
      destructive
      onConfirm={handleConfirm}
      trigger={
        <Button variant="outline" disabled={count === 0 || disabled || isLoading}>
          Delete counters
        </Button>
      }
    />
  )
}
