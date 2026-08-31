import { Calendar, Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { SidebarTrigger } from "./ui/sidebar";
import { Kbd, KbdGroup } from "./ui/kbd";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ModeToggle } from "./mode-toggle";
import { Notifications } from "./notifications";
import { MeHeader } from "./me-header";

export function AppHeader() {
  return (
    <header className="h-16 flex gap-4 items-center justify-between px-2">
      <div className="flex items-center gap-4">
        <SidebarTrigger />

        <InputGroup className="w-auto">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput placeholder="Buscar..." />
          <InputGroupAddon align="inline-end">
            <KbdGroup>
              <Kbd>⌘K</Kbd>
            </KbdGroup>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="flex items-center gap-4">
        <Button className="hidden lg:flex">
          <Calendar />
          Novo agendamento
        </Button>
        <Separator orientation="vertical" />
        <ModeToggle />
        <Notifications />
        <MeHeader />
      </div>
    </header>
  );
}
