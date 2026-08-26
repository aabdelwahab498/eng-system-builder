import { QRCodeSVG } from "qrcode.react";

/**
 * Renders a real, scannable QR code encoding the current site URL.
 * Deterministic SVG output — identical on server and client, no hydration mismatch.
 */
export function SiteBarcode({ value }: { value: string }) {
  return (
    <div className="flex justify-center">
      <div className="rounded-md border border-border bg-background p-2">
        <QRCodeSVG
          value={value}
          size={96}
          level="M"
          marginSize={0}
          bgColor="transparent"
          fgColor="currentColor"
          className="text-primary"
          aria-label={`QR code encoding ${value}`}
        />
      </div>
    </div>
  );
}
