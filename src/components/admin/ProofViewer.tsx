import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, ReceiptText } from "lucide-react";
import { toast } from "sonner";

import { adminGetPaymentProofUrl } from "@/lib/payments/payments.functions";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/**
 * Admin-only viewer for payment proof files stored in the private
 * payment-proofs bucket. Fetches a short-lived signed URL on demand and
 * shows the image (or PDF) in a dialog.
 */
export function ProofViewer({
  path,
  label = "Payment proof",
  compact = false,
}: {
  path: string;
  label?: string;
  compact?: boolean;
}) {
  const getUrl = useServerFn(adminGetPaymentProofUrl);
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function show() {
    if (url) {
      setOpen(true);
      return;
    }
    setLoading(true);
    try {
      const res = await getUrl({ data: { path } });
      setUrl(res.url);
      setOpen(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load the proof file");
    } finally {
      setLoading(false);
    }
  }

  const isPdf = path.toLowerCase().endsWith(".pdf");

  return (
    <>
      <button
        type="button"
        onClick={() => void show()}
        className={
          compact
            ? "inline-flex items-center gap-1.5 rounded border border-primary/40 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-primary transition-colors hover:bg-primary/10"
            : "inline-flex items-center gap-2 rounded-md border border-primary/40 px-3 py-2 text-xs text-primary transition-colors hover:bg-primary/10"
        }
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
        ) : (
          <ReceiptText className="h-3.5 w-3.5" aria-hidden />
        )}
        {label}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
          </DialogHeader>
          {url &&
            (isPdf ? (
              <iframe src={url} title={label} className="h-[80vh] w-full rounded-md border border-border" />
            ) : (
              <img
                src={url}
                alt={label}
                className="max-h-[80vh] w-full rounded-md border border-border object-contain"
              />
            ))}
        </DialogContent>
      </Dialog>
    </>
  );
}
