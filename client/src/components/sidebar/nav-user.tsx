"use client"

import {
  ChevronsUpDown,
  LogOut,
  Sparkles,
  Settings
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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

import { useSelector } from "react-redux"
import { toast } from "sonner"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useLogoutMutation } from "../../slices/users-api-slice"
import { logout as logoutAction } from "../../slices/auth-slice"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()

  const { userInfo } = useSelector((state) => state.auth)

  // func to extract user's email before the @
  const getEmailName = function(email: string) {
    let res = "";
    for(let i = 0; i < email.length; ++i) {
      const curr = email[i];

      if(curr !== "@") {
        res += curr
      } else {
        break;
      }
    };
    return res;
  }

  const emailName = getEmailName(userInfo.email)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [logoutApiCall, { isLoading }] = useLogoutMutation();

  // Logout Handler
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap()
      dispatch(logoutAction())
      navigate("/login")
      toast.success("Logged out successfully.", { description: "We'll see you soon, right?" })
    } catch (err) {
      console.error("Logout error:", err)
      toast.error("Oops!", { description: "We're having trouble logging you out, please try again. "})
    }
  }

  // Settings Handler
  const settingsHandler = () => {
    navigate("/settings")
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
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">{emailName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{emailName}</span>
                <span className="truncate text-xs">{userInfo.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
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
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{emailName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{emailName}</span>
                  <span className="truncate text-xs">{userInfo.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem disabled>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={settingsHandler}>
                <Settings />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logoutHandler}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
