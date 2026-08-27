import { cn } from "@/lib/utils";

export type FilterOption = { id: string; label: string };

/**
 * Shared category filter used by projects, work sections and the gallery.
 * Options always come from the content layer — never a hardcoded list.
 */
export function FilterBar({
  label,
  options,
  active,
  onChange,
  className,
}: {
  label: string;
  options: FilterOption[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          aria-pressed={active === option.id}
          className={cn(
            "rounded-sm border px-3 py-2 font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            active === option.id
              ? "border-primary/50 bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
