import { cn } from "@/lib/utils";

type SettingsContentLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
};

export function SettingsContentLayout({
  title,
  description,
  children,
  className,
}: SettingsContentLayoutProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className={cn("flex flex-1 gap-4", className)}>{children}</div>
    </div>
  );
}
