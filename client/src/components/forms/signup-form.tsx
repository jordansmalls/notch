import { useEffect, useRef, useState, type FormEvent } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn, getErrorMessage } from "@/lib/utils"
import { setCredentials } from "@/slices/auth-slice"
import { useCheckEmailAvailabilityMutation, useSignupMutation } from "@/slices/users-api-slice"
import type { RootState } from "@/store"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// taken is null when the availability check itself failed
type EmailCheck = { email: string; taken: boolean | null }

export function SignupForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailCheck, setEmailCheck] = useState<EmailCheck | null>(null)

  const emailRef = useRef<HTMLInputElement>(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [signup, { isLoading }] = useSignupMutation()
  const [checkEmail] = useCheckEmailAvailabilityMutation()

  const { userInfo } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (userInfo) {
      navigate("/dashboard")
    }
  }, [navigate, userInfo])

  // debounce the availability check; ignore responses for emails that are no longer in the field
  useEffect(() => {
    if (!EMAIL_PATTERN.test(email)) return

    let ignore = false
    const handler = setTimeout(async () => {
      try {
        const res = await checkEmail(email).unwrap()
        if (!ignore) setEmailCheck({ email, taken: Boolean(res.taken) })
      } catch {
        if (!ignore) setEmailCheck({ email, taken: null })
      }
    }, 500)

    return () => {
      ignore = true
      clearTimeout(handler)
    }
  }, [email, checkEmail])

  const isValidEmail = EMAIL_PATTERN.test(email)
  const isChecking = isValidEmail && emailCheck?.email !== email
  const isTaken = isValidEmail && emailCheck?.email === email && emailCheck.taken === true
  const isAvailable = isValidEmail && emailCheck?.email === email && emailCheck.taken === false

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isTaken) {
      toast.error("Oops! Something went wrong.", { description: "An account already uses this email." })
      emailRef.current?.focus()
      return
    }

    try {
      const res = await signup({ email, password }).unwrap()
      dispatch(setCredentials({ ...res }))
      toast.success("You're in.", { description: "We're glad you decided to join us, let's get started." })
      navigate("/dashboard")
    } catch (err) {
      toast.error("Oops! Something went wrong.", { description: getErrorMessage(err, "We couldn't create your account. Try again.") })
    }
  }

  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-6">
      <Field className="gap-2">
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          ref={emailRef}
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={isTaken || undefined}
          aria-describedby="email-status"
          required
        />
        {/* stays mounted so screen readers announce changes; collapses the field gap while empty */}
        <p
          id="email-status"
          aria-live="polite"
          className={cn("text-xs empty:-mt-2", isTaken ? "text-destructive" : "text-muted-foreground")}
        >
          {isChecking && "Checking availability…"}
          {isAvailable && "This email is available."}
          {isTaken && (
            <>
              An account already uses this email.{" "}
              <Link to="/login" className="underline underline-offset-4">
                Log in instead
              </Link>
            </>
          )}
        </p>
      </Field>

      <Field className="gap-2">
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-describedby="password-help"
          required
        />
        <p id="password-help" className="text-muted-foreground text-xs">
          Use at least 8 characters.
        </p>
      </Field>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account…" : "Create account"}
      </Button>
    </form>
  )
}
