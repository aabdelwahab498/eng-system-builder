import { Outlet, createFileRoute, notFound, useRouterState } from "@tanstack/react-router";
import { isLocale } from "@/types/content";

export const Route = createFileRoute("/$locale")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale)) throw notFound();
  },
  component: LocaleLayout,
});

function LocaleLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div key={pathname} className="page-enter">
      <Outlet />
    </div>
  );
}
