import { Tally5 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setCredentials } from "../../slices/auth-slice"
import { useLoginMutation } from "../../slices/users-api-slice"
import { SpinnerButton } from "../buttons/spinner-button"
import { toast } from "sonner"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    if(userInfo) {
      navigate("/dashboard")
    }
  }, [navigate, userInfo])

  // login handler
  const handleLogin = async (e) => {
    e.preventDefault()

    try {

      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }))
      toast.success("Logged in successfully.", { description: "Welcome back, let's get back to it." });
      navigate("/dashboard")
    } catch (err) {
      const errorMessage = err.data?.message || err.message || "Login failed. Check the console for error details.";
      console.error("Login error:", errorMessage)
      toast.error("Oops!", { description: `${errorMessage}` })
    }
  };


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleLogin}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <Tally5 className="size-6" />
              </div>
              <span className="sr-only">notch.</span>
            </a>
            <h1 className="text-xl font-bold">login to notch</h1>
            <p>enter your credentials and get back to it.</p>

          </div>

          {/* email input */}
          <Field>
            <FieldLabel htmlFor="email">email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          {/* password input */}
          <Field>
            <FieldLabel htmlFor="password">password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>

          {/* submit button */}
          <Field>
            <SpinnerButton isLoading={isLoading} loadingText="Please wait">Continue</SpinnerButton>
          </Field>

        </FieldGroup>
      </form>
      <FieldDescription className="text-center">
              Don&apos;t have an account? <Link to="/signup" className="transition ease-in hover:text-primary duration-200">Signup</Link>
      </FieldDescription>
    </div>
  )
}
