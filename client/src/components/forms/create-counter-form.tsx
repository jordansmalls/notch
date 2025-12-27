import { cn } from "@/lib/utils"
import { SpinnerButton } from "../buttons/spinner-button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { useState } from "react"

import { toast } from "sonner"

import { useCreateCounterMutation } from "../../slices/counters-api-slice"
import { useNavigate } from "react-router-dom"

export function CreateCounterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();
  const [createCounter, { isLoading }] = useCreateCounterMutation();


  const isInvalid = name.length < 3;
  const isDescriptionLimit = description.length >= 500;

  const isDisabled = isInvalid || isLoading;

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isInvalid) return;

    try {
      const res = await createCounter({ name, description }).unwrap();
      toast.success(`${res.message}`, {
        description: `The ${name} counter has been successfully created.`,
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Counter creation err:", err);
      toast.error("We're having trouble.", {
        description: "Please try again shortly, thank you.",
      });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create Counter</CardTitle>
          <CardDescription>
            Enter a counter name and optionally a description.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Counter name (min 3 chars)"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>

              <Field>
                <div className="flex justify-between items-center">
                  <FieldLabel htmlFor="description">Description (Optional)</FieldLabel>
                  <span className={cn(
                    "text-[10px] text-muted-foreground",
                    isDescriptionLimit && "text-destructive font-medium"
                  )}>
                    {description.length}/500
                  </span>
                </div>
                <Input
                  id="description"
                  type="text"
                  placeholder="Enter a description"
                  value={description}
                  className={cn(
                    "transition-colors",
                    isDescriptionLimit && "border-destructive focus-visible:ring-destructive"
                  )}
                  maxLength={500}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>

              <Field>
                <SpinnerButton
                  type="submit"
                  isLoading={isLoading}
                  loadingText="Please wait"
                  disabled={isDisabled}
                >
                  Continue
                </SpinnerButton>

                <FieldDescription className="text-center">
                  Like the service? Please give a ⭐ on{" "}
                  <a
                    href="https://www.github.com/jordansmalls/notch"
                    target="_blank"
                    rel="noreferrer"
                    className="transition ease-in hover:text-primary duration-200"
                  >
                    Github
                  </a>.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}