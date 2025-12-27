import { Button } from "../ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface CopyButtonProps {
  counterName: string;
  counterPublicKey: string;
}


const CopyButton = ({ counterName, counterPublicKey }: CopyButtonProps) => {



    // TODO: update to copy on clipboards on mobile
  const copyToClipboard = (key: string) => {
    if (!navigator.clipboard) {
      toast.error("Clipboard not supported");
      return;
    }

    navigator.clipboard.writeText(key);
    toast.success(`Copied to Clipboard.`, {
      description: `The public key for "${counterName}" has been copied to your clipboard.`,
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => copyToClipboard(counterPublicKey)}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Copy Public Key
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CopyButton;