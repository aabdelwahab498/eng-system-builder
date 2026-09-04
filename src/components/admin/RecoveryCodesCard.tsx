import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  adminGenerateRecoveryCodes,
  adminRecoveryStatus,
} from "@/lib/security/recovery.functions";
import { Button } from "@/components/ui/button";

/** Generate and display single-use MFA recovery codes for the signed-in admin. */
export function RecoveryCodesCard() {
  const qc = useQueryClient();
  const status = useServerFn(adminRecoveryStatus);
  const generate = useServerFn(adminGenerateRecoveryCodes);
  const [codes, setCodes] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);

  const { data } = useQuery({
    queryKey: ["admin", "recovery-status"],
    queryFn: () => status(),
  });

  async function regenerate() {
    setBusy(true);
    try {
      const result = await generate();
      setCodes(result.codes);
      qc.invalidateQueries({ queryKey: ["admin", "recovery-status"] });
      toast.success("New recovery codes generated. Save them now.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not generate codes");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-lg border border-border bg-surface/60 p-5">
      <p className="eyebrow">Security</p>
      <h2 className="mt-2 font-display text-lg font-semibold text-foreground">Recovery codes</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Single-use backup codes for when the authenticator device is lost. Using one removes the
        enrolled authenticator so a new device can be paired. Codes are stored hashed and shown
        only once.
      </p>
      <p className="mt-3 text-sm text-foreground">
        {data ? `${data.remaining} of ${data.total} codes unused` : "No codes generated yet"}
      </p>

      {codes ? (
        <div className="mt-4 space-y-3">
          <ul className="grid grid-cols-2 gap-2 rounded-md border border-border bg-background p-3 font-mono text-sm">
            {codes.map((code) => (
              <li key={code}>{code}</li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(codes.join("\n"));
                toast.success("Copied");
              }}
            >
              Copy all
            </Button>
            <Button variant="ghost" onClick={() => setCodes(null)}>
              I saved them
            </Button>
          </div>
        </div>
      ) : (
        <Button className="mt-4" variant="outline" disabled={busy} onClick={regenerate}>
          {data?.total ? "Generate new codes" : "Generate recovery codes"}
        </Button>
      )}
    </section>
  );
}
