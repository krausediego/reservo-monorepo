/* eslint-disable no-empty */
import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "./button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "./alert-dialog";
import { Spinner } from "./spinner";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void | Promise<unknown>;
  icon?: LucideIcon;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof AlertDialogContent>["size"];
  isPending?: boolean;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  icon: Icon,
  confirmLabel,
  cancelLabel = "Cancelar",
  variant = "destructive",
  size,
  isPending,
}: ConfirmDialogProps) {
  async function handleConfirm() {
    try {
      await onConfirm();
      onOpenChange(false);
    } catch {}
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (isPending && !next) return;
        onOpenChange(next);
      }}
    >
      <AlertDialogContent
        size={size}
        onEscapeKeyDown={(e) => {
          if (isPending) {
            e.preventDefault();
          }
        }}
      >
        <AlertDialogHeader>
          {Icon && (
            <AlertDialogMedia>
              <Icon />
            </AlertDialogMedia>
          )}

          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {cancelLabel}
          </AlertDialogCancel>

          <Button
            variant={variant}
            disabled={isPending}
            onClick={handleConfirm}
          >
            {isPending && <Spinner />}
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
