import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Real Supabase MFA (AAL2) challenge. The elevated session is issued by the
 * auth server; the frontend only collects the TOTP code. Admin server
 * functions independently require AAL2, so this screen cannot be bypassed.
 */
export function MfaChallenge({ onVerified }: { onVerified: () => void }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  async function verify(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;
      const factor = (data?.totp ?? []).find((f) => f.status === "verified");
      if (!factor) throw new Error("No authenticator app is enrolled for this account.");
      const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
        factorId: factor.id,
        code: code.trim(),
      });
      if (verifyError) throw verifyError;
      toast.success("Two-factor verification complete.");
      onVerified();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <p className="eyebrow">Two-factor verification</p>
      <h1 className="mt-3 font-display text-2xl font-semibold text-foreground">
        Enter your authenticator code
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        This account requires a second factor before admin tools unlock.
      </p>
      <form onSubmit={verify} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mfa-code">6-digit code</Label>
          <Input
            id="mfa-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={busy || code.length < 6}>
          {busy ? "Verifying…" : "Verify"}
        </Button>
      </form>
    </div>
  );
}
