import { useRef, useState } from "react";
import { FileText, Trash2, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/hooks/useLocale";

export type ProofFile = {
  file: File;
  previewUrl: string | null;
};

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ["image/png", "image/jpeg", "application/pdf"];

const copy = {
  en: {
    title: "Upload payment proof",
    hint: "Drag & drop your file here",
    or: "or",
    browse: "Browse Files",
    types: "PNG, JPG, JPEG or PDF · up to 10MB",
    ready: "Proof ready for submission",
    remove: "Remove",
    replace: "Replace",
    tooBig: "File is larger than 10MB.",
    badType: "Only PNG, JPG, JPEG or PDF files are accepted.",
    note: "Please upload a screenshot showing the successful payment. Your payment will be reviewed by the team.",
  },
  ar: {
    title: "ارفع إثبات الدفع",
    hint: "اسحب الملف وأفلته هنا",
    or: "أو",
    browse: "اختر ملفًا",
    types: "PNG أو JPG أو JPEG أو PDF · حتى 10 ميجابايت",
    ready: "الإثبات جاهز للإرسال",
    remove: "حذف",
    replace: "استبدال",
    tooBig: "حجم الملف أكبر من 10 ميجابايت.",
    badType: "الملفات المقبولة: PNG أو JPG أو JPEG أو PDF فقط.",
    note: "من فضلك ارفع صورة توضح نجاح عملية الدفع. سيقوم الفريق بمراجعة الدفعة.",
  },
};

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(2)} MB`;

export function PaymentProof({
  value,
  onChange,
}: {
  value: ProofFile | null;
  onChange: (proof: ProofFile | null) => void;
}) {
  const { locale } = useLocale();
  const t = copy[locale] ?? copy.en;
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  function accept(file: File | undefined) {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) return setError(t.badType);
    if (file.size > MAX_BYTES) return setError(t.tooBig);
    setError(null);
    if (value?.previewUrl) URL.revokeObjectURL(value.previewUrl);
    onChange({
      file,
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
    });
  }

  function clear() {
    if (value?.previewUrl) URL.revokeObjectURL(value.previewUrl);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-3">
      <p className="font-display text-base font-medium text-foreground">{t.title}</p>
      <p className="text-sm text-muted-foreground">{t.note}</p>

      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf"
        className="sr-only"
        onChange={(e) => accept(e.target.files?.[0])}
      />

      {!value ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            accept(e.dataTransfer.files?.[0]);
          }}
          className={cn(
            "flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-surface/40 px-6 py-10 text-center transition-colors",
            dragging && "border-primary bg-primary/5",
          )}
        >
          <UploadCloud className="size-7 text-primary" aria-hidden />
          <p className="text-sm text-muted-foreground">{t.hint}</p>
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {t.or}
          </p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-md border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
          >
            {t.browse}
          </button>
          <p className="text-xs text-muted-foreground">{t.types}</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-surface/60 p-4">
          <div className="flex flex-wrap items-start gap-4">
            {value.previewUrl ? (
              <img
                src={value.previewUrl}
                alt={value.file.name}
                className="h-24 w-24 rounded-md border border-border object-cover"
              />
            ) : (
              <div className="grid h-24 w-24 place-items-center rounded-md border border-border">
                <FileText className="size-7 text-muted-foreground" aria-hidden />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-foreground">{value.file.name}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {value.file.type || "file"} · {formatSize(value.file.size)}
              </p>
              <p className="mt-2 inline-flex rounded-sm border border-primary/40 bg-primary/10 px-2 py-1 font-mono text-[11px] text-primary">
                {t.ready}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="rounded-sm border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  {t.replace}
                </button>
                <button
                  type="button"
                  onClick={clear}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Trash2 className="size-3.5" aria-hidden />
                  {t.remove}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
