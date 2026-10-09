import type { UnknownAction } from '@reduxjs/toolkit'
import { apiSlice } from './api-slice'
import type { RootState } from '../store'
import {
    counterChangeStarted,
    counterChangeConfirmed,
    counterChangesRemoved,
    type CounterChanges,
} from './optimistic-counters-slice'

const COUNTERS = '/counters'

export interface Counter {
    _id: string
    name: string
    description: string
    count: number
    public_key: string
    createdAt: string
}

export interface UpdateCounterInput {
    id: string
    name: string
    description: string
    count?: number
    createdAt?: string
}

type CounterResult = { counter: Omit<Counter, 'public_key'>; message: string }
type MessageResult = { message: string }

export const countersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Creation needs a real ID and public key before the counter can be used.
        createCounter: builder.mutation<{ counter: Counter; message: string }, { name: string; description: string }>({
            query: (data) => ({ url: COUNTERS, method: 'POST', body: data }),
            invalidatesTags: ['Counters'],
        }),
        // Each account owns both its server snapshot and its pending changes.
        fetchUserCounters: builder.query<{ counters: Counter[] }, string>({
            query: () => ({ url: COUNTERS, method: 'GET' }),
            providesTags: (_result, _error, userId) => [{ type: 'Counters', id: userId }],
            async onQueryStarted(userId, { getState, dispatch, queryFulfilled }): Promise<void> {
                // Only a read started AFTER a write settled can retire that write.
                // An older read may still contain the pre-mutation values.
                const confirmed = (getState() as RootState).optimisticCounters
                    .filter((change) => change.userId === userId && change.status === 'confirmed')
                    .map((change) => change.requestId)
                try {
                    await queryFulfilled
                    dispatch(counterChangesRemoved(confirmed))
                } catch {
                    // Keep acknowledged changes visible if the refresh fails.
                }
            },
        }),
        deleteCounter: builder.mutation<MessageResult, string>({
            query: (id) => ({ url: `${COUNTERS}/${id}`, method: 'DELETE' }),
            onQueryStarted(id, lifecycle) {
                return changeCounter(id, null, lifecycle, () => null)
            },
        }),
        updateCounter: builder.mutation<CounterResult, UpdateCounterInput>({
            query: (data) => ({ url: COUNTERS, method: 'PATCH', body: data }),
            onQueryStarted({ id, ...changes }, lifecycle) {
                return changeCounter(id, changes, lifecycle, ({ counter }) => ({
                    name: counter.name,
                    description: counter.description,
                    count: counter.count,
                    createdAt: counter.createdAt,
                }))
            },
        }),
        resetCounter: builder.mutation<{ count: number; message: string }, string>({
            query: (id) => ({ url: `${COUNTERS}/${id}/reset`, method: 'POST' }),
            onQueryStarted(id, lifecycle) {
                return changeCounter(id, { count: 0 }, lifecycle, ({ count }) => ({ count }))
            },
        }),
        fetchCurrentCount: builder.mutation<{ count: number }, string>({
            query: (publicKey) => ({ url: `${COUNTERS}/public/${publicKey}`, method: 'GET' }),
        }),
        incrementCounter: builder.mutation<{ count: number; message: string }, string>({
            query: (publicKey) => ({ url: `${COUNTERS}/public/${publicKey}`, method: 'POST' }),
            invalidatesTags: ['Counters'],
        }),
        // Bulk deletion stays server-confirmed because it affects every counter.
        deleteAllCounters: builder.mutation<{ message: string; deletedCount: number }, void>({
            query: () => ({ url: COUNTERS, method: 'DELETE' }),
            invalidatesTags: ['Counters'],
        }),
    }),
})

interface ChangeLifecycle<Result> {
    getState: () => unknown
    dispatch: (action: UnknownAction) => unknown
    requestId: string
    queryFulfilled: PromiseLike<{ data: Result }>
}

async function changeCounter<Result>(
    counterId: string,
    changes: CounterChanges | null,
    { getState, dispatch, requestId, queryFulfilled }: ChangeLifecycle<Result>,
    confirmedChanges: (result: Result) => CounterChanges | null,
): Promise<void> {
    const state = getState() as RootState
    const userId: string | undefined = state.auth.userInfo?._id
    const snapshot = userId ? countersApiSlice.endpoints.fetchUserCounters.select(userId)(state) : undefined
    const online = typeof navigator === 'undefined' || navigator.onLine !== false
    // Missing data, a failed refresh, or offline state requires confirmation.
    const optimistic = Boolean(online && !snapshot?.isError && snapshot?.data?.counters.some((counter) => counter._id === counterId))
    if (userId) {
        // Track even the server-confirmed path so remounting cannot unlock it.
        dispatch(counterChangeStarted({ requestId, userId, counterId, changes, optimistic }))
    }
    try {
        const { data } = await queryFulfilled
        dispatch(counterChangeConfirmed({ requestId, changes: confirmedChanges(data) }))
    } catch {
        // Removing just this request exposes the latest snapshot and keeps all
        // other pending changes. Array-index undo patches would not be safe here.
        dispatch(counterChangesRemoved([requestId]))
    } finally {
        const latestState = getState() as RootState
        const hasPendingChanges = latestState.optimisticCounters.some((change) => change.userId === userId && change.status === 'pending')
        if (userId && latestState.auth.userInfo?._id === userId && !hasPendingChanges) {
            // Run after confirmation so the next read captures the settled write.
            // Always reconcile: a lost response can hide a successful server write.
            // The last pending change refreshes the account once for the batch.
            dispatch(apiSlice.util.invalidateTags([{ type: 'Counters', id: userId }]))
        }
    }
}

export const {
    useCreateCounterMutation,
    useFetchUserCountersQuery,
    useDeleteCounterMutation,
    useResetCounterMutation,
    useFetchCurrentCountMutation,
    useIncrementCounterMutation,
    useUpdateCounterMutation,
    useDeleteAllCountersMutation,
} = countersApiSlice
