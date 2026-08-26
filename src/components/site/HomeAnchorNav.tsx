import { useEffect, useState } from "react";
import { Container } from "./Section";
import { useLocale } from "@/hooks/useLocale";
import { cn } from "@/lib/utils";

export const HOME_SECTIONS = ["hero", "skills", "what-i-build"] as const;
type SectionId = (typeof HOME_SECTIONS)[number];

/**
 * Sticky in-page navigation for the homepage sections.
 * Sits directly under the site header and highlights the section in view.
 */
export function HomeAnchorNav() {
  const { t } = useLocale();
  const [active, setActive] = useState<SectionId>("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id as SectionId);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.1, 0.5, 1] },
    );
    HOME_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const labels: Record<SectionId, string> = {
    hero: t.ui.home,
    skills: t.ui.skills,
    "what-i-build": t.ui.whatIBuild,
  };

  return (
    <nav
      aria-label={t.ui.whatIBuild}
      className="sticky top-16 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl sm:top-20"
    >
      <Container className="flex items-center gap-1 overflow-x-auto py-2">
        {HOME_SECTIONS.map((id) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={active === id ? "true" : undefined}
            className={cn(
              "digital-green rounded-sm px-3 py-1.5 text-sm whitespace-nowrap transition-all duration-200 hover:brightness-125 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              active === id && "brightness-150 underline underline-offset-8",
            )}
          >
            {labels[id]}
          </a>
        ))}
      </Container>
    </nav>
  );
}
