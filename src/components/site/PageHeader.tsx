import type { ReactNode } from "react";
import { Container } from "./Section";
import { Reveal } from "./Reveal";
import { Typewriter } from "./Motion";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  children,
  media,
  titleClassName,
  titleTypewriter,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  media?: ReactNode;
  titleClassName?: string;
  titleTypewriter?: boolean;
}) {
  return (
    <section className="relative overflow-hidden pt-16 pb-14 sm:pt-24 sm:pb-20">
      <div aria-hidden className="grid-backdrop pointer-events-none absolute inset-0" />
      <Container className="relative">
        <div className="flex flex-col gap-10 sm:gap-12 lg:flex-row lg:items-center lg:gap-12">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">{eyebrow}</p>
            {titleTypewriter ? (
              <Typewriter
                as="h1"
                text={title}
                speed={180}
                deleteSpeed={70}
                holdDelay={2600}
                startDelay={500}
                loop
                cursorClassName="copper-caret"
                className={cn(
                  "mt-5 font-display text-4xl leading-[1.05] font-semibold text-balance sm:text-6xl",
                  titleClassName,
                )}
              />
            ) : (
              <h1
                className={cn(
                  "mt-5 font-display text-4xl leading-[1.05] font-semibold text-balance sm:text-6xl",
                  titleClassName,
                )}
              >
                {title}
              </h1>
            )}
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
