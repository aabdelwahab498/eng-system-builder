import { Container } from "./Section";
import { TechMarquee } from "./TechMarquee";
import { useLocale } from "@/hooks/useLocale";

export function SiteFooter() {
  const { t } = useLocale();

  return (
    <footer className="hairline py-14 sm:py-20">
      <Container className="mb-10">
        <TechMarquee label={t.ui.engineeringStack} />
      </Container>

      <Container className="flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <p>© {new Date().getFullYear()} {t.profile.displayName}</p>
        </div>
        <p className="font-mono">nextnext-gen.com</p>
      </Container>
    </footer>
  );
}
