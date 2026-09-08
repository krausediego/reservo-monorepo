import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

type DataCardsSkeletonProps = {
  cardCount?: number;
  showCheckbox?: boolean;
  showActions?: boolean;
  lineCount?: number;
  gridClassName?: string;
  showPagination?: boolean;
};

export function DataCardsSkeleton({
  cardCount = 9,
  showCheckbox = false,
  showActions = true,
  lineCount = 3,
  gridClassName,
  showPagination = true,
}: DataCardsSkeletonProps) {
  return (
    <div className="flex flex-col w-full gap-4">
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
          gridClassName,
        )}
      >
        {Array.from({ length: cardCount }).map((_, cardIndex) => (
          <div
            key={cardIndex}
            className="flex flex-col justify-between rounded-lg border bg-card p-4 shadow-sm"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 w-full">
                {showCheckbox && (
                  <Skeleton className="size-4 shrink-0 rounded" />
                )}
                <div className="space-y-2 w-full">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              </div>

              {showActions && (
                <Skeleton className="size-8 shrink-0 rounded-md" />
              )}
            </div>

            {/* Conteúdo / Linhas de detalhes */}
            {lineCount > 0 && (
              <div className="mt-4 space-y-2.5 border-t pt-3">
                {Array.from({ length: lineCount }).map((_, lineIndex) => (
                  <div
                    key={lineIndex}
                    className="flex items-center justify-between gap-4"
                  >
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {showPagination && (
        <div className="flex justify-end gap-4 ml-auto">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      )}
    </div>
  );
}
