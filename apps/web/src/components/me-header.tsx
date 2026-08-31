import { useMeQuery } from "@/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { User2 } from "lucide-react";

export function MeHeader() {
  const { data } = useMeQuery();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="rounded-full">
          <Avatar>
            <AvatarImage src={data?.user?.image ?? undefined} />
            <AvatarFallback>
              <User2 />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
}
