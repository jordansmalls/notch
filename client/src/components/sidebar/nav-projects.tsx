import { Link, useLocation } from "react-router-dom"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { CreateCounterDrawer } from "@/components/dialogs/create-counter-drawer"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// an item either links to a page or opens the create counter drawer
export type NavProject = { name: string; icon: IconSvgElement } & (
  | { url: string }
  | { createsCounter: true }
)

export function NavProjects({ projects }: { projects: NavProject[] }) {
  const { pathname } = useLocation()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Command Center</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            {"url" in item ? (
              <SidebarMenuButton asChild isActive={pathname === item.url}>
                <Link to={item.url}>
                  <HugeiconsIcon icon={item.icon} />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            ) : (
              <CreateCounterDrawer
                trigger={
                  <SidebarMenuButton>
                    <HugeiconsIcon icon={item.icon} />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                }
              />
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
