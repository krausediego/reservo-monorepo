import { ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type AppSidebarToggleProps = {
  isOpen: boolean | undefined;
  setIsOpen?: () => void;
};

export function AppSidebarToggle({ isOpen, setIsOpen }: AppSidebarToggleProps) {
  const handleToggleSidebar = () => {
    if (setIsOpen) {
      setIsOpen();
    }
  };

  return (
    <div>
      <Button size="icon-sm" variant="outline" onClick={handleToggleSidebar}>
        <ChevronLeft
          className={cn(
            "size-4 transition-transform ease-in-out duration-700",
            !isOpen ? "rotate-180" : "rotate-0",
          )}
        />
      </Button>
    </div>
  );
}
