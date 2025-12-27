import { toast } from "sonner"
import { useDeleteAllCountersMutation } from "../../slices/counters-api-slice"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function DeleteCountersDialog() {

  const [deleteCounters, { isLoading }] = useDeleteAllCountersMutation()

  const handleSubmit = async () => {
    try {
      await deleteCounters().unwrap()
      toast.success("Success!", { description: "All of your counters have successfully been deleted." })
    } catch (err) {
      console.error("Counter deletion error:", err);
      toast.error("We had trouble deleting your counters, please try again.")
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary">Delete Counters</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            All of your counters will be permanently deleted and this action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
