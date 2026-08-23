import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  adminDeleteMedia,
  adminListMedia,
  adminRegisterMedia,
  adminUpdateMedia,
} from "@/lib/cms/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/admin/fields";
import { slugify } from "@/lib/cms/slug";

export const Route = createFileRoute("/_authenticated/admin/media")({
  component: MediaLibrary,
});

function MediaLibrary() {
  const queryClient = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const list = useServerFn(adminListMedia);
  const register = useServerFn(adminRegisterMedia);
  const update = useServerFn(adminUpdateMedia);
  const remove = useServerFn(adminDeleteMedia);

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["admin", "media"],
    queryFn: () => list(),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "media"] });

  const updateMutation = useMutation({
    mutationFn: (vars: { id: string; altEn: string; altAr: string }) => update({ data: vars }),
    onSuccess: () => {
      toast.success("Alt text saved");
      invalidate();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (vars: { id: string; storagePath: string }) => remove({ data: vars }),
    onSuccess: () => {
      toast.success("File deleted");
      invalidate();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Delete failed"),
  });

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
        const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "asset";
        const path = `${new Date().getFullYear()}/${base}-${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from("media").upload(path, file, {
          contentType: file.type,
          upsert: false,
        });
        if (error) throw error;
        await register({
          data: {
            filename: file.name,
            storagePath: path,
            mimeType: file.type,
            sizeBytes: file.size,
          },
        });
      }
      toast.success("Upload complete");
      invalidate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Assets</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-foreground">Media library</h1>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            Uploaded files are stored privately and served through a controlled public URL. Paste
            that URL into any content field.
          </p>
        </div>
        <div>
          <input
            ref={fileInput}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
          <Button onClick={() => fileInput.current?.click()} disabled={uploading}>
            {uploading ? "Uploading…" : "Upload files"}
          </Button>
        </div>
      </header>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : assets.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-strong p-10 text-center text-sm text-muted-foreground">
          No files yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {assets.map((asset) => (
            <div key={asset.id} className="space-y-3 rounded-lg border border-border p-3">
              <img
                src={asset.publicUrl}
                alt={asset.altEn ?? asset.filename}
                loading="lazy"
                className="aspect-video w-full rounded-md border border-border object-cover"
              />
              <p className="truncate font-mono text-[11px] text-muted-foreground">{asset.publicUrl}</p>
              <Field label="Alt text (EN)">
                <Input
                  defaultValue={asset.altEn ?? ""}
                  onBlur={(e) =>
                    updateMutation.mutate({
                      id: asset.id,
                      altEn: e.target.value,
                      altAr: asset.altAr ?? "",
                    })
                  }
                />
              </Field>
              <Field label="Alt text (AR)">
                <Input
                  dir="rtl"
                  defaultValue={asset.altAr ?? ""}
                  onBlur={(e) =>
                    updateMutation.mutate({
                      id: asset.id,
                      altEn: asset.altEn ?? "",
                      altAr: e.target.value,
                    })
                  }
                />
              </Field>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(asset.publicUrl);
                    toast.success("URL copied");
                  }}
                >
                  Copy URL
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground"
                  onClick={() => {
                    if (confirm(`Delete ${asset.filename}?`)) {
                      deleteMutation.mutate({ id: asset.id, storagePath: asset.storagePath });
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
