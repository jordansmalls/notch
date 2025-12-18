import { Outlet } from "react-router-dom"
import { ThemeProvider } from "./components/theme/theme-provider";
import { Toaster } from "./components/theme/toaster";

const App = () => {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster />
        <Outlet />
      </ThemeProvider>
    </>
  )
}

export default App;