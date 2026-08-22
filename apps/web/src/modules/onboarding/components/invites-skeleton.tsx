import { Skeleton } from "@/components/ui/skeleton";

export function InvitesSkeleton() {
  return (
    <div className="w-full flex flex-col space-y-3">
      <p className="text-muted-foreground w-full max-w-150 mx-auto text-sm">
        Convites pendentes:
      </p>

      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex mx-auto items-center w-full max-w-150 bg-card justify-between py-4 px-4 rounded-lg border shadow-sm"
        >
          <div className="flex items-center gap-4">
            <Skeleton className="bg-muted-foreground/10 size-9" />
            <Skeleton className="bg-muted-foreground/10 h-9 w-32" />
          </div>

          <div className="space-x-4 flex items-center">
            <Skeleton className="bg-muted-foreground/10 h-9 w-16" />
            <Skeleton className="bg-muted-foreground/10 h-9 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
