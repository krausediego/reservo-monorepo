import { cn } from "@/lib/utils";
import { useEffect, useMemo } from "react";

type ImageInputProps = {
  id: string;
  label: string;
  onPick: (file?: File) => void;
  value?: File;
  hint?: string;
  accept?: string;
  className?: string;
};

export function ImageInput({
  id,
  value,
  label,
  onPick,
  hint,
  accept = "image/*",
  className,
}: ImageInputProps) {
  const url = useMemo(() => {
    if (value) {
      return URL.createObjectURL(value);
    }
    return null;
  }, [value]);

  useEffect(() => {
    if (url) {
      URL.revokeObjectURL(url);
    }
  }, [url]);

  return (
    <label
      htmlFor={id}
      className={cn(
        "relative grid h-29 cursor-pointer place-items-center overflow-hidden rounded-md border border-dashed bg-[repeating-linear-gradient(135deg,rgb(250,250,250)_0px,rgb(250,250,250)_8px,rgb(244,244,245)_8px,rgb(244,244,245)_16px)] transition-colors hover:border-muted-foreground/50 hover:bg-muted",
        className,
      )}
    >
      <input
        id={id}
        type="file"
        accept={accept}
        className="absolute inset-0 cursor-pointer opacity-0"
        onChange={(e) => onPick(e.target.files?.[0] ?? undefined)}
      />

      {url ? (
        <img src={url} alt={label} className="object-cover" />
      ) : (
        <div className="flex flex-col items-center gap-1 p-2 text-center">
          <span className="text-xs font-medium text-muted-foreground">
            Carregar {label.toLowerCase()}
          </span>
          {hint && (
            <span className="font-mono text-xs text-muted-foreground/70">
              {hint}
            </span>
          )}
        </div>
      )}
    </label>
  );
}
