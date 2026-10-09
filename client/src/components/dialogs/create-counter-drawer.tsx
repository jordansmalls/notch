import { useState, type FormEvent } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getErrorMessage } from "@/lib/utils"
import { useCreateCounterMutation } from "@/slices/counters-api-slice"

// matches the limits on the server's counter model
const NAME_MIN = 3
const NAME_MAX = 55
const DESCRIPTION_MAX = 255

export function CreateCounterDrawer({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const [createCounter, { isLoading }] = useCreateCounterMutation()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await createCounter({ name: name.trim(), description: description.trim() }).unwrap()
      toast.success("Counter created.", {
        description: `"${name.trim()}" is ready. Copy its public key from your dashboard.`,
      })
      setName("")
      setDescription("")
      setOpen(false)
    } catch (err) {
      toast.error("Oops! Something went wrong.", {
        description: getErrorMessage(err, "We couldn't create your counter. Try again."),
      })
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-md flex-col">
          <DrawerHeader className="p-6">
            <DrawerTitle className="text-base font-medium">Create a counter</DrawerTitle>
            <DrawerDescription>
              Name it and describe what it counts. You&apos;ll get a public key to increment it from any site.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-6 px-6">
            <Field className="gap-2">
              <FieldLabel htmlFor="counter-name">Name</FieldLabel>
              <Input
                id="counter-name"
                placeholder="Homepage visits"
                value={name}
                onChange={(e) => setName(e.target.value)}
                minLength={NAME_MIN}
                maxLength={NAME_MAX}
                aria-describedby="counter-name-help"
                required
              />
              <p id="counter-name-help" className="text-muted-foreground text-xs">
                {NAME_MIN} to {NAME_MAX} characters.
              </p>
            </Field>

            <Field className="gap-2">
              <FieldLabel htmlFor="counter-description">Description</FieldLabel>
              <Textarea
                id="counter-description"
                placeholder="Counts each load of the landing page."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={DESCRIPTION_MAX}
                rows={3}
                aria-describedby="counter-description-count"
                required
              />
              <p id="counter-description-count" className="text-muted-foreground text-xs tabular-nums">
                {description.length}/{DESCRIPTION_MAX}
              </p>
            </Field>
          </div>

          <DrawerFooter className="p-6">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating…" : "Create counter"}
            </Button>
            <DrawerClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
