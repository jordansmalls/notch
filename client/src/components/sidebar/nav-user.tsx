import { HugeiconsIcon } from "@hugeicons/react"
import {
  Logout01Icon,
  Settings01Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useLogoutMutation } from "../../slices/users-api-slice"
import { logout as logoutAction } from "../../slices/auth-slice"
import type { RootState } from "@/store"

function UserAvatar({ email }: { email: string }) {
  return (
    <Avatar className="h-8 w-8 rounded-lg">
      {/* the email is shown next to it, so the image is decorative */}
      <AvatarImage src={`https://unavatar.io/email/${encodeURIComponent(email)}`} alt="" />
      <AvatarFallback className="rounded-lg">{email.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}

export function NavUser() {
  const { isMobile } = useSidebar()
  const { userInfo } = useSelector((state: RootState) => state.auth)
  const email: string = userInfo.email

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [logoutApiCall] = useLogoutMutation()

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap()
      dispatch(logoutAction())
      navigate("/login")
      toast.success("Logged out successfully.")
    } catch {
      toast.error("Oops!", { description: "We're having trouble logging you out." })
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar email={email} />
              <span className="flex-1 truncate text-left text-sm">{email}</span>
              <HugeiconsIcon icon={UnfoldMoreIcon} className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvatar email={email} />
                <span className="flex-1 truncate">{email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <HugeiconsIcon icon={Settings01Icon} className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logoutHandler}>
              <HugeiconsIcon icon={Logout01Icon} className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
