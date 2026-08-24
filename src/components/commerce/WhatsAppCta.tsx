import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { WHATSAPP_DISPLAY, whatsappLink } from "@/lib/whatsapp";

type Props = {
  message: string;
  label: string;
  className?: string;
  showNumber?: boolean;
};

/** Reusable WhatsApp CTA. Always uses the chat number, never a wallet number. */
export function WhatsAppCta({ message, label, className, showNumber = true }: Props) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-primary/20",
        className,
      )}
    >
      <MessageCircle className="size-4 text-primary" aria-hidden />
      {label}
      {showNumber && (
        <span dir="ltr" className="font-mono text-xs text-muted-foreground">
          {WHATSAPP_DISPLAY}
        </span>
      )}
    </a>
  );
}
