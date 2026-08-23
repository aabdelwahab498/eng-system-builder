import { createFileRoute } from "@tanstack/react-router";

/**
 * Serves media-library files. The storage bucket is private, so bytes are
 * streamed through this route. Only files registered in `media_assets` and not
 * archived are exposed — the bucket itself is never publicly listable.
 */
export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = (params as { _splat?: string })._splat ?? "";
        if (!path || path.includes("..")) return new Response("Not found", { status: 404 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: asset } = await supabaseAdmin
          .from("media_assets")
          .select("mime_type, archived")
          .eq("storage_path", path)
          .maybeSingle();
        if (!asset || (asset as { archived: boolean }).archived) {
          return new Response("Not found", { status: 404 });
        }

        const { data, error } = await supabaseAdmin.storage.from("media").download(path);
        if (error || !data) return new Response("Not found", { status: 404 });

        return new Response(await data.arrayBuffer(), {
          headers: {
            "content-type": (asset as { mime_type: string | null }).mime_type ?? "application/octet-stream",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
