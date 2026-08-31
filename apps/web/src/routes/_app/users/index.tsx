import { ContentLayout } from "@/components/content-layout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { InviteUserDialog, UsersDataTable } from "@/modules/users/components";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Suspense } from "react";

export const Route = createFileRoute("/_app/users/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ContentLayout
      title="Usuários"
      description="Gerencie os usuários e permissões"
      action={
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus />
              Enviar convite
            </Button>
          </DialogTrigger>

          <DialogContent>
            <InviteUserDialog />
          </DialogContent>
        </Dialog>
      }
    >
      <Suspense fallback={<></>}>
        <UsersDataTable />
      </Suspense>
    </ContentLayout>
  );
}
