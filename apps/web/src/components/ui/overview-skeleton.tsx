import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "./card";
import { Skeleton } from "./skeleton";

interface OverviewSkeletonProps {
  cardCount?: number;
  className?: string;
}

export function OverviewSkeleton({
  cardCount = 4,
  className,
}: OverviewSkeletonProps) {
  return (
    <div className="flex flex-col w-full gap-4">
      <div className={cn("grid grid-cols-4 gap-4", className)}>
        {Array.from({ length: cardCount }).map((_, cardIndex) => (
          <Card key={cardIndex}>
            <CardHeader className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="size-8" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <Skeleton className="h-8 w-4" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="w-48 h-3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
