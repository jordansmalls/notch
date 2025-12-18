import { Tally5 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "../ui/spinner"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setCredentials } from "../../slices/auth-slice"
import { useSignupMutation, useCheckEmailAvailabilityMutation } from "../../slices/users-api-slice"
import { SpinnerButton } from "../buttons/spinner-button"
import { toast } from "sonner"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // State to manage the availability feedback
    const [emailStatus, setEmailStatus] = useState<{
    message: string | React.ReactNode;
    isAvailable: boolean | null;
}>({
    message: "",
    isAvailable: null,
});

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [signup, { isLoading: isSigningUp }] = useSignupMutation();

  // Init the check mutation and rename its loading state
  const [checkEmail, { isLoading: isChecking }] = useCheckEmailAvailabilityMutation();


  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    if(userInfo) {
      navigate("/dashboard")
    }
  }, [navigate, userInfo])



  useEffect(() => {
    if(email.length < 7) {
      setEmailStatus({
        message: "Please enter a valid email.",
        isAvailable: null
      });
      return;
    }

    setEmailStatus(prev => ({
      ...prev,
      message: <div className="flex gap-2 items-center"><Spinner/>Checking availability</div>,
      isAvailable: null
    }));


    const handler = setTimeout(() => {
      const checkAvailability = async () => {
        try {
          const res = await checkEmail(email).unwrap();

          if(res.taken) {
            setEmailStatus({
              message: "Email is taken, please try another.",
              isAvailable: false,
            });
          } else {
            setEmailStatus({
              message: "Email is available!",
              isAvailable: true
            })
          }

        } catch (err) {
          console.error("Availability check failed:", err)
          setEmailStatus({
            message: "Error checking email. Try again later.",
            isAvailable: false
          });
        }
      };
      checkAvailability();
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [email, checkEmail])



  // Submit Handler
  const handleSignup = async (e) => {
    e.preventDefault()

    if(emailStatus.isAvailable !== true) {
      toast.error("Oops!", { description: `${emailStatus.message || "Please check email availability first."}` })
      return;
    }

    try {
      const res = await signup({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("You're in.", { description: "We're glad you decided to join us, let's get started." })
      navigate("/dashboard")
    } catch (err) {
     const errorMessage = err.data?.message || err.message || "Signup failed.";
     console.error("Error with signup:", errorMessage)
     toast.error("Oops!", { description: `${errorMessage}` })
    }
  };

  const statusColor = emailStatus.isAvailable === true
        ? 'text-green-600'
        : emailStatus.isAvailable === false
            ? 'text-red-600'
            : isChecking
                ? 'text-yellow-600'
                : 'text-gray-500';


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSignup}>
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
            <h1 className="text-xl font-bold">create a notch account</h1>
            <p>quickly create your account to begin tracking counts.</p>

          </div>

          {/* email input */}
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {/* Availability Status Feedback */}
            <p className={`mt-1 text-sm ${statusColor}`}>
              {isChecking ? (
                <span className="flex items-center gap-2">
                  <Spinner />
                  Checking availability
                </span>
              ) : (
                emailStatus.message
              )}
            </p>
          </Field>



          {/* password input */}
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="Password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>

          {/* submit button */}
          <Field>
            <SpinnerButton isLoading={isSigningUp} loadingText="Please wait">Continue</SpinnerButton>
          </Field>

        </FieldGroup>
      </form>
      <FieldDescription className="text-center">
              Already have an account? <Link to="/login">Login</Link>
      </FieldDescription>
    </div>
  )
}
