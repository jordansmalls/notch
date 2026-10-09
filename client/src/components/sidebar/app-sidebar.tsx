import * as React from "react"
import { Link } from "react-router-dom"
import {
  Add01Icon,
  BookOpen01Icon,
  DashboardSquare01Icon,
  GithubIcon,
  SentIcon,
  Settings01Icon,
} from "@hugeicons/core-free-icons"

import { NavProjects, type NavProject } from "./nav-projects"
import { NavSecondary } from "./nav-secondary"
import { NavUsage } from "./nav-usage"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const projects: NavProject[] = [
  { name: "Dashboard", url: "/dashboard", icon: DashboardSquare01Icon },
  { name: "Create New Counter", createsCounter: true, icon: Add01Icon },
  { name: "Settings", url: "/settings", icon: Settings01Icon },
]

const navSecondary = [
  {
    title: "Documentation",
    url: "https://trynotch.cc/docs",
    icon: BookOpen01Icon,
  },
  {
    title: "Contribute to Project",
    url: "https://www.github.com/jordansmalls/notch",
    icon: GithubIcon,
  },
  {
    title: "Feedback",
    url: "https://www.x.com/@jsmallsdev",
    icon: SentIcon,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <span className="text-xl font-semibold tracking-[-0.06em]">Notch</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={projects} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUsage />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
