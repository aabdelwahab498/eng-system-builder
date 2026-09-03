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
  const apiVersion = useApiContentBootstrap(locale as Locale);
  return (
    <div key={`${pathname}:${apiVersion}`} className="page-enter">
      <Outlet />
    </div>
  );
}
