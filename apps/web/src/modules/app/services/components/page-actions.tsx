import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { CreateServiceDialog } from "./create-service-dialog";

export function ServicesPageActions() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Adicionar serviço
        </Button>
      </DialogTrigger>

      <DialogContent className="lg:min-w-lg">
        <CreateServiceDialog />
      </DialogContent>
    </Dialog>
  );
}
