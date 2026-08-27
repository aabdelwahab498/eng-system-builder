import { Link, Outlet, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ExternalLink, LogOut, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { adminIsAdmin, adminOverview } from "@/lib/cms/admin.functions";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ADMIN_NAV, type AdminNavItem } from "@/lib/admin/nav";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { clients, serviceRequests, subscribers } from "@/lib/admin/crm";
import { paymentSubmissions } from "@/lib/payments/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Studio — Control Center" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function useBadgeCounts() {
  const overview = useServerFn(adminOverview);
  const { data: content } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: () => overview(),
  });
  const { data: local } = useQuery({
    queryKey: ["admin", "local-counts"],
    queryFn: async () => ({
      requests: (await serviceRequests.list()).filter((r) => r.status === "new").length,
      payments: (await paymentSubmissions.list()).filter((p) => p.status === "pending_review")
        .length,
      clients: (await clients.list()).length,
      subscribers: (await subscribers.list()).length,
    }),
  });

  return (item: AdminNavItem): number | null => {
    if (item.kind) return content?.byKind?.[item.kind]?.total ?? null;
    if (item.counter) return local?.[item.counter] ?? null;
    return null;
  };
}

function NavList({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const badgeFor = useBadgeCounts();

  return (
    <nav className="space-y-1">
      {ADMIN_NAV.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin" || pathname === "/admin/"
            : pathname.startsWith(item.href) || item.match.some((m) => pathname.startsWith(m));
        const badge = badgeFor(item);
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            to={item.href}
            onClick={onNavigate}
            title={item.label}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground",
              active && "bg-surface text-foreground",
              collapsed && "justify-center",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {!collapsed && (
              <>
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {badge !== null && badge > 0 && (
                  <span className="rounded-full border border-border px-1.5 font-mono text-[10px] text-muted-foreground">
                    {badge}
                  </span>
                )}
              </>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const checkAdmin = useServerFn(adminIsAdmin);
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "is-admin"],
    queryFn: () => checkAdmin(),
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (isLoading) {
    return <div className="p-10 text-sm text-muted-foreground">Checking access…</div>;
  }

  if (!data?.isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="eyebrow">Restricted</p>
        <h1 className="mt-3 font-display text-2xl font-semibold text-foreground">
          Admin access required
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Your account is signed in but has no admin role. Ask the site owner to grant it.
        </p>
        <Button variant="outline" className="mt-6" onClick={signOut}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1500px] gap-6 px-4 py-8 lg:px-6">
      <aside className={cn("hidden shrink-0 lg:block", collapsed ? "w-14" : "w-60")}>
        <div className="sticky top-24 space-y-6">
          <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
            {!collapsed && (
              <Link to="/admin" className="block min-w-0 flex-1">
                <p className="eyebrow">Admin studio</p>
                <p className="mt-1 truncate font-display text-lg font-semibold text-foreground">
                  Control center
                </p>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setCollapsed((v) => !v)}
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>
          </div>

          <NavList collapsed={collapsed} />

          <div className={cn("space-y-2 border-t border-border pt-4", collapsed && "text-center")}>
            <Link
              to="/"
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {!collapsed && "View site"}
            </Link>
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
              {!collapsed && "Sign out"}
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-6 lg:hidden">
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Menu className="h-4 w-4" />
                Admin menu
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 overflow-y-auto">
              <p className="eyebrow mb-4">Admin studio</p>
              <NavList onNavigate={() => setDrawerOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
        <AdminTabs />
        <Outlet />
      </div>
    </div>
  );
}
