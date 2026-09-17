import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, UserRoundX } from "lucide-react";
import { useState } from "react";
import { useRevokeUserMutation } from "../hooks";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

type UsersActionsProps = {
  memberId: string;
};

export function UsersActions({ memberId }: UsersActionsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const revokeUserMutation = useRevokeUserMutation();

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
              onClick={() => setConfirmOpen(true)}
            >
              <UserRoundX />
              Remover
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        icon={UserRoundX}
        title="Remover este usuário?"
        description="Esta ação não poderá ser desfeita"
        confirmLabel="Remover"
        isPending={revokeUserMutation.isPending}
        onConfirm={() => revokeUserMutation.mutateAsync({ id: memberId })}
      />
    </>
  );
}
