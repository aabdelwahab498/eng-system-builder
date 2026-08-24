import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { activityLog } from "@/lib/admin/crm";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/admin/activity")({
  component: ActivityPage,
});

function ActivityPage() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "activity"],
    queryFn: () => activityLog.list(),
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">System</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-foreground">Activity log</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Local trail of admin actions taken in this browser. A backend audit log will replace it.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={async () => {
            for (const entry of data) await activityLog.remove(entry.id);
            qc.invalidateQueries({ queryKey: ["admin", "activity"] });
            toast.success("Activity cleared");
          }}
          disabled={data.length === 0}
        >
          Clear log
        </Button>
      </header>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : data.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No activity recorded yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium text-foreground">{entry.action}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{entry.entity}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{entry.actor}</TableCell>
                  <TableCell className="font-mono text-xs uppercase text-muted-foreground">
                    {entry.status}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
