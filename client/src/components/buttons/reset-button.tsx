import { HugeiconsIcon } from "@hugeicons/react";
import { RotateLeft01Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { useResetCounterMutation } from "../../slices/counters-api-slice";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import AlertDialogCustom from "../dialogs/alert-dialog-custom";

interface ResetButtonProps {
  _id: string;
  counterName?: string;
}

const ResetButton = ({ _id, counterName }: ResetButtonProps) => {
  const [resetCounter, { isLoading }] = useResetCounterMutation();

  const handleResetCounter = async () => {
    try {

      await resetCounter(_id).unwrap();

      toast.success("Counter successfully reset.", {
        description: `${counterName || "Counter"} has been set back to zero.`,
      });
    } catch (err: any) {
      console.error("Reset Error:", err);
      toast.error("Oops!", {
        description: err?.data?.message || "We couldn't reset this counter.",
      });
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <AlertDialogCustom
          title="Are you sure?"
          description={`This action cannot be undone. This will permanently reset the count of ${
            counterName ? `"${counterName}"` : "this counter"
          } to zero.`}
          actionCancel="Cancel"
          actionConfirm="Reset"
          actionLoadingText="Resetting..."
          loading={isLoading}
          onConfirm={handleResetCounter}
          trigger={
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                disabled={isLoading}
                aria-label="Reset counter"
              >
                <HugeiconsIcon icon={RotateLeft01Icon} className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            </TooltipTrigger>
          }
        />
        <TooltipContent side="top">Reset Counter</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ResetButton;