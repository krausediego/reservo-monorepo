import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { IListServicesSchema } from "@reservo/types";
import { CircleAlert, CircleCheck, CircleX, Ellipsis } from "lucide-react";
import { useState } from "react";
import { useRemoveServiceMutation, useUpdateServiceMutation } from "../hooks";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

type ServicesActionsProps = {
  service: IListServicesSchema.GetResponse["data"][number];
};

function getToggleStatusButton(isActive: boolean) {
  switch (isActive) {
    case true:
      return (
        <>
          <CircleAlert />
          Inativar
        </>
      );
    case false:
      return (
        <>
          <CircleCheck />
          Ativar
        </>
      );
  }
}

export function ServicesActions({ service }: ServicesActionsProps) {
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [confirmToggleStatusOpen, setConfirmToggleStatusOpen] = useState(false);

  const removeServiceMutation = useRemoveServiceMutation();
  const toggleStatusServiceMutation = useUpdateServiceMutation();

  return (
    <>
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setConfirmToggleStatusOpen(true)}>
              {getToggleStatusButton(service.isActive)}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setConfirmRemoveOpen(true)}
            >
              <CircleX />
              Remover
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ConfirmDialog
        open={confirmToggleStatusOpen}
        onOpenChange={setConfirmToggleStatusOpen}
        title="Deseja alterar o status deste serviço?"
        description="Esta ação pode afetar a visualização do serviço para seus clientes e impactar no agendamento de procedimentos"
        confirmLabel="Alterar"
        isPending={toggleStatusServiceMutation.isPending}
        onConfirm={() =>
          toggleStatusServiceMutation.mutateAsync({
            ...service,
            isActive: !service.isActive,
          })
        }
      />

      <ConfirmDialog
        open={confirmRemoveOpen}
        onOpenChange={setConfirmRemoveOpen}
        title="Deseja remover este serviço?"
        description="Esta ação não poderá ser desfeita."
        confirmLabel="Remover"
        isPending={removeServiceMutation.isPending}
        onConfirm={() => removeServiceMutation.mutateAsync({ id: service.id })}
      />
    </>
  );
}
