import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Container } from "./Section";
import { Reveal } from "./Reveal";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/useLocale";

export function ContactCta() {
  const { locale, t } = useLocale();

  return (
    <section className="hairline py-20 sm:py-28">
      <Container>
        <Reveal className="rounded-lg border border-border bg-surface/60 p-8 sm:p-14">
          <p className="eyebrow">{t.ui.contact}</p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl leading-tight font-semibold text-balance sm:text-4xl">
            {t.profile.statement}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t.contact.availability}
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link to="/$locale/contact" params={{ locale }}>
                {t.ui.letsBuild}
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
