export const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value)

// standalone figures compact past 10,000 (48.2K); pair with the full value for screen readers
export const formatCompact = (value: number) =>
  value < 10_000
    ? formatNumber(value)
    : new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value)

export const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

