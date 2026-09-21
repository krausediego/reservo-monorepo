import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { IListProfessionalsSchema } from "@reservo/types";
import { CircleX, Ellipsis } from "lucide-react";
import { useState } from "react";
import { useDeleteProfessionalMutation } from "../hooks";

type ProfessionalsActionsProps = {
  professional: IListProfessionalsSchema.GetResponse["data"][number]["professional"];
};

export function ProfessionalsActions({
  professional,
}: ProfessionalsActionsProps) {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const deleteProfessionalMutation = useDeleteProfessionalMutation();

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
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setConfirmDeleteOpen(true)}
            >
              <CircleX />
              Remover
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Deseja excluir este profissional?"
        description="O profissional só pode ser excluído caso não possua agendamentos futuros vinculados a ele."
        confirmLabel="Excluir"
        isPending={deleteProfessionalMutation.isPending}
        onConfirm={() =>
          deleteProfessionalMutation.mutateAsync({ id: professional.id })
        }
      />
    </>
  );
}
