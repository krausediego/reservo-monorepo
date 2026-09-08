import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { InviteUserDialog } from "./invite-user-dialog";

export function UsersPageActions() {
  return (
    <div className="flex items-center gap-4">
      <TabsList>
        <TabsTrigger value="card">Card</TabsTrigger>
        <TabsTrigger value="list">Lista</TabsTrigger>
      </TabsList>

      <Separator orientation="vertical" />

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
    </div>
  );
}
