"use client";

import * as React from "react";
import { XIcon } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "./spinner";
import {
  FormProvider,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form";

type DialogContextProps = {
  open: boolean;
  prevent: boolean;
  onClose: () => void;
  preventCloseDialog: (isPrevent: boolean) => void;
  onOpenChange: (state: boolean) => void;
};

const DialogContext = React.createContext<DialogContextProps | null>(null);

function useDialog() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }

  return context;
}

function Dialog({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultOpen = false,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  const [prevent, setPrevent] = React.useState(false);
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const onOpenChange = (state: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(state);
    }
    controlledOnOpenChange?.(state);
  };
  const onClose = () => {
    onOpenChange(false);
  };
  const preventCloseDialog = (isPrevent: boolean) => {
    setPrevent(isPrevent);
  };

  return (
    <DialogContext.Provider
      value={{ prevent, open, onClose, preventCloseDialog, onOpenChange }}
    >
      <DialogPrimitive.Root
        data-slot="dialog"
        onOpenChange={onOpenChange}
        open={open}
        {...props}
      >
        {children}
      </DialogPrimitive.Root>
    </DialogContext.Provider>
  );
}

type DialogFormProps<TFieldValues extends FieldValues> = Omit<
  React.ComponentProps<"form">,
  "onSubmit"
> & {
  form: UseFormReturn<TFieldValues>;
  onSubmit: (values: TFieldValues) => unknown | Promise<unknown>;
  children: React.ReactNode;
  autoCloseOnSuccess?: boolean;
  resetOnSuccess?: boolean;
};

function DialogForm<TFieldValues extends FieldValues>({
  form,
  onSubmit,
  autoCloseOnSuccess = true,
  resetOnSuccess = false,
  children,
  className,
  ...props
}: DialogFormProps<TFieldValues>) {
  const { preventCloseDialog, onClose } = useDialog();

  const handleSubmit: SubmitHandler<TFieldValues> = async (values) => {
    preventCloseDialog(true);
    try {
      await onSubmit(values);

      if (resetOnSuccess) {
        form.reset();
      }
      if (autoCloseOnSuccess) {
        onClose();
      }
    } finally {
      preventCloseDialog(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn("contents", className)}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  const { prevent } = useDialog();

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className,
        )}
        onEscapeKeyDown={(e) => {
          if (prevent) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          if (prevent) {
            e.preventDefault();
          }
        }}
        onPointerDownOutside={(e) => {
          if (prevent) {
            e.preventDefault();
          }
        }}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close data-slot="dialog-close" asChild>
            <Button
              variant="ghost"
              className="absolute top-2 right-2"
              size="icon-sm"
              disabled={prevent}
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "cn-font-heading text-base leading-none font-medium",
        className,
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function DialogSubmitButton({
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { prevent } = useDialog();

  return (
    <Button type="submit" disabled={prevent} {...props}>
      {prevent && <Spinner />}
      {children}
    </Button>
  );
}

function DialogCloseButton({
  variant = "outline",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { prevent } = useDialog();

  return (
    <DialogPrimitive.Close data-slot="dialog-close" asChild>
      <Button variant={variant} disabled={prevent} {...props} />
    </DialogPrimitive.Close>
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DialogForm,
  DialogSubmitButton,
  DialogCloseButton,
  useDialog,
};
