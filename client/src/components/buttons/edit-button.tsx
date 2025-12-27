import { GripVertical } from "lucide-react";
import { EditCounterDialog } from "../dialogs/edit-counter-dialog";
import { toast } from "sonner";
import { useUpdateCounterMutation } from "../../slices/counters-api-slice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";



interface EditButtonProps {
  _id: string;
  counterName: string;
  counterDescription: string;
  onSuccess: (id: string, name: string, description: string) => void;
}

const EditButton = ({ _id, counterName, counterDescription, onSuccess }: EditButtonProps) => {
  const [updateCounter, { isLoading }] = useUpdateCounterMutation();

 const handleUpdateCounter = async (formData: { name: string; description: string }) => {
  try {
    await updateCounter({
      id: _id,
      ...formData
    }).unwrap();

    toast.success("Success!", {
      description: `${formData.name} has been updated.`,
    });

    onSuccess(_id, formData.name, formData.description);

  } catch (err: any) {
    toast.error("Error", {
      description: err?.data?.message || "Failed to update counter.",
    });
  }
};

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
        <EditCounterDialog
            _id={_id}
            name={counterName || ""}
            description={counterDescription || ""}
            onConfirm={handleUpdateCounter}
            loading={isLoading}
            trigger={
                <button

                aria-label="Edit counter">
                <GripVertical className="h-4 w-4" />
                </button>
            }
        />
        </TooltipTrigger>
        <TooltipContent side="top">Edit Counter</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default EditButton;