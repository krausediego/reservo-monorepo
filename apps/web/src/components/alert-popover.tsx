import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { useRef, useState } from "react";

type AlertPopoverProps = {
  title: string;
  description: string;
  handleConfirm: () => Promise<void>;
  isPending?: boolean;
};

export function AlertPopover({
  title,
  description,
  handleConfirm,
  isPending,
}: AlertPopoverProps) {
  const [open, setOpen] = useState(false);
  const closingRef = useRef(false);

  async function onConfirm() {
    try {
      await handleConfirm();
    } catch {
      return;
    } finally {
      closingRef.current = true;
      setOpen(false);
      setTimeout(() => {
        closingRef.current = false;
      }, 0);
    }
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (next && closingRef.current) return;
        setOpen(next);
      }}
    >
      <PopoverTrigger
        render={
          <Button disabled={isPending} variant="outline">
            Rejeitar
          </Button>
        }
      />
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>{title}</PopoverTitle>
          <PopoverDescription>{description}</PopoverDescription>
        </PopoverHeader>
        <div className="flex gap-2 justify-end">
          <PopoverClose
            render={
              <Button disabled={isPending} variant="outline">
                Cancelar
              </Button>
            }
          />
          <Button
            disabled={isPending}
            variant="destructive"
            onClick={onConfirm}
          >
            {isPending && <Spinner />}
            Confirmar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
