import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminListAuditLog } from "@/lib/security/audit.functions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/admin/audit")({
  component: AuditPage,
});

function AuditPage() {
  const list = useServerFn(adminListAuditLog);
  const { data = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["admin", "audit-log"],
    queryFn: () => list({ data: { limit: 200 } }),
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Security</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-foreground">Audit log</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Server-side record of every admin action: who performed it, when, what changed and from
            which address. Entries are written by the server and cannot be edited or deleted from
            the app.
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? "Refreshing…" : "Refresh"}
        </Button>
      </header>

      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">When</TableHead>
              <TableHead>Who</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="whitespace-nowrap">IP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-sm text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-sm text-muted-foreground">
                  No admin actions recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              data.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm">{entry.actorEmail ?? entry.actorId ?? "—"}</TableCell>
                  <TableCell className="font-mono text-xs">{entry.action}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {entry.entityId ?? entry.entity ?? "—"}
                  </TableCell>
                  <TableCell className="max-w-[22rem] truncate font-mono text-xs text-muted-foreground">
                    {Object.keys(entry.details).length ? JSON.stringify(entry.details) : "—"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {entry.ip ?? "—"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
