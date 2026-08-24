import { createFileRoute, redirect } from "@tanstack/react-router";

/** Friendly alias into the canonical CMS collection. */
export const Route = createFileRoute("/_authenticated/admin/linkedin")({
  beforeLoad: () => {
    throw redirect({ to: "/admin/content/$kind", params: { kind: "marketing_campaign" } });
  },
});
