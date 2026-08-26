import { Link } from "@tanstack/react-router";
import { Container } from "./Section";
import { TechMarquee } from "./TechMarquee";
import { useLocale } from "@/hooks/useLocale";
import { useHiddenAdmin } from "@/hooks/useHiddenAdmin";

export function SiteFooter() {
  const { t } = useLocale();
  const adminVisible = useHiddenAdmin();

  return (
    <footer className="hairline py-14 sm:py-20">
      <Container className="mb-10">
        <TechMarquee label={t.ui.engineeringStack} />
      </Container>

      <Container className="flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <p>© {new Date().getFullYear()} {t.profile.displayName}</p>
          {adminVisible && (
            <>
              <span aria-hidden className="opacity-30">·</span>
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 font-mono transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Admin Studio"
              >
                <span className="copper-icon">◆</span>
                Admin Studio
              </Link>
            </>
          )}
        </div>
        <p className="font-mono">nextnext-gen.com</p>
      </Container>
    </footer>
  );
}
