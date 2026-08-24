import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Languages, Menu, X } from "lucide-react";
import { Container } from "./Section";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/useLocale";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { locale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const otherLocale = locale === "en" ? "ar" : "en";
  const rest = pathname.replace(/^\/(en|ar)/, "");
  const switchHref = `/${otherLocale}${rest}`;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
        <Link
          to="/$locale"
          params={{ locale }}
          className="flex items-center gap-3"
          aria-label={t.profile.displayName}
        >
          <span className="grid size-8 place-items-center rounded-sm border border-border-strong font-mono text-xs text-primary">
            A
          </span>
          <span className="font-display text-sm font-medium tracking-tight sm:text-base">
            {t.profile.displayName}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-0.5 xl:flex">
          {t.nav.map((item) =>
            item.path === "/gallery" ? (
              <div key={item.path} className="group relative">
                <Link
                  to="/$locale/gallery"
                  params={{ locale }}
                  className="flex items-center gap-1 rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  activeProps={{ className: "text-foreground" }}
                >
                  {item.label}
                  <ChevronDown className="size-3.5" aria-hidden />
                </Link>
                <div className="invisible absolute start-0 top-full z-50 min-w-56 translate-y-1 rounded-md border border-border bg-background/95 p-2 opacity-0 shadow-lg backdrop-blur-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <p className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {t.ui.ourWorks}
                  </p>
                  <Link
                    to="/$locale/projects"
                    params={{ locale }}
                    className="block rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {t.ui.viewAllProjects}
                  </Link>
                  {t.projects.map((p) => (
                    <Link
                      key={p.slug}
                      to="/$locale/projects/$slug"
                      params={{ locale, slug: p.slug }}
                      className="block rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      {p.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.path}
                to={`/$locale${item.path}` as "/$locale/projects"}
                params={{ locale }}
                className="rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                activeProps={{ className: "text-foreground" }}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>


        <div className="flex items-center gap-2">
          <a
            href={switchHref}
            className="hidden h-10 items-center gap-2 rounded-sm border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline-flex"
          >
            <Languages className="size-4" aria-hidden />
            {t.ui.switchLanguage}
          </a>
          <ThemeToggle label={t.ui.toggleTheme} />
          <Button asChild size="sm" className="hidden lg:inline-flex">
            <Link to="/$locale/contact" params={{ locale }}>
              {t.ui.letsBuild}
            </Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.ui.closeMenu : t.ui.openMenu}
            className="grid size-10 place-items-center rounded-sm border border-border text-foreground transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none xl:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      {open && (
        <div id="mobile-menu" className="border-t border-border bg-background/95 backdrop-blur-xl xl:hidden">
          <Container className="flex flex-col py-4">
            {t.nav.map((item) => (
              <Link
                key={item.path}
                to={`/$locale${item.path}` as "/$locale/projects"}
                params={{ locale }}
                className="border-b border-border/60 py-4 font-display text-lg text-muted-foreground transition-colors last:border-0 hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={switchHref}
              className="border-t border-border/60 py-4 font-display text-lg text-muted-foreground hover:text-foreground"
            >
              {t.ui.switchLanguage}
            </a>
            <Button asChild className="mt-5 w-full">
              <Link to="/$locale/contact" params={{ locale }}>
                {t.ui.letsBuild}
              </Link>
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}
