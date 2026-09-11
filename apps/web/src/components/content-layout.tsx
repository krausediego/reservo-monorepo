import { cn } from "@/lib/utils";

type ContentLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

export function ContentLayout({
  title,
  description,
  action,
  children,
  className,
}: ContentLayoutProps) {
  return (
    <div className="space-y-4 container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {action}
      </div>

      <div className={cn("flex flex-1 gap-4", className)}>{children}</div>
    </div>
  );
}
