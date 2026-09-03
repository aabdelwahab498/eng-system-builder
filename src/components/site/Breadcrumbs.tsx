import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Container } from "./Section";
import { useLocale } from "@/hooks/useLocale";

export type Crumb = { name: string; path: string };

/** Visible breadcrumb trail. `path` is locale-less, e.g. "" | "/projects". */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const { locale, t } = useLocale();

  return (
    <nav aria-label={t.ui.breadcrumb} className="pt-8">
      <Container>
        <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
          {trail.map((crumb, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={crumb.path || "root"} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="size-3 rtl:rotate-180" aria-hidden />}
                {last ? (
                  <span aria-current="page" className="text-foreground">
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    to={`/$locale${crumb.path}` as "/$locale/projects"}
                    params={{ locale }}
                    className="inline-flex min-h-11 items-center transition-colors hover:text-foreground sm:min-h-0"
                  >
                    {crumb.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
}
