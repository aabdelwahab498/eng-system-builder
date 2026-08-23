import { ImageIcon } from "lucide-react";
import type { MediaSlot as MediaSlotType } from "@/types/content";
import { cn } from "@/lib/utils";

export function MediaSlot({
  media,
  note,
  className,
}: {
  media: MediaSlotType;
  note: string;
  className?: string;
}) {
  if (media.kind === "image" && media.src) {
    return (
      <img
        src={media.src}
        alt={media.alt}
        loading="lazy"
        className={cn("w-full rounded-md border border-border object-cover", className)}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={note}
      className={cn(
        "flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border-strong bg-surface/60 p-6 text-center",
        className,
      )}
    >
      <ImageIcon className="size-5 text-muted-foreground" aria-hidden />
      <p className="font-mono text-[11px] tracking-wide text-muted-foreground">
        {media.label ?? note}
      </p>
      <p className="max-w-xs text-xs text-muted-foreground/80">{note}</p>
    </div>
  );
}
