import { Link } from "react-router-dom"

import { AuthLayout } from "@/components/auth/auth-layout"
import { LoginForm } from "@/components/forms/login-form"

const Login = () => {
  return (
    <AuthLayout
      title="Log in to Notch."
      description="Enter your email and password to see your counters."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-foreground underline underline-offset-4">
            Sign up
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  )
}

export default Login;
