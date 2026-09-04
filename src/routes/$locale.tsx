import { Outlet, createFileRoute, notFound, useRouterState } from "@tanstack/react-router";
import { isLocale, type Locale } from "@/types/content";
import { useApiContentBootstrap } from "@/content/api-bootstrap";

export const Route = createFileRoute("/$locale")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale)) throw notFound();
  },
  component: LocaleLayout,
});

function LocaleLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { locale } = Route.useParams();
  // Warms API caches and re-renders this subtree when they resolve.
  // Must NOT be part of the key: remounting would wipe form/dialog state.
  useApiContentBootstrap(locale as Locale);
  return (
    <div key={pathname} className="page-enter">
      <Outlet />
    </div>
  );
}
