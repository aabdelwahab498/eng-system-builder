import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/certificates")({
  component: () => <Outlet />,
});
