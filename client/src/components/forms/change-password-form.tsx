import { useRef, useState, type FormEvent } from "react"
import { useSelector } from "react-redux"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn, getErrorMessage } from "@/lib/utils"
import { useChangeUserPasswordMutation } from "@/slices/users-api-slice"
import type { RootState } from "@/store"

// matches the server's password rule
const MIN_LENGTH = 8

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const newRef = useRef<HTMLInputElement>(null)
  const confirmRef = useRef<HTMLInputElement>(null)

  const { userInfo } = useSelector((state: RootState) => state.auth)
  const [changePassword, { isLoading }] = useChangeUserPasswordMutation()

  const isSameAsCurrent = newPassword.length > 0 && newPassword === currentPassword
  const isMismatch = confirmPassword.length > 0 && confirmPassword !== newPassword

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // empty and too-short fields are caught by the browser before this runs
    if (isSameAsCurrent) {
      newRef.current?.focus()
      return
    }
    if (isMismatch) {
      confirmRef.current?.focus()
      return
    }

    try {
      await changePassword({ currentPassword, newPassword }).unwrap()
      toast.success("Password updated.", { description: "Use your new password the next time you log in." })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      toast.error("Oops! Something went wrong.", {
        description: getErrorMessage(err, "We couldn't update your password. Try again."),
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-x-5 gap-y-5 px-5 pt-5 sm:grid-cols-2 sm:px-6">
      {/* lets password managers attach the new password to the right account */}
      <input type="email" autoComplete="username" value={userInfo?.email ?? ""} readOnly hidden />

      <Field className="gap-2 sm:col-span-2 sm:max-w-[calc(50%-0.625rem)]">
        <FieldLabel htmlFor="current-password">Current password</FieldLabel>
        <Input
          id="current-password"
          type="password"
          autoComplete="current-password"
          className="bg-background/60"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </Field>

      <Field className="gap-2">
        <FieldLabel htmlFor="new-password">New password</FieldLabel>
        <Input
          ref={newRef}
          id="new-password"
          type="password"
          autoComplete="new-password"
          className="bg-background/60"
          minLength={MIN_LENGTH}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          aria-invalid={isSameAsCurrent || undefined}
          aria-describedby="new-password-help"
          required
        />
        <p
          id="new-password-help"
          className={cn("text-xs", isSameAsCurrent ? "text-destructive" : "text-muted-foreground")}
        >
          {isSameAsCurrent ? "Use a password different from your current one." : `At least ${MIN_LENGTH} characters.`}
        </p>
      </Field>

      <Field className="gap-2">
        <FieldLabel htmlFor="confirm-password">Confirm new password</FieldLabel>
        <Input
          ref={confirmRef}
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          className="bg-background/60"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          aria-invalid={isMismatch || undefined}
          aria-describedby="confirm-password-help"
          required
        />
        {/* stays mounted so screen readers announce it; collapses the field gap while empty */}
        <p id="confirm-password-help" aria-live="polite" className="text-destructive text-xs empty:-mt-2">
          {isMismatch && "Passwords don't match."}
        </p>
      </Field>

      <div className="-mx-5 mt-1 flex justify-end rounded-b-xl border-t bg-muted/30 px-5 py-4 sm:col-span-2 sm:-mx-6 sm:px-6">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating…" : "Update password"}
        </Button>
      </div>
    </form>
  )
}
