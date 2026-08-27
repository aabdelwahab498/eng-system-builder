import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { TextReveal } from "./Motion";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12", className)}>
      {children}
    </div>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className,
  bordered = true,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
  bordered?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-[var(--space-section-py)] sm:py-[var(--space-section-py-lg)]",
        bordered && "hairline",
        className,
      )}
    >
      <Container>
        {(eyebrow || title || subtitle) && (
          <Reveal className="max-w-3xl">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && (
              <TextReveal
                text={title}
                className="mt-4 text-3xl leading-tight font-semibold sm:text-4xl lg:text-5xl"
              />
            )}
            {subtitle && (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {subtitle}
              </p>
            )}
          </Reveal>
        )}
        {children && <div className={cn(title || eyebrow ? "mt-12 sm:mt-16" : "")}>{children}</div>}
      </Container>
    </section>
  );
}
