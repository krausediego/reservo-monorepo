import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type ServicesBadgesProps = {
  services: Array<{
    id: string;
    name: string;
  }>;
  maxVisible?: number;
};

export function ServicesBadges({
  services,
  maxVisible = 3,
}: ServicesBadgesProps) {
  const visible = services.slice(0, maxVisible);
  const hidden = services.slice(maxVisible);

  return (
    <div className="flex gap-2">
      {visible.map((s) => (
        <Badge key={s.id} variant="secondary" className="h-7 rounded-md">
          {s.name}
        </Badge>
      ))}
      {hidden.length > 0 && (
        <HoverCard openDelay={150} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Badge variant="secondary" className="h-7 rounded-md">
              +{hidden.length}
            </Badge>
          </HoverCardTrigger>
          <HoverCardContent align="start" className="w-auto max-w-72 p-2">
            <div className="flex flex-wrap gap-1.5">
              {hidden.map((s) => (
                <Badge
                  key={s.id}
                  variant="secondary"
                  className="h-7 rounded-md"
                >
                  {s.name}
                </Badge>
              ))}
            </div>
          </HoverCardContent>
        </HoverCard>
      )}
    </div>
  );
}
