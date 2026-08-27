import { useEffect, useState } from "react";
import { siWhatsapp } from "simple-icons";
import { WHATSAPP_LINK } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/**
 * Floating quick-contact WhatsApp button.
 * Rendered once globally (see src/routes/__root.tsx) on public pages only.
 * Uses the canonical wa.link short link.
 */
export function QuickWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 240);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={cn(
        "fixed bottom-5 end-5 z-40 flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/15 p-3 text-emerald-300 shadow-lg shadow-emerald-500/20 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-emerald-500/25 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none",
        "md:bottom-6 md:end-6 md:p-3.5",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <span className="relative flex">
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-emerald-400/40" />
        <svg
          role="img"
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-6 md:size-7"
          fill="currentColor"
        >
          <path d={siWhatsapp.path} />
        </svg>
      </span>
      <span className="sr-only">WhatsApp</span>
    </a>
  );
}
