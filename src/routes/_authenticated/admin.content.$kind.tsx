import { Outlet, createFileRoute, notFound } from "@tanstack/react-router";
import { CONTENT_KINDS, type ContentKind } from "@/lib/cms/types";

export const Route = createFileRoute("/_authenticated/admin/content/$kind")({
  beforeLoad: ({ params }) => {
    if (!CONTENT_KINDS.includes(params.kind as ContentKind)) throw notFound();
  },
  component: () => <Outlet />,
});
