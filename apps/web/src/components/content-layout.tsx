type ContentLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  action?: React.ReactNode;
};

export function ContentLayout({
  title,
  description,
  action,
  children,
}: ContentLayoutProps) {
  return (
    <div className="space-y-4 container mx-auto">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {action}
      </div>

      <div className="flex flex-1 gap-4">{children}</div>
    </div>
  );
}
