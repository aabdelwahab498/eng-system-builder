import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "ng.admin.visible";

/**
 * The Admin entry point is hidden for every visitor.
 * It becomes visible only when:
 *  - the current visitor is signed in (their own session), or
 *  - the secret reveal is enabled on this device.
 *
 * Secret reveal (owner only):
 *  - open any page with `?admin=1` in the URL, or
 *  - press Ctrl + Shift + A  (Cmd + Shift + A on Mac)
 * Hide again with `?admin=0` or the same shortcut.
 */
export function useHiddenAdmin() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const flag = params.get("admin");
    if (flag === "1") localStorage.setItem(STORAGE_KEY, "1");
    if (flag === "0") localStorage.removeItem(STORAGE_KEY);

    const sync = () => setRevealed(localStorage.getItem(STORAGE_KEY) === "1");
    sync();

    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) setRevealed(true);
    });

    const onKey = (e: KeyboardEvent) => {
      // e.code ("KeyA") is layout-independent, so the shortcut still fires
      // when an Arabic keyboard layout is active (e.key would be "ش").
      const isA = e.code === "KeyA" || e.key.toLowerCase() === "a";
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && isA) {
        e.preventDefault();
        const next = localStorage.getItem(STORAGE_KEY) === "1" ? null : "1";
        if (next) localStorage.setItem(STORAGE_KEY, next);
        else localStorage.removeItem(STORAGE_KEY);
        sync();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      active = false;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return revealed;
}
