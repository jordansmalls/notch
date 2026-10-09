import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client"
import App from "./App.tsx";
import "@fontsource/geist/400.css"
import "@fontsource/geist/500.css"
import "@fontsource/geist/600.css"
import "./index.css"
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router-dom"
import store from "./store.ts"
import { Provider } from "react-redux"



import PrivateRoute from "./components/private-route.tsx";

const Login = lazy(() => import("./pages/auth/login.tsx"))
const Signup = lazy(() => import("./pages/auth/signup.tsx"))
const NotFound = lazy(() => import("./pages/def/not-found.tsx"))
const Dashboard = lazy(() => import("./pages/dashboard.tsx"))
const Settings = lazy(() => import("./pages/settings.tsx"))
const Analytics = lazy(() => import("./pages/analytics.tsx"))


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="*" element={<NotFound />} />
      {/* logged-out visitors get sent on to /login by PrivateRoute */}
      <Route index={true} path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      <Route path="" element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/analytics" element={<Analytics />} />

      </Route>

    </Route>
  )
)


createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
  </Provider>,
)
