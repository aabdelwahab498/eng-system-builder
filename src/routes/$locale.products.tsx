import { createFileRoute, redirect } from "@tanstack/react-router";
import type { Locale } from "@/types/content";

/** Products is no longer a primary destination — old URLs point at the work index. */
export const Route = createFileRoute("/$locale/products")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/$locale/projects", params: { locale: params.locale as Locale } });
  },
  component: () => null,
});
