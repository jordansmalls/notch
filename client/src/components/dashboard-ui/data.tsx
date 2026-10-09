import type { Counter } from "@/slices/counters-api-slice"
import { Button } from "../ui/button"
import { CreateCounterDrawer } from "../dialogs/create-counter-drawer"
import { CounterTileGrid } from "./counter-tiles"

const Data = ({ counters, isError }: { counters: Counter[]; isError: boolean }) => {
  return (
    <div className="@container max-w-5xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium">Overview</h1>
          <p className="text-muted-foreground mt-1">Track clicks across your sites and manage your counters.</p>
        </div>
        <CreateCounterDrawer trigger={<Button>Create counter</Button>} />
      </div>
      {isError ? (
        <p className="text-muted-foreground">We&apos;re having trouble fetching your counters. Refresh to try again.</p>
      ) : counters.length ? (
        <CounterTileGrid counters={counters} />
      ) : (
        <div className="bg-muted rounded-md px-6 py-10 text-center">
          <p className="text-muted-foreground">No counters yet. Create your first one to get started.</p>
        </div>
      )}
    </div>
  )
}

export default Data
