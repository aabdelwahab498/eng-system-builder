import { Link, useRouterState } from "@tanstack/react-router";
import { tabsForPath } from "@/lib/admin/nav";
import { cn } from "@/lib/utils";

/** Segmented navigation for the active admin section. Renders nothing on the dashboard. */
export function AdminTabs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const tabs = tabsForPath(pathname);
  if (tabs.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap gap-1 rounded-lg border border-border bg-surface/40 p-1">
      {tabs.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.href}
            to={tab.href}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
              active && "bg-background text-foreground shadow-sm",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
