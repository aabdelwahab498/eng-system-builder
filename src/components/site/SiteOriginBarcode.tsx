import { useEffect, useState } from "react";
import { SiteBarcode } from "@/components/site/SiteBarcode";

/**
 * Renders a QR code that resolves to the current site origin at runtime,
 * so it always scans to wherever the site is actually hosted
 * (preview now, production domain once published).
 *
 * Falls back to the canonical production domain for the SSR/initial paint
 * to avoid a hydration mismatch; the real origin is applied after mount.
 */
export function SiteOriginBarcode({ size = 72 }: { size?: number }) {
  const [origin, setOrigin] = useState("https://nextnext-gen.com");

  useEffect(() => {
    if (typeof window !== "undefined" && window.location?.origin) {
      setOrigin(window.location.origin);
    }
  }, []);

  return (
    <div className="flex flex-col items-center">
      <SiteBarcode value={origin} size={size} />
      <p className="mt-1 font-mono text-[10px] text-muted-foreground" dir="ltr">
        {origin.replace(/^https?:\/\/(www\.)?/, "")}
      </p>
    </div>
  );
}
