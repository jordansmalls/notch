import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Pulls the server's { message } out of an RTK Query error, if there is one.
export function getErrorMessage(err: unknown, fallback: string) {
  if (typeof err === "object" && err !== null) {
    if ("data" in err && typeof err.data === "object" && err.data !== null && "message" in err.data && typeof err.data.message === "string") {
      return err.data.message
    }
    if ("message" in err && typeof err.message === "string") {
      return err.message
    }
  }
  return fallback
}
