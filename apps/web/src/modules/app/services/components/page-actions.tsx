import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { CreateServiceDialog } from "./create-service-dialog";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export function ServicesPageActions() {
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
            Adicionar serviço
          </Button>
        </DialogTrigger>

        <DialogContent className="lg:min-w-lg">
          <CreateServiceDialog />
        </DialogContent>
      </Dialog>
    </div>
  );
}
