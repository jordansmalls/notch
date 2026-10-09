import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { SpinnerButton } from "../buttons/spinner-button";



interface AlertDialogCustomProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  actionCancel: string;
  actionConfirm: string;
  actionLoadingText?: string;
  loading: boolean;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
}

const AlertDialogCustom = ({
  trigger,
  title,
  description,
  actionCancel,
  actionConfirm,
  actionLoadingText = "Processing...",
  loading,
  destructive = false,
  onConfirm
}: AlertDialogCustomProps) => {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            {actionCancel}
          </AlertDialogCancel>

          {/* a plain button rather than AlertDialogAction, which closes immediately and overrides the variant */}
          <SpinnerButton
            onClick={async () => {
              // keep the dialog open while the action runs, then close it
              await onConfirm();
              setOpen(false);
            }}
            loadingText={actionLoadingText}
            isLoading={loading}
            variant={destructive ? "destructive" : "default"}
          >
            {actionConfirm}
          </SpinnerButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogCustom;