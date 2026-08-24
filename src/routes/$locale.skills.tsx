import { createFileRoute, redirect } from "@tanstack/react-router";
import type { Locale } from "@/types/content";

/** Skills live inside the homepage "Engineering Stack" section. */
export const Route = createFileRoute("/$locale/skills")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/$locale",
      params: { locale: params.locale as Locale },
      hash: "engineering-stack",
    });
  },
  component: () => null,
});
