import type { MouseEvent } from "react";

/**
 * Opens a "Live preview" URL in a way that also works on mobile browsers and
 * inside embedded/sandboxed frames, where `target="_blank"` can be silently
 * blocked and leaves the visitor stuck on the current screen.
 *
 * Falls back to a same-tab navigation when the popup is refused, so the
 * preview URL always renders standalone (no dialog/overlay state involved).
 */
export function openExternalPreview(url: string, event?: MouseEvent<HTMLAnchorElement>) {
  if (event) {
    // Respect modifier/middle clicks: let the browser handle those natively.
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
  }
  if (typeof window === "undefined") return;
  let opened: Window | null = null;
  try {
    opened = window.open(url, "_blank", "noopener,noreferrer");
  } catch {
    opened = null;
  }
  if (!opened) window.location.href = url;
}
