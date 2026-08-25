import logoAsset from "@/assets/logo-nextgen.png.asset.json";
import { cn } from "@/lib/utils";

/** "next gen" brand mark — the NEXTGEN-SOLUTIONS logo placed inside a circle. */
export function NextGenMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex select-none items-center", className)}>
      <span className="overflow-hidden rounded-full ring-1 ring-border shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
        <img
          src={logoAsset.url}
          alt="NEXTGEN-SOLUTIONS"
          className="h-12 w-12 object-cover sm:h-14 sm:w-14"
          width={56}
          height={56}
          loading="eager"
        />
      </span>
    </span>
  );
}
