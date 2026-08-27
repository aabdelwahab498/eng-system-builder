import { QRCodeSVG } from "qrcode.react";

/**
 * Renders a real, scannable QR code encoding the current site URL.
 * Dark modules on a light "paper" card for universal scanner reliability.
 * Deterministic SVG output — identical on server and client, no hydration mismatch.
 */
export function SiteBarcode({ value, size = 104 }: { value: string; size?: number }) {
  return (
    <div className="flex justify-center">
      <div className="rounded-md border border-border bg-white p-2">
        <QRCodeSVG
          value={value}
          size={size}
          level="M"
          marginSize={1}
          bgColor="#ffffff"
          fgColor="#0a0f1e"
          aria-label={`QR code encoding ${value}`}
        />
      </div>
    </div>
  );
}
