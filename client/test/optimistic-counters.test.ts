import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { configureStore, type UnknownAction } from '@reduxjs/toolkit'
import { apiSlice } from '../src/slices/api-slice'
import { countersApiSlice, type Counter } from '../src/slices/counters-api-slice'
import optimisticCounters, { applyCounterChanges } from '../src/slices/optimistic-counters-slice'

vi.mock('../src/utils/api-config', () => ({ API_BASE_URL: 'http://localhost/api' }))

const first: Counter = {
  _id: 'first', name: 'Visits', description: 'Page visits', count: 42,
  public_key: 'first-key', createdAt: '2026-01-02T00:00:00.000Z',
}
const second: Counter = { ...first, _id: 'second', name: 'Downloads', public_key: 'second-key', count: 7, createdAt: '2026-01-01T00:00:00.000Z' }

function makeStore() {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      optimisticCounters,
      auth: (state = { userInfo: { _id: 'alice' } }, action: UnknownAction) => {
        if (action.type === 'auth/setCredentials') return { userInfo: action.payload as { _id: string } }
        return state
      },
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  })
}

type PendingRequest = { request: Request; respond: (data: unknown, status?: number) => void; reject: () => void }
let store: ReturnType<typeof makeStore>
let requests: PendingRequest[]

beforeEach(() => {
  requests = []
  vi.stubGlobal('fetch', vi.fn((request: Request) => new Promise<Response>((resolve, reject) => {
    request.signal.addEventListener('abort', () => reject(request.signal.reason), { once: true })
    requests.push({
      request,
      respond: (data, status = 200) => resolve(new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })),
      reject: () => reject(new TypeError('Network connection lost')),
    })
  })))
  store = makeStore()
})

