import { Link, Outlet, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { adminIsAdmin } from "@/lib/cms/admin.functions";
import { Button } from "@/components/ui/button";
import { KIND_LABELS, type ContentKind } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Studio — Content Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminLayout,
});

const GROUPS: { title: string; kinds: ContentKind[] }[] = [
  { title: "Profile", kinds: ["profile", "experience", "education", "skill_group"] },
  { title: "Work", kinds: ["project", "product", "service"] },
  { title: "Publishing", kinds: ["article", "announcement", "gallery_item"] },
  { title: "Growth", kinds: ["social_draft", "social_campaign", "marketing_campaign", "payment_method"] },
  { title: "Site", kinds: ["seo", "cv_settings"] },
];

function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const checkAdmin = useServerFn(adminIsAdmin);

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
    <div className="mx-auto flex w-full max-w-[1400px] gap-6 px-4 py-8 lg:px-6">
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-24 space-y-6">
          <Link to="/admin" className="block">
            <p className="eyebrow">Studio</p>
            <p className="mt-1 font-display text-lg font-semibold text-foreground">Content admin</p>
          </Link>

          <nav className="space-y-5">
            {GROUPS.map((group) => (
              <div key={group.title} className="space-y-1">
                <p className="px-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
                  {group.title}
                </p>
                {group.kinds.map((kind) => {
                  const href = `/admin/content/${kind}`;
                  return (
                    <Link
                      key={kind}
                      to="/admin/content/$kind"
                      params={{ kind }}
                      className={cn(
                        "block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground",
                        pathname.startsWith(href) && "bg-surface text-foreground",
                      )}
                    >
                      {KIND_LABELS[kind]}
                    </Link>
                  );
                })}
              </div>
            ))}
            <div className="space-y-1">
              <p className="px-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
                Assets
              </p>
              <Link
                to="/admin/media"
                className={cn(
                  "block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground",
                  pathname.startsWith("/admin/media") && "bg-surface text-foreground",
                )}
              >
                Media
              </Link>
              <Link
                to="/admin/payments"
                className={cn(
                  "block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground",
                  pathname.startsWith("/admin/payments") && "bg-surface text-foreground",
                )}
              >
                Payments
              </Link>
            </div>
          </nav>

          <div className="space-y-2 border-t border-border pt-4">
            <Link to="/" className="block text-xs text-muted-foreground hover:text-foreground">
              View site
            </Link>
            <button
              onClick={signOut}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-6 flex flex-wrap gap-2 lg:hidden">
          {GROUPS.flatMap((g) => g.kinds).map((kind) => (
            <Link
              key={kind}
              to="/admin/content/$kind"
              params={{ kind }}
              className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground"
            >
              {KIND_LABELS[kind]}
            </Link>
          ))}
          <Link to="/admin/media" className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">
            Media
          </Link>
          <Link to="/admin/payments" className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">
            Payments
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
