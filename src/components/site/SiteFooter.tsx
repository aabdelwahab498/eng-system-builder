import { Link } from "@tanstack/react-router";
import { Container } from "./Section";
import { SocialIcon, SOCIAL_LABEL, type SocialPlatform } from "./SocialIcon";
import { TechMarquee } from "./TechMarquee";
import { useLocale } from "@/hooks/useLocale";
import { getCanonicalContact, getCanonicalSocialLinks } from "@/content/api";

export function SiteFooter() {
  const { locale, t } = useLocale();

  const groups = [
    {
      title: t.ui.work,
      links: [
        { label: t.ui.featuredProjects, path: "/projects" },
        { label: t.ui.services, path: "/services" },
        { label: t.ui.writing, path: "/blog" },
        { label: t.ui.courses, path: "/courses" },
        { label: t.ui.gallery, path: "/gallery" },
      ],
    },
    {
      title: t.ui.profile,
      links: [
        { label: t.ui.about, path: "/about" },
        { label: t.ui.cv, path: "/cv" },
        { label: t.ui.contact, path: "/contact" },
      ],
    },
  ];


  const canonicalEmail = getCanonicalContact().find((c) => c.kind === "email")?.value;
  const channels = [
    { label: "Email", href: canonicalEmail ? `mailto:${canonicalEmail}` : "", platform: "other" as SocialPlatform },
    ...getCanonicalSocialLinks().map((l) => ({
      label: SOCIAL_LABEL[l.platform as SocialPlatform] ?? l.platform,
      href: l.url,
      platform: l.platform as SocialPlatform,
    })),
  ].filter((c) => c.href);

  return (
    <footer className="hairline py-14 sm:py-20">
      <Container className="mb-14">
        <TechMarquee label={t.ui.engineeringStack} />
      </Container>

      <Container className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-lg font-semibold">{t.profile.displayName}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t.profile.positioning}</p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {t.ui.ecosystemNote}
          </p>
        </div>

        {groups.map((group) => (
          <nav key={group.title} aria-label={group.title} className="flex flex-col gap-3">
            <p className="eyebrow">{group.title}</p>
            {group.links.map((link) => (
              <Link
                key={link.path}
                to={`/$locale${link.path}` as "/$locale/projects"}
                params={{ locale }}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ))}

        <div className="flex flex-col gap-3">
          <p className="eyebrow">{t.ui.connect}</p>
          {channels.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {channels.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    target={c.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noreferrer noopener"
                    onClick={(e) => {
                      if (c.href.startsWith("mailto:")) return;
                      e.preventDefault();
                      window.open(c.href, "_blank", "noopener,noreferrer");
                    }}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {c.platform === "other" ? (
                      <span className="font-mono text-xs copper-icon">@</span>
                    ) : (
                      <SocialIcon platform={c.platform} className="size-4 copper-icon" />
                    )}
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <Link
              to="/$locale/contact"
              params={{ locale }}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.ui.contact}
            </Link>
          )}
        </div>
      </Container>

      <Container className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {t.profile.displayName}</p>
        <p className="font-mono">nextnext-gen.com</p>
      </Container>
    </footer>
  );
}
