import { SiteBarcode } from "@/components/site/SiteBarcode";
import { site } from "@/content";

/**
 * Renders a QR code that resolves to the canonical NextGen site domain.
 *
 * The CV is a stable document: its QR must always scan to the real site
 * (https://nextnext-gen.com), regardless of where the CV is viewed or
 * generated — preview, live site, or a downloaded/printed PDF. Using the
 * canonical domain instead of `window.location.origin` keeps the printed and
 * downloaded PDFs correct (no localhost/preview URLs leak onto paper).
 */
const CANONICAL_ORIGIN = site.domain.replace(/\/$/, "");

export function SiteOriginBarcode({ size = 72 }: { size?: number }) {
  return (
    <div className="flex flex-col items-center">
      <SiteBarcode value={CANONICAL_ORIGIN} size={size} />
      <p className="mt-1 font-mono text-[10px] text-muted-foreground" dir="ltr">
        {CANONICAL_ORIGIN.replace(/^https?:\/\/(www\.)?/, "")}
      </p>
    </div>
  );
}