afterEach(() => {
  for (const query of store.dispatch(apiSlice.util.getRunningQueriesThunk())) query.abort()
  for (const mutation of store.dispatch(apiSlice.util.getRunningMutationsThunk())) mutation.abort()
  store.dispatch(apiSlice.util.resetApiState())
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

async function nextRequest(method: string) {
  await vi.waitFor(() => expect(requests.some(({ request }) => request.method === method)).toBe(true))
  const index = requests.findIndex(({ request }) => request.method === method)
  return requests.splice(index, 1)[0]
}

async function seed(counters = [first, second], userId = 'alice') {
  const query = store.dispatch(countersApiSlice.endpoints.fetchUserCounters.initiate(userId))
  ;(await nextRequest('GET')).respond({ counters })
  await query
  return { refetch: () => query.refetch() }
}

function visible(userId = 'alice') {
  const state = store.getState()
  const counters = countersApiSlice.endpoints.fetchUserCounters.select(userId)(state).data?.counters ?? []
  return applyCounterChanges(counters, state.optimisticCounters, userId)
}

async function refresh(counters: Counter[]) {
  ;(await nextRequest('GET')).respond({ counters })
  await vi.waitFor(() => {
    expect(countersApiSlice.endpoints.fetchUserCounters.select('alice')(store.getState()).status).toBe('fulfilled')
    expect(store.getState().optimisticCounters).toHaveLength(0)
    expect(visible()).toEqual(counters)
  })
}

describe('optimistic counter lifecycles', () => {
  it('shows edits immediately, uses the server response, and then accepts fresh public clicks', async () => {
    await seed()
    const mutation = store.dispatch(countersApiSlice.endpoints.updateCounter.initiate({ id: first._id, name: 'New visits', description: 'Changed', count: 0 }))
    expect(visible()[0]).toMatchObject({ name: 'New visits', description: 'Changed', count: 0, public_key: first.public_key })
    expect(store.getState().optimisticCounters[0].status).toBe('pending')
    ;(await nextRequest('PATCH')).respond({ counter: { ...first, name: 'Canonical name', count: 1 } })
    await mutation
    expect(visible()[0]).toMatchObject({ name: 'Canonical name', count: 1, public_key: first.public_key })
    await refresh([{ ...first, name: 'Canonical name', count: 4 }, second])
    expect(visible()[0].count).toBe(4)
  })

  it('rolls back a rejected reset without overwriting a concurrent edit on another counter', async () => {
    await seed()
    const reset = store.dispatch(countersApiSlice.endpoints.resetCounter.initiate(first._id))
    const edit = store.dispatch(countersApiSlice.endpoints.updateCounter.initiate({ id: second._id, name: 'New downloads', description: second.description }))
    expect(visible().map(({ count, name }) => ({ count, name }))).toEqual([{ count: 0, name: 'Visits' }, { count: 7, name: 'New downloads' }])
    ;(await nextRequest('POST')).respond({ message: 'Rate limited' }, 429)
    await reset
    expect(visible()[0].count).toBe(42)
    expect(visible()[1].name).toBe('New downloads')
    ;(await nextRequest('PATCH')).respond({ counter: { ...second, name: 'New downloads' } })
    await edit
    await refresh([first, { ...second, name: 'New downloads' }])
  })

  it('restores a failed deletion by ID while another deletion remains hidden', async () => {
    await seed()
    const removeFirst = store.dispatch(countersApiSlice.endpoints.deleteCounter.initiate(first._id))
    const removeSecond = store.dispatch(countersApiSlice.endpoints.deleteCounter.initiate(second._id))
    expect(visible()).toEqual([])
    ;(await nextRequest('DELETE')).respond({ message: 'Forbidden' }, 403)
    await removeFirst
    expect(visible().map(({ _id }) => _id)).toEqual(['first'])
    ;(await nextRequest('DELETE')).respond({ message: 'Deleted' })
    await removeSecond
    await refresh([first])
    expect(visible()).toEqual([first])
  })

  it('keeps a pending reset visible when an older list request returns', async () => {
    const query = await seed()
    const staleRead = query.refetch()
    const oldRequest = await nextRequest('GET')
    const reset = store.dispatch(countersApiSlice.endpoints.resetCounter.initiate(first._id))
    oldRequest.respond({ counters: [{ ...first, count: 50 }, second] })
    await staleRead
    expect(visible()[0].count).toBe(0)
    ;(await nextRequest('POST')).respond({ count: 0 })
    await reset
    await refresh([{ ...first, count: 2 }, second])
    expect(visible()[0].count).toBe(2)
  })

  it('keeps a confirmed reset visible when a read started before its acknowledgement returns', async () => {
    const query = await seed()
    const reset = store.dispatch(countersApiSlice.endpoints.resetCounter.initiate(first._id))
    const staleRead = query.refetch()
    const oldRequest = await nextRequest('GET')
    ;(await nextRequest('POST')).respond({ count: 0 })
    await reset
    oldRequest.respond({ counters: [first, second] })
    await staleRead
    expect(visible()[0].count).toBe(0)
    await refresh([{ ...first, count: 3 }, second])
    expect(visible()[0].count).toBe(3)
  })

  it('retains acknowledged values after a refresh failure and clears them on retry', async () => {
    const query = await seed()
    const reset = store.dispatch(countersApiSlice.endpoints.resetCounter.initiate(first._id))
    ;(await nextRequest('POST')).respond({ count: 0 })
    await reset
    ;(await nextRequest('GET')).respond({ message: 'Unavailable' }, 503)
    await vi.waitFor(() => expect(countersApiSlice.endpoints.fetchUserCounters.select('alice')(store.getState()).isError).toBe(true))
    expect(visible()[0].count).toBe(0)
    expect(store.getState().optimisticCounters[0].status).toBe('confirmed')
    const retry = query.refetch()
    await refresh([{ ...first, count: 5 }, second])
    await retry
    expect(visible()[0].count).toBe(5)
  })

  it('reconciles a lost response without automatically repeating a destructive write', async () => {
    await seed()
    const remove = store.dispatch(countersApiSlice.endpoints.deleteCounter.initiate(first._id))
    expect(visible()).toEqual([second])
    ;(await nextRequest('DELETE')).reject()
    await remove
    expect(visible()).toEqual([first, second])
    // The write reached the server even though the response was lost.
    await refresh([second])
    expect(visible()).toEqual([second])
    expect(vi.mocked(fetch).mock.calls.filter(([request]) => (request as Request).method === 'DELETE')).toHaveLength(1)
  })

  it('does not invent counters without a loaded snapshot', async () => {
    const reset = store.dispatch(countersApiSlice.endpoints.resetCounter.initiate(first._id))
    expect(store.getState().optimisticCounters[0]).toMatchObject({ status: 'pending', optimistic: false })
    ;(await nextRequest('POST')).respond({ count: 0 })
    await reset
    expect(visible()).toEqual([])
  })

  it('uses server confirmation when the browser is offline', async () => {
    await seed()
    vi.stubGlobal('navigator', { onLine: false })
    const reset = store.dispatch(countersApiSlice.endpoints.resetCounter.initiate(first._id))
    expect(visible()[0].count).toBe(42)
    expect(store.getState().optimisticCounters[0]).toMatchObject({ status: 'pending', optimistic: false })
    ;(await nextRequest('POST')).reject()
    await reset
  })

  it('unlocks and rolls back a timed-out write, then refreshes without retrying it', async () => {
    await seed()
    vi.useFakeTimers()
    const reset = store.dispatch(countersApiSlice.endpoints.resetCounter.initiate(first._id))
    await nextRequest('POST')
    expect(visible()[0].count).toBe(0)
    await vi.advanceTimersByTimeAsync(15_000)
    const result = await reset
    expect(result).toMatchObject({ error: { status: 'TIMEOUT_ERROR' } })
    expect(store.getState().optimisticCounters).toEqual([])
    expect(visible()[0].count).toBe(42)
    vi.useRealTimers()
    await refresh([first, second])
    expect(vi.mocked(fetch).mock.calls.filter(([request]) => (request as Request).method === 'POST')).toHaveLength(1)
  })

  it('shows a confirmed result after using the fallback for a failed snapshot', async () => {
    const query = await seed()
    const failedRead = query.refetch()
    ;(await nextRequest('GET')).respond({ message: 'Unavailable' }, 503)
    await failedRead
    const reset = store.dispatch(countersApiSlice.endpoints.resetCounter.initiate(first._id))
    expect(visible()[0].count).toBe(42)
    expect(store.getState().optimisticCounters[0]).toMatchObject({ status: 'pending', optimistic: false })
    ;(await nextRequest('POST')).respond({ count: 0 })
    await reset
    expect(visible()[0].count).toBe(0)
    await refresh([{ ...first, count: 2 }, second])
  })

  it('isolates account caches and drops late changes after an account switch', async () => {
    await seed()
    await seed([{ ...second, name: 'Bob counter' }], 'bob')
    const reset = store.dispatch(countersApiSlice.endpoints.resetCounter.initiate(first._id))
    expect(visible('bob')[0].name).toBe('Bob counter')
    store.dispatch({ type: 'auth/setCredentials', payload: { _id: 'bob' } })
    ;(await nextRequest('POST')).respond({ count: 0 })
    await reset
    expect(store.getState().optimisticCounters).toEqual([])
    expect(visible('bob')[0].name).toBe('Bob counter')
    expect(requests).toEqual([])
  })

  it('reorders edited dates immediately and restores the order on validation failure', async () => {
    await seed()
    const edit = store.dispatch(countersApiSlice.endpoints.updateCounter.initiate({ id: second._id, name: second.name, description: second.description, createdAt: '2026-09-01T00:00:00.000Z' }))
    expect(visible().map(({ _id }) => _id)).toEqual(['second', 'first'])
    ;(await nextRequest('PATCH')).respond({ message: 'Invalid date' }, 400)
    await edit
    expect(visible().map(({ _id }) => _id)).toEqual(['first', 'second'])
  })

  it('waits for creation and bulk deletion to be confirmed by the server', async () => {
    await seed()
    const create = store.dispatch(countersApiSlice.endpoints.createCounter.initiate({ name: 'New counter', description: 'New description' }))
    expect(visible()).toEqual([first, second])
    ;(await nextRequest('POST')).respond({ message: 'Invalid counter' }, 400)
    await create
    ;(await nextRequest('GET')).respond({ counters: [first, second] })
    const remove = store.dispatch(countersApiSlice.endpoints.deleteAllCounters.initiate())
    expect(visible()).toEqual([first, second])
    ;(await nextRequest('DELETE')).respond({ deletedCount: 2, message: 'Deleted' })
    await remove
    await refresh([])
    await vi.waitFor(() => expect(visible()).toEqual([]))
  })
})
