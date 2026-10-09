import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input bg-background flex min-h-20 w-full min-w-0 rounded-md border px-3 py-2 text-base outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
