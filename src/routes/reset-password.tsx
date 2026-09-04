import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — Ahmed Abdelwahab Studio" },
      { name: "description", content: "Set a new password for the content studio account." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [linkError, setLinkError] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
        setChecking(false);
      }
    });

    async function bootstrap() {
      const url = new URL(window.location.href);
      const hash = new URLSearchParams(url.hash.replace(/^#/, ""));
      const code = url.searchParams.get("code");
      const tokenHash = url.searchParams.get("token_hash") ?? url.searchParams.get("token");
      const type = url.searchParams.get("type") ?? hash.get("type");
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");

      try {
        let recoverySessionEstablished = false;

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
          recoverySessionEstablished = true;
        } else if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          recoverySessionEstablished = true;
        } else if (tokenHash && type === "recovery") {
          const { error } = await supabase.auth.verifyOtp({
            type: "recovery",
            token_hash: tokenHash,
          });
          if (error) throw error;
          recoverySessionEstablished = true;
        }

        if (!recoverySessionEstablished) {
          const { data } = await supabase.auth.getSession();
          recoverySessionEstablished = Boolean(data.session) && type === "recovery";
        }

        if (!active) return;
        setReady(recoverySessionEstablished);
        setLinkError(recoverySessionEstablished ? "" : "This reset link is invalid or has expired.");
      } catch (error) {
        if (!active) return;
        setReady(false);
        setLinkError(
          error instanceof Error ? error.message : "This reset link is invalid or has expired.",
        );
      } finally {
        if (active) setChecking(false);
      }
    }

    void bootstrap();
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);


  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      await supabase.auth.signOut();
      toast.success("Password updated. Sign in with your new password.");
      navigate({ to: "/auth", search: { next: "/admin" }, replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update password");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface/60 p-6">
        <p className="eyebrow">Studio</p>
        <h1 className="mt-3 font-display text-2xl font-semibold text-foreground">
          Set a new password
        </h1>
        {checking ? (
          <p className="mt-4 text-sm text-muted-foreground">Checking your reset link…</p>
        ) : ready ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                placeholder="Enter a new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                placeholder="Repeat the new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                minLength={8}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Updating…" : "Update password"}
            </Button>
          </form>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            {linkError ||
              "This page only works from the reset link sent to your email. Request a new link from the sign-in page."}
          </p>
        )}

      </div>
    </div>
  );
}
