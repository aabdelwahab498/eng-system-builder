import type { ReactNode } from "react";
import { Container } from "./Section";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  children,
  media,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  media?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pt-16 pb-14 sm:pt-24 sm:pb-20">
      <div aria-hidden className="grid-backdrop pointer-events-none absolute inset-0" />
      <Container className="relative">
        <div className="flex flex-col gap-10 sm:gap-12 lg:flex-row lg:items-center lg:gap-12">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-5 font-display text-4xl leading-[1.05] font-semibold text-balance sm:text-6xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{subtitle}</p>
            )}
            {children}
          </Reveal>
          {media && <Reveal className="shrink-0">{media}</Reveal>}
        </div>
      </Container>
    </section>
  );
}
