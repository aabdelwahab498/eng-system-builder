import { useLocale } from "@/hooks/useLocale";
import profilePhoto from "@/assets/profile-ahmed.png.asset.json";
import { cn } from "@/lib/utils";

/**
 * Circular profile avatar for Eng. Ahmed Abdelwahab.
 * Responsive size keeps it consistent across mobile → desktop.
 */
export function ProfileAvatar({ className }: { className?: string }) {
  const { t } = useLocale();
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full",
        "border border-border-strong bg-surface/60",
        "size-16 sm:size-20 lg:size-24",
        "ring-1 ring-primary/20 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.45)]",
        className,
      )}
    >
      <img
        src={profilePhoto.url}
        alt={t.profile.photo?.alt ?? t.profile.displayName}
        className="h-full w-full object-cover object-top"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}
