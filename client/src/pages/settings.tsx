import type { ReactNode } from "react"
import { useSelector } from "react-redux"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon, LockPasswordIcon, UserCircleIcon } from "@hugeicons/core-free-icons"

import { AppLayout } from "@/components/app-layout"
import { ChangePasswordForm } from "@/components/forms/change-password-form"
import { DeleteAccountDialog } from "@/components/dialogs/delete-account-dialog"
import { DeleteCountersDialog } from "@/components/dialogs/delete-counters-dialog"
import { cn } from "@/lib/utils"
import { useCounters } from "@/hooks/use-counters"
import type { RootState } from "@/store"

function SettingsSection({
  id,
  title,
  description,
  icon,
  destructive = false,
  children,
}: {
  id: string
  title: string
  description: string
  icon: typeof UserCircleIcon
  destructive?: boolean
  children: ReactNode
}) {
  return (
    <section aria-labelledby={id} className={cn("overflow-hidden rounded-xl border bg-white", destructive && "border-destructive/20")}>
      <div className="flex items-start gap-3.5 border-b px-5 py-5 sm:px-6">
        <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted/50", destructive && "border-destructive/10 bg-destructive/5 text-destructive")}>
          <HugeiconsIcon icon={icon} size={18} aria-hidden="true" />
        </div>
        <div>
          <h2 id={id} className="text-sm font-medium leading-5">{title}</h2>
          <p className="mt-0.5 text-sm leading-5 text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })

export default function Settings() {
  const { userInfo } = useSelector((state: RootState) => state.auth)
  const { counters, hasData, hasPendingChanges } = useCounters()
  const counterCount = hasData ? counters.length : undefined

  return (
    <AppLayout breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Settings" }]}>
      <div className="max-w-3xl">
        <div className="mb-7">
          <h1 className="text-2xl font-medium">Settings</h1>
          <p className="mt-1 text-muted-foreground">Manage your account, password, and counter data.</p>
        </div>

        <div className="space-y-5">
          <SettingsSection id="account-heading" title="Account" description="Your sign-in details and account information." icon={UserCircleIcon}>
            <dl className="divide-y px-5 sm:px-6">
              <div className="grid gap-1 py-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
                <dt className="text-muted-foreground">Email address</dt>
                <dd className="min-w-0 break-words font-medium">{userInfo?.email}</dd>
              </div>
              {userInfo?.createdAt && (
                <div className="grid gap-1 py-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
                  <dt className="text-muted-foreground">Member since</dt>
                  <dd>{formatDate(userInfo.createdAt)}</dd>
                </div>
              )}
            </dl>
          </SettingsSection>

          <SettingsSection id="password-heading" title="Password" description="Choose a strong password to keep your account secure." icon={LockPasswordIcon}>
            <ChangePasswordForm />
          </SettingsSection>

          <SettingsSection id="delete-heading" title="Delete data" description="Permanent changes. These actions can't be undone." icon={Delete02Icon} destructive>
            <div className="divide-y px-5 sm:px-6">
              <div className="flex flex-col items-start gap-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <div className="max-w-md">
                  <h3 className="text-sm font-medium">Delete all counters</h3>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    {counterCount === 0
                      ? "You don't have any counters to delete."
                      : "Remove every counter and its public key. Keep your account."}
                  </p>
                </div>
                <DeleteCountersDialog count={counterCount} disabled={hasPendingChanges} />
              </div>
              <div className="flex flex-col items-start gap-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <div className="max-w-md">
                  <h3 className="text-sm font-medium">Delete account</h3>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">Remove your account, counters, and usage history.</p>
                </div>
                <DeleteAccountDialog />
              </div>
            </div>
          </SettingsSection>
        </div>
      </div>
    </AppLayout>
  )
}
