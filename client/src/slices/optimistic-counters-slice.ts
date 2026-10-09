import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Counter } from "./counters-api-slice"

export type CounterChanges = Partial<Pick<Counter, "name" | "description" | "count" | "createdAt">>

export interface CounterChange {
  requestId: string
  userId: string
  counterId: string
  // A null value hides a counter while its deletion is in flight.
  changes: CounterChanges | null
  optimistic: boolean
  status: "pending" | "confirmed"
}

const initialState: CounterChange[] = []

const optimisticCountersSlice = createSlice({
  name: "optimisticCounters",
  initialState,
  reducers: {
    counterChangeStarted(state, action: PayloadAction<Omit<CounterChange, "status">>) {
      state.push({ ...action.payload, status: "pending" })
    },
    counterChangeConfirmed(state, action: PayloadAction<{ requestId: string; changes: CounterChanges | null }>) {
      const change = state.find((item) => item.requestId === action.payload.requestId)
      if (change) {
        change.status = "confirmed"
        change.changes = action.payload.changes
      }
    },
    counterChangesRemoved(state, action: PayloadAction<string[]>) {
      return state.filter((change) => !action.payload.includes(change.requestId))
    },
  },
  extraReducers: (builder) => {
    // A late response from a previous session must not restore its local changes.
    builder.addMatcher(
      (action) => ["auth/logout", "auth/deactivate", "auth/setCredentials", "api/resetApiState"].includes(action.type),
      () => initialState,
    )
  },
})

export const { counterChangeStarted, counterChangeConfirmed, counterChangesRemoved } = optimisticCountersSlice.actions
export default optimisticCountersSlice.reducer

export function applyCounterChanges(counters: Counter[], changes: CounterChange[], userId: string | undefined): Counter[] {
  let result = counters
  for (const change of changes) {
    if (change.userId !== userId || (change.status === "pending" && !change.optimistic)) continue
    result = change.changes === null
      ? result.filter((counter) => counter._id !== change.counterId)
      : result.map((counter) => counter._id === change.counterId ? { ...counter, ...change.changes } : counter)
  }
  // Editing the creation date should preserve the server's newest-first order.
  return result === counters ? result : [...result].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
}
