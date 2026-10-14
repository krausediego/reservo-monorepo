import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LayoutGrid, Plus, TableProperties } from "lucide-react";
import { CreateServiceDialog } from "./create-service-dialog";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export function ServicesPageActions() {
  return (
    <div className="flex items-center gap-4">
      <TabsList>
        <TabsTrigger value="card">
          <LayoutGrid />
        </TabsTrigger>
        <TabsTrigger value="list">
          <TableProperties className="rotate-180" />
        </TabsTrigger>
      </TabsList>

      <Separator orientation="vertical" />

      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus />
            Adicionar serviço
          </Button>
        </DialogTrigger>

        <DialogContent className="md:min-w-2xl lg:min-w-4xl">
          <CreateServiceDialog />
        </DialogContent>
      </Dialog>
    </div>
  );
}
