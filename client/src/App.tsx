import { Suspense } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { Toaster } from "sonner";
import LoadingPage from "./pages/loading"

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/settings": "Settings",
  "/analytics": "Analytics",
  "/login": "Log in",
  "/signup": "Sign up",
}

const App = () => {
  const { pathname } = useLocation()
  const pageTitle = pageTitles[pathname.replace(/\/+$/, "") || "/"] ?? "Page not found"

  return (
    <>
      <title>{`${pageTitle} | Notch`}</title>
      <Toaster />
      <Suspense fallback={<LoadingPage />}>
        <Outlet />
      </Suspense>
    </>
  )
}

export default App;
