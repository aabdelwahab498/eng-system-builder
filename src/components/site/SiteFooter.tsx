import { Link } from "@tanstack/react-router";
import { ecosystem, nav, site, socials } from "@/data/site";
import { Container } from "./Section";

export function SiteFooter() {
  const links = nav.filter((n) => n.label !== "About");
  const activeSocials = socials.filter((s) => s.href);

  return (
    <footer className="hairline py-14 sm:py-20">
      <Container className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-lg font-semibold">{site.name}</p>
          <p className="mt-2 text-sm text-muted-foreground">{site.role}</p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">{site.statement}</p>
        </div>

        <nav aria-label="Footer">
          <p className="eyebrow">Navigate</p>
          <ul className="mt-4 space-y-3">
            {links.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow">Ecosystem</p>
          <ul className="mt-4 space-y-3">
            <li>
              <a
                href={ecosystem.portfolio.url}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {ecosystem.portfolio.label}
              </a>
            </li>
            <li>
              <a
                href={ecosystem.factoryApi.url}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {ecosystem.factoryApi.label}
              </a>
            </li>
          </ul>
          {activeSocials.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-4">
              {activeSocials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>

      <Container className="mt-12">
        <p className="hairline pt-6 font-mono text-xs text-muted-foreground">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
