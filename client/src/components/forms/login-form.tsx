import { useEffect, useState, type FormEvent } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { getErrorMessage } from "@/lib/utils"
import { setCredentials } from "@/slices/auth-slice"
import { useLoginMutation } from "@/slices/users-api-slice"
import type { RootState } from "@/store"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [login, { isLoading }] = useLoginMutation()

  const { userInfo } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (userInfo) {
      navigate("/dashboard")
    }
  }, [navigate, userInfo])

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const res = await login({ email, password }).unwrap()
      dispatch(setCredentials({ ...res }))
      toast.success("Logged in successfully.", { description: "Welcome back, let's get back to it." })
      navigate("/dashboard")
    } catch (err) {
      toast.error("Oops! Something went wrong.", { description: getErrorMessage(err, "We couldn't log you in. Try again.") })
    }
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-6">
      <Field className="gap-2">
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Field>

      <Field className="gap-2">
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Field>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Logging in…" : "Log in"}
      </Button>
    </form>
  )
}
