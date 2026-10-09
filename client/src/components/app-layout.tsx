import { Fragment } from "react"
import { Link } from "react-router-dom"

import { AppSidebar } from "@/components/sidebar/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

type Crumb = { label: string; to?: string }

// Align desktop content with the breadcrumb text; keep mobile gutters compact.
export function AppLayout({
  breadcrumbs,
  children,
}: {
  breadcrumbs: Crumb[]
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, i) => (
                <Fragment key={crumb.label}>
                  {i > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                  <BreadcrumbItem className={crumb.to ? "hidden md:block" : undefined}>
                    {crumb.to ? (
                      <BreadcrumbLink asChild>
                        <Link to={crumb.to}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="px-4 pt-4 pb-16 md:pl-[65px]">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
