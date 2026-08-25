import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, Languages, Menu, ShieldCheck, X } from "lucide-react";
import { Container } from "./Section";
import { ThemeToggle } from "./ThemeToggle";
import { NextGenMark } from "./NextGenMark";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/useLocale";
import { gallerySections } from "@/lib/gallery-sections";
import { cn } from "@/lib/utils";

const NAV_LINK =
  "digital-green rounded-sm px-3 py-2 text-sm transition-all duration-200 hover:brightness-125 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

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
          <NextGenMark />
          <span className="digital-green text-lg tracking-tight sm:text-xl">
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
                  className={cn(NAV_LINK, "flex items-center gap-1")}
                  activeProps={{ className: "brightness-150" }}
                >
                  {item.label}
                  <ChevronDown className="size-3.5" aria-hidden />
                </Link>
                <div className="invisible absolute start-0 top-full z-50 min-w-56 translate-y-1 rounded-md border border-border bg-background/95 p-2 opacity-0 shadow-lg backdrop-blur-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <p className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {t.ui.ourWorks}
                  </p>
                  {gallerySections.map((s) => (
                    <a
                      key={s.id}
                      href={`/${locale}/gallery#${s.id}`}
                      className="block rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      {s.label[locale]}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.path}
                to={`/$locale${item.path}` as "/$locale/projects"}
                params={{ locale }}
                className={NAV_LINK}
                activeProps={{ className: "brightness-150" }}
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
          <a
            href="/admin"
            className="hidden h-10 items-center gap-2 rounded-sm border border-[#C9974B]/50 px-3 font-mono text-xs uppercase tracking-wider text-[#C9974B] transition-colors hover:bg-[#C9974B]/10 sm:inline-flex"
          >
            <ShieldCheck className="size-4" aria-hidden />
            Admin
          </a>
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
              <div key={item.path} className="border-b border-border/60 last:border-0">
                <Link
                  to={`/$locale${item.path}` as "/$locale/projects"}
                  params={{ locale }}
                  className="digital-green block py-4 text-lg transition-all duration-200 hover:brightness-125"
                  activeProps={{ className: "brightness-150" }}
                >
                  {item.label}
                </Link>
                {item.path === "/gallery" && (
                  <div className="pb-4 ps-4">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {t.ui.ourWorks}
                    </p>
                    {gallerySections.map((s) => (
                      <a
                        key={s.id}
                        href={`/${locale}/gallery#${s.id}`}
                        className="mt-2 block text-sm text-muted-foreground hover:text-foreground"
                      >
                        {s.label[locale]}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <a
              href={switchHref}
              className="border-t border-border/60 py-4 font-display text-lg text-muted-foreground hover:text-foreground"
            >
              {t.ui.switchLanguage}
            </a>
            <a
              href="/admin"
              className="flex items-center gap-2 border-t border-border/60 py-4 font-display text-lg text-[#C9974B]"
            >
              <ShieldCheck className="size-5" aria-hidden />
              Admin Studio
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
