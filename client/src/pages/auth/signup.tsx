import { Link } from "react-router-dom"

import { AuthLayout } from "@/components/auth/auth-layout"
import { SignupForm } from "@/components/forms/signup-form"

const Signup = () => {
  return (
    <AuthLayout
      title="Create your Notch account."
      description="Sign up with your email to start creating counters."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-foreground underline underline-offset-4">
            Log in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthLayout>
  )
}

export default Signup;
