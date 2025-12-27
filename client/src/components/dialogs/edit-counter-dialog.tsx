import { Button } from "@/components/ui/button";
import { SpinnerButton } from "../buttons/spinner-button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";


interface EditCounterDialogProps {
  trigger: React.ReactNode;
  loading: boolean;
  _id: string;
  name: string;
  description: string;
  onConfirm: (data: { name: string; description: string }) => void;
}

export function EditCounterDialog({
  name: initialName,
  description,
  trigger,
  loading,
  onConfirm,
}: EditCounterDialogProps) {
  const [open, setOpen] = useState(false);


  const [localName, setLocalName] = useState(initialName);
  const NAME_LIMIT = 55;


  useEffect(() => {
    setLocalName(initialName);
  }, [initialName, open]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only update state if it's within the limit
    if (value.length <= NAME_LIMIT) {
      setLocalName(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const updatedData = {
      name: localName,
      description: formData.get("description") as string,
    };

    await onConfirm(updatedData);
    setOpen(false);
  };

  const isAtLimit = localName.length === NAME_LIMIT;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      </TooltipTrigger>
      <TooltipContent>
        Edit Counter
      </TooltipContent>
      </Tooltip>
      </TooltipProvider>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Counter</DialogTitle>
            <DialogDescription>
              Make changes to your counter here, click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="edit-name">Counter Name</Label>
                <span className={cn(
                  "text-[10px] font-medium",
                  isAtLimit ? "text-destructive" : "text-muted-foreground"
                )}>
                  {localName.length}/{NAME_LIMIT}
                </span>
              </div>
              <Input
                id="edit-name"
                name="name"
                value={localName}
                onChange={handleNameChange}
                required
                className={cn(
                  "transition-colors",
                  isAtLimit && "border-destructive focus-visible:ring-destructive"
                )}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="edit-description">Counter Description</Label>
              <Input
                id="edit-description"
                name="description"
                defaultValue={description}
              />
            </div>
          </div>

          <DialogFooter className="gap-4 sm:gap-0 lg:gap-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <SpinnerButton
              type="submit"
              loadingText="Saving"
              isLoading={loading}
            >
              Update
            </SpinnerButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}