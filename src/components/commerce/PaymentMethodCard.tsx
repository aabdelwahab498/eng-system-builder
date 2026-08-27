import { ExternalLink, ShieldAlert } from "lucide-react";
import type { PaymentMethod } from "@/content/canonical/commerce";
import { CopyField } from "./CopyField";
import { useLocale } from "@/hooks/useLocale";
import { pickOrEn } from "@/content/schema";
import { cn } from "@/lib/utils";

const copy = {
  en: {
    manual: "Manual Bank / Wallet Transfer",
    verify: "Payment verification is completed after receiving the payment proof.",
    open: "Open InstaPay",
    copyNumber: "Copy Number",
    copy: "Copy",
    copied: "Copied",
    accountHolder: "Account Holder",
    accountNumber: "Account Number",
    routingNumber: "Routing Number",
    bank: "Bank",
    bankAddress: "Bank Address",
    wallet: "Vodafone Cash number (payments only)",
    warning:
      "Only transfer funds using the official payment information displayed on this page. Always verify the recipient details before sending payment.",
    select: "Select",
    selected: "Selected",
  },
  ar: {
    manual: "تحويل بنكي/محفظة يدوي",
    verify: "يتم تأكيد الدفع بعد استلام إثبات الدفع ومراجعته.",
    open: "فتح إنستا باي",
    copyNumber: "نسخ الرقم",
    copy: "نسخ",
    copied: "تم النسخ",
    accountHolder: "اسم صاحب الحساب",
    accountNumber: "رقم الحساب",
    routingNumber: "رقم التوجيه",
    bank: "البنك",
    bankAddress: "عنوان البنك",
    wallet: "رقم فودافون كاش (للدفع فقط)",
    warning:
      "لا ترسل الأموال إلا باستخدام بيانات الدفع الرسمية الموضحة في هذه الصفحة، وتأكد دائمًا من بيانات المستلم قبل التحويل.",
    select: "اختيار",
    selected: "تم الاختيار",
  },
};

export function PaymentMethodCard({
  method,
  selected,
  onSelect,
}: {
  method: PaymentMethod;
  selected: boolean;
  onSelect: () => void;
}) {
  const { locale } = useLocale();
  const t = copy[locale] ?? copy.en;

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-lg border border-border bg-surface/60 p-5 transition-colors",
        selected && "border-primary/60 bg-primary/5",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg font-medium text-foreground">
            {pickOrEn(method.name, locale)}
          </p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {method.currency} · {t.manual}
          </p>
        </div>
        <button
          type="button"
          onClick={onSelect}
          className={cn(
            "shrink-0 rounded-sm border px-3 py-1.5 text-xs transition-colors",
            selected
              ? "border-primary/60 bg-primary/15 text-primary"
              : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground",
          )}
        >
          {selected ? t.selected : t.select}
        </button>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {pickOrEn(method.instructions, locale)}
      </p>

      <div className="mt-4 space-y-2">
        {method.paymentLink && (
          <a
            href={method.paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-primary/20"
          >
            <ExternalLink className="size-4 text-primary" aria-hidden />
            {t.open}
          </a>
        )}

        {method.phoneNumber && (
          <CopyField
            label={t.wallet}
            value={method.phoneNumber}
            copyLabel={t.copyNumber}
            copiedLabel={t.copied}
          />
        )}

        {method.bankName && (
          <div className="space-y-2">
            <div className="rounded-md border border-border bg-surface/60 px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {t.bank}
              </p>
              <p className="mt-1 text-sm text-foreground">{method.bankName}</p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {t.bankAddress}
              </p>
              <p dir="ltr" className="mt-1 text-sm text-muted-foreground">
                {method.bankAddress}
              </p>
            </div>
            {method.accountHolder && (
              <CopyField
                label={t.accountHolder}
                value={method.accountHolder}
                copyLabel={t.copy}
                copiedLabel={t.copied}
              />
            )}
            {method.accountNumber && (
              <CopyField
                label={t.accountNumber}
                value={method.accountNumber}
                copyLabel={t.copy}
                copiedLabel={t.copied}
              />
            )}
            {method.routingNumber && (
              <CopyField
                label={t.routingNumber}
                value={method.routingNumber}
                copyLabel={t.copy}
                copiedLabel={t.copied}
              />
            )}
            <p className="flex items-start gap-2 rounded-md border border-border bg-background/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
              <ShieldAlert className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              {t.warning}
            </p>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">{t.verify}</p>
    </div>
  );
}
