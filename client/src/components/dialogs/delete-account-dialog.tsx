import { useDeleteUserAccountMutation } from "../../slices/users-api-slice"
import { toast } from "sonner"
import { SpinnerButton } from "../buttons/spinner-button"
import { useSelector } from "react-redux"


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

export function DeleteAccountDialog() {

  const { userInfo } = useSelector((state) => state.auth)
  console.log(userInfo)
  const [deleteAccount, { isLoading }] = useDeleteUserAccountMutation();

  const handleSubmit = async () => {
    try {
      await deleteAccount().unwrap();
      toast.success("Account deleted successfully.", { description: "We hate to see you go, come back soon? We'll be counting the days..."})
    } catch (err) {
      console.error("There was an error deleting user account:", err)
      toast.error("Something went wrong.", { description: "We encountered trouble deactivating your account, please try again later." })
    }
  }


  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Your account and all associated data will be permanently removed from our servers, and this action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <SpinnerButton isLoading={isLoading} onClick={handleSubmit}>Confirm</SpinnerButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
