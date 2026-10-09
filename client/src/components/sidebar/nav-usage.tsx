import { useId } from "react"
import { skipToken } from "@reduxjs/toolkit/query/react"
import { useSelector } from "react-redux"

import { useFetchUsageQuery } from "@/slices/users-api-slice"
import type { RootState } from "@/store"

// shown for context only; the API doesn't block requests past this
const MONTHLY_ALLOWANCE = 10_000

const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value)

export function NavUsage() {
  const labelId = useId()
  const { userInfo } = useSelector((state: RootState) => state.auth)
  // increments happen outside the app, so refresh at most once a minute as pages change
  const { data, isError } = useFetchUsageQuery(userInfo?._id ?? skipToken, {
    refetchOnMountOrArgChange: 60,
  })

  if (isError) return null

  const requests = data?.requests
  const filled = Math.min(requests ?? 0, MONTHLY_ALLOWANCE)

  return (
    <div className="flex flex-col gap-2 px-2 pt-2 group-data-[collapsible=icon]:hidden">
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span id={labelId} className="text-muted-foreground">
          Requests this month
        </span>
        <span className="tabular-nums">{requests === undefined ? "–" : formatNumber(requests)}</span>
      </div>
      <div
        role="progressbar"
        aria-labelledby={labelId}
        aria-valuemin={0}
        aria-valuemax={MONTHLY_ALLOWANCE}
        aria-valuenow={filled}
        aria-valuetext={
          requests === undefined
            ? "Loading"
            : `${formatNumber(requests)} of ${formatNumber(MONTHLY_ALLOWANCE)} requests`
        }
        className="bg-sidebar-accent h-1 overflow-hidden rounded-full"
      >
        <div
          className="bg-primary h-full rounded-full"
          style={{ width: `${(filled / MONTHLY_ALLOWANCE) * 100}%` }}
        />
      </div>
    </div>
  )
}
