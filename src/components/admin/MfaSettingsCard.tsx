import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Enrolling = { factorId: string; qr: string; secret: string } | null;

/** Enrol / remove a TOTP authenticator factor on the signed-in admin account. */
export function MfaSettingsCard() {
  const qc = useQueryClient();
  const [enrolling, setEnrolling] = useState<Enrolling>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const { data: factors } = useQuery({
    queryKey: ["admin", "mfa-factors"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;
      return data?.totp ?? [];
    },
  });

  const verified = (factors ?? []).filter((f) => f.status === "verified");

  async function startEnroll() {
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: `Authenticator ${new Date().toISOString().slice(0, 10)}`,
      });
      if (error) throw error;
      setEnrolling({
        factorId: data.id,
        qr: data.totp.qr_code,
        secret: data.totp.secret,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start enrollment");
    } finally {
      setBusy(false);
    }
  }

  async function confirmEnroll(event: React.FormEvent) {
    event.preventDefault();
    if (!enrolling) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: enrolling.factorId,
        code: code.trim(),
      });
      if (error) throw error;
      toast.success("Authenticator app enabled.");
      setEnrolling(null);
      setCode("");
      qc.invalidateQueries({ queryKey: ["admin", "mfa-factors"] });
      qc.invalidateQueries({ queryKey: ["admin", "is-admin"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setBusy(false);
    }
  }

  async function remove(factorId: string) {
    setBusy(true);
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId });
      if (error) throw error;
      toast.success("Authenticator removed.");
      qc.invalidateQueries({ queryKey: ["admin", "mfa-factors"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not remove factor");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-lg border border-border bg-surface/60 p-5">
      <p className="eyebrow">Security</p>
      <h2 className="mt-2 font-display text-lg font-semibold text-foreground">
        Two-factor authentication
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Protect admin access with an authenticator app. Once enabled, admin tools stay locked
        until the code is verified on every new sign-in.
      </p>

      {verified.length > 0 ? (
        <div className="mt-4 space-y-2">
          {verified.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm"
            >
              <span className="truncate">{f.friendly_name || "Authenticator app"}</span>
              <Button variant="outline" size="sm" disabled={busy} onClick={() => remove(f.id)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      ) : enrolling ? (
        <form onSubmit={confirmEnroll} className="mt-4 space-y-4">
          <div
            className="w-40 rounded-md bg-white p-2"
            // Supabase returns an SVG QR code for the enrollment URI.
            dangerouslySetInnerHTML={{ __html: enrolling.qr }}
          />
          <p className="break-all font-mono text-xs text-muted-foreground">
            Manual key: {enrolling.secret}
          </p>
          <div className="space-y-2">
            <Label htmlFor="enroll-code">Enter the 6-digit code</Label>
            <Input
              id="enroll-code"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={busy || code.length < 6}>
              Confirm
            </Button>
            <Button type="button" variant="ghost" onClick={() => setEnrolling(null)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button className="mt-4" disabled={busy} onClick={startEnroll}>
          Enable authenticator app
        </Button>
      )}
    </section>
  );
}
