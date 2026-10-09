import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/lib/utils"
import { useDeleteUserAccountMutation } from "../../slices/users-api-slice"
import AlertDialogCustom from "./alert-dialog-custom"

export function DeleteAccountDialog() {
  const [deleteAccount, { isLoading }] = useDeleteUserAccountMutation()

  // on success the mutation logs the user out, which sends them to /login
  const handleConfirm = async () => {
    try {
      await deleteAccount().unwrap()
      toast.success("Account deleted.", { description: "Your account and counters have been removed." })
    } catch (err) {
      toast.error("Oops! Something went wrong.", {
        description: getErrorMessage(err, "We couldn't delete your account. Try again."),
      })
    }
  }

  return (
    <AlertDialogCustom
      title="Delete your account?"
      description="This permanently deletes your account, your counters, and your usage history. Sites using your public keys will stop counting. This can't be undone."
      actionCancel="Cancel"
      actionConfirm="Delete account"
      actionLoadingText="Deleting…"
      loading={isLoading}
      destructive
      onConfirm={handleConfirm}
      trigger={<Button variant="destructive">Delete account</Button>}
    />
  )
}
