import type { Counter } from "@/slices/counters-api-slice"
import { Button } from "../ui/button"
import { CreateCounterDrawer } from "../dialogs/create-counter-drawer"
import { CounterTileGrid } from "./counter-tiles"

const Data = ({ counters, hasData, isError, isFetching, onRetry }: {
  counters: Counter[]
  hasData: boolean
  isError: boolean
  isFetching: boolean
  onRetry: () => void
}) => {
  return (
    <div className="@container max-w-5xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 data-counter-overview tabIndex={-1} className="text-2xl font-medium">Overview</h1>
          <p className="text-muted-foreground mt-1">Track clicks across your sites and manage your counters.</p>
        </div>
        <CreateCounterDrawer trigger={<Button>Create counter</Button>} />
      </div>
      {isError && (
        <div role="status" className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <p>{hasData ? "Couldn't refresh your counters. Showing the last available data." : "Couldn't load your counters."}</p>
          <Button variant="outline" size="sm" disabled={isFetching} onClick={onRetry}>{isFetching ? "Refreshing..." : "Try again"}</Button>
        </div>
      )}
      {counters.length ? (
        <CounterTileGrid counters={counters} />
      ) : hasData ? (
        <div className="bg-muted rounded-md px-6 py-10 text-center">
          <p className="text-muted-foreground">No counters yet. Create your first one to get started.</p>
        </div>
      ) : null}
    </div>
  )
}

export default Data
