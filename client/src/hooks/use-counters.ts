import { useMemo } from "react"
import { useSelector } from "react-redux"
import { skipToken } from "@reduxjs/toolkit/query/react"
import { useFetchUserCountersQuery, type Counter } from "@/slices/counters-api-slice"
import { applyCounterChanges } from "@/slices/optimistic-counters-slice"
import type { RootState } from "@/store"

const emptyCounters: Counter[] = []

export function useCounters() {
  const userId: string | undefined = useSelector((state: RootState) => state.auth.userInfo?._id)
  const changes = useSelector((state: RootState) => state.optimisticCounters)
  const query = useFetchUserCountersQuery(userId ?? skipToken, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  })
  // currentData never exposes the previous account's result on an account switch.
  const snapshot = query.currentData
  const counters = useMemo(
    () => applyCounterChanges(snapshot?.counters ?? emptyCounters, changes, userId),
    [snapshot, changes, userId],
  )
  const hasPendingChanges = changes.some((change) => change.userId === userId && change.status === "pending")

  return { ...query, counters, hasData: snapshot !== undefined, hasPendingChanges }
}
