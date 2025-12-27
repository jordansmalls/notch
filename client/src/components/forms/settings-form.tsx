import { Tally5 } from "lucide-react"
import { useState } from "react"
import { SpinnerButton } from "../buttons/spinner-button"
import { DeleteAccountDialog } from "../dialogs/delete-account-dialog"
import { DeleteCountersDialog } from "../dialogs/delete-counters-dialog"
import { useChangeUserPasswordMutation } from "../../slices/users-api-slice"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SettingsForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [changePassword, { isLoading }] = useChangeUserPasswordMutation();


  const passwordsMatch = newPassword === confirmPassword;
  const showConfirmError = confirmPassword.length > 0 && !passwordsMatch;


  const isLengthValid = newPassword.length >= 8;

  const ableToSend = currentPassword.length > 0 && isLengthValid && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ableToSend) return;

    try {
      const res = await changePassword({ currentPassword, newPassword }).unwrap();
      toast.success("Success!", { description: "Your password has been updated." });

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      console.error("There was an error updating password:", err);
      toast.error("Something went wrong.", {
        description: err?.data?.message || "We're having trouble updating your credentials, please try again."
      });
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="/dashboard"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <Tally5 className="size-6" />
              </div>
              <span className="sr-only">notch</span>
            </a>
            <h1 className="text-xl font-bold">Account Settings</h1>
            <FieldDescription>
              Not what you're looking for? <a href="/dashboard" className="transition ease-in hover:text-primary duration-200">Go back</a>
            </FieldDescription>
          </div>

          <Field>
            <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Enter your current password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </Field>

          <Field>
            <div className="flex justify-between">
               <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
               {newPassword.length > 0 && !isLengthValid && (
                 <span className="text-[10px] text-destructive font-medium">Min. 8 characters</span>
               )}
            </div>
            <Input
              id="newPassword"
              type="password"
              placeholder="Min. 8 characters"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              // Optional: turn border red if user typed but length is short
              className={cn(newPassword.length > 0 && !isLengthValid && "border-destructive focus-visible:ring-destructive")}
            />
          </Field>

          {/* confirm password input */}
<Field>
  <div className="flex justify-between items-end">
    <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
    {showConfirmError && (
      <span className="text-[10px] text-destructive font-bold animate-in fade-in slide-in-from-right-1">
        Passwords do not match
      </span>
    )}
  </div>
  <Input
    id="confirmPassword"
    type="password"
    placeholder="Re-enter your new password"
    required
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    className={cn(
      showConfirmError && "border-destructive focus-visible:ring-destructive"
    )}
  />
</Field>
          <Field>
            <SpinnerButton
              isLoading={isLoading}
              loadingText="Updating..."
              type="submit"
              disabled={!ableToSend || isLoading}
            >
              Update Password
            </SpinnerButton>
          </Field>

          <FieldSeparator>Or</FieldSeparator>
          <Field className="grid gap-4 sm:grid-cols-2">
            <DeleteCountersDialog />
            <DeleteAccountDialog />
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="text-center">
        Are you enjoying notch? Please give a ⭐ on{" "}
        <a
          href="https://www.github.com/jordansmalls/notch"
          target="_blank"
          rel="noreferrer"
          className="transition ease-in hover:text-primary duration-200"
        >
          Github
        </a>.
      </FieldDescription>
    </div>
  )
}