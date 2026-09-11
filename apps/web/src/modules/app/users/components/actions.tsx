import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Spinner } from "@/components/ui/spinner";

type UsersActionsProps = {
  memberId: string;
};

export function UsersActions({ memberId }: UsersActionsProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { mutateAsync: revokeUserFn, isPending: isRevokeUserPending } =
    useRevokeUserMutation();

  const handleRevokeUser = async () => {
    await revokeUserFn({ id: memberId });
    setOpenDeleteDialog(false);
  };

  return (
    <>
      <div className=" flex justify-end">
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
              onClick={() => setOpenDeleteDialog(true)}
            >
              <UserRoundX />
              Remover
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent
          onEscapeKeyDown={(e) => {
            if (isRevokeUserPending) {
              e.preventDefault();
            }
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>
              Tem certeza que deseja remover este usuário?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRevokeUserPending}>
              Cancelar
            </AlertDialogCancel>
            <Button
              disabled={isRevokeUserPending}
              variant="destructive"
              onClick={handleRevokeUser}
            >
              {isRevokeUserPending && <Spinner />}Confirmar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
