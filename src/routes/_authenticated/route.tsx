import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getStoredAdminToken } from "@/content/admin-auth-api";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const adminToken = getStoredAdminToken();
    if (adminToken) {
      return { user: { token: adminToken, isAdmin: true } };
    }
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: () => <Outlet />,
});
