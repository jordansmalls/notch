import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
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
  onConfirm: () => void;
}

const AlertDialogCustom = ({
  trigger,
  title,
  description,
  actionCancel,
  actionConfirm,
  actionLoadingText = "Processing...",
  loading,
  onConfirm
}: AlertDialogCustomProps) => {
  return (
    <AlertDialog>
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

          <AlertDialogAction asChild>
            <SpinnerButton
              onClick={(e) => {
                e.preventDefault();
                onConfirm();
              }}
              loadingText={actionLoadingText}
              isLoading={loading}
            >
              {actionConfirm}
            </SpinnerButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogCustom;