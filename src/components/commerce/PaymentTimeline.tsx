import { ArrowDown } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { getPaymentSteps } from "@/content/api";
import { pickOrEn } from "@/content/schema";

/** Visual explanation of the project payment structure. */
export function PaymentTimeline() {
  const { locale } = useLocale();
  const steps = getPaymentSteps();

  return (
    <ol className="grid gap-4 md:grid-cols-3">
      {steps.map((step, i) => (
        <li
          key={step.n}
          className="relative rounded-lg border border-border bg-surface/60 p-5 transition-colors hover:border-primary/40"
        >
          <span className="font-mono text-xs text-primary">{step.n}</span>
          <p className="mt-2 font-display text-base font-medium text-foreground">
            {pickOrEn(step.title, locale)}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {pickOrEn(step.body, locale)}
          </p>
          {i < steps.length - 1 && (
            <ArrowDown
              className="absolute -bottom-3.5 start-5 size-4 text-primary/60 md:hidden"
              aria-hidden
            />
          )}
        </li>
      ))}
    </ol>
  );
}
