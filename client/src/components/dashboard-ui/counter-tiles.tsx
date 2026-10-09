import type { Counter } from "@/slices/counters-api-slice"
import { formatCompact, formatDate, formatNumber } from "@/lib/counter-format"
import { CounterActions } from "./counter-actions"

export function CounterTileGrid({ counters }: { counters: Counter[] }) {
  return (
      <ul className="grid grid-cols-1 gap-4 @min-[36rem]:grid-cols-2 @min-[56rem]:grid-cols-3">
        {counters.map((counter) => (
          <li key={counter._id} className="bg-muted flex min-w-0 flex-col rounded-md p-6">
            <div className="min-w-0">
              <h2 className="truncate font-medium" title={counter.name}>{counter.name}</h2>
              <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed break-words">{counter.description}</p>
            </div>
            {/* pinned to the bottom so figures line up across a row; proportional figures, compact form is visual only */}
            <div className="mt-auto pt-6">
              <p className="text-[32px] leading-none font-semibold tracking-[-0.04em]">
                <span aria-hidden="true">{formatCompact(counter.count)}</span>
                <span className="sr-only">{formatNumber(counter.count)} clicks</span>
              </p>
              <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Clicks since
                  <span className="block whitespace-nowrap">{formatDate(counter.createdAt)}</span>
                </p>
                <CounterActions counter={counter} />
              </div>
            </div>
          </li>
        ))}
      </ul>
  )
}
