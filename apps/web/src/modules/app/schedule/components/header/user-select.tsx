import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCalendar } from "../../contexts";

export function UserSelect() {
  const { professionals, selectedUserId, setSelectedUserId } = useCalendar();

  return (
    <Select value={selectedUserId} onValueChange={setSelectedUserId}>
      <SelectTrigger className="flex-1 md:w-48">
        <SelectValue />
      </SelectTrigger>

      <SelectContent align="end">
        <SelectItem value="all">
          <div className="flex items-center gap-1">
            <AvatarGroup>
              {professionals.map(({ professional }) => (
                <Avatar key={professional.id} className="size-6 text-xxs">
                  <AvatarImage
                    src={professional.avatarUrl ?? undefined}
                    alt={professional.name}
                  />
                  <AvatarFallback className="text-xxs">
                    {professional.name[0]}
                  </AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
            All
          </div>
        </SelectItem>

        {professionals.map(({ professional }) => (
          <SelectItem
            key={professional.id}
            value={professional.id}
            className="flex-1"
          >
            <div className="flex items-center gap-2">
              <Avatar key={professional.id} className="size-6">
                <AvatarImage
                  src={professional.avatarUrl ?? undefined}
                  alt={professional.name}
                />
                <AvatarFallback className="text-xxs">
                  {professional.name[0]}
                </AvatarFallback>
              </Avatar>

              <p className="truncate">{professional.name}</p>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
