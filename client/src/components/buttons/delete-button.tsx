import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { useDeleteCounterMutation } from "../../slices/counters-api-slice";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import AlertDialogCustom from "../dialogs/alert-dialog-custom";

interface DeleteButtonProps {
  id: string;
  counterName?: string;
}

const DeleteButton = ({ id, counterName }: DeleteButtonProps) => {
  const [deleteCounter, { isLoading }] = useDeleteCounterMutation();

  const handleDeleteCounter = async () => {
    try {
      await deleteCounter(id).unwrap();
      toast.success("Deleted!", {
        description: `${counterName || "Counter"} has been removed.`,
      });
    } catch (err: any) {
      console.error("Delete Error:", err);
      toast.error("Oops!", {
        description: err?.data?.message || "We couldn't delete this counter.",
      });
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <AlertDialogCustom
          title="Are you absolutely sure?"
          description={`This action cannot be undone. This will permanently delete ${
            counterName ? `"${counterName}"` : "this counter"
          } and remove all data from our servers.`}
          actionCancel="Cancel"
          actionConfirm="Delete"
          actionLoadingText="Processing..."
          loading={isLoading}
          onConfirm={handleDeleteCounter}
          trigger={
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                disabled={isLoading}
                aria-label="Delete counter"
              >
                <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
          }
        />
        <TooltipContent side="top">Delete Counter</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DeleteButton;