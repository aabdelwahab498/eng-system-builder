import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

/**
 * Renders a real, scannable Code128 barcode encoding the current site URL.
 * Browser-rendered via jsbarcode; SSR renders an empty <svg> that is filled
 * after hydration (no hydration mismatch — the initial markup is identical).
 */
export function SiteBarcode({ value }: { value: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    try {
      JsBarcode(ref.current, value, {
        format: "CODE128",
        width: 2,
        height: 48,
        margin: 0,
        displayValue: false,
        background: "transparent",
        lineColor: "currentColor",
      });
    } catch {
      /* ignore render errors */
    }
  }, [value]);

  return (
    <svg
      ref={ref}
      role="img"
      aria-label={`Barcode encoding ${value}`}
      className="block h-12 w-full text-primary"
    />
  );
}
