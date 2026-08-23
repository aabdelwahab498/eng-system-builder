import { Link } from "@tanstack/react-router";
import { Container } from "./Section";
import { SocialIcon, SOCIAL_LABEL, type SocialPlatform } from "./SocialIcon";
import { useLocale } from "@/hooks/useLocale";
import { getCanonicalContact, getCanonicalSocialLinks } from "@/content/api";

export function SiteFooter() {
  const { locale, t } = useLocale();

  const groups = [
    {
      title: t.ui.work,
      links: [
        { label: t.ui.featuredProjects, path: "/projects" },
        { label: t.ui.products, path: "/products" },
      ],
    },
    {
      title: t.ui.profile,
      links: [
        { label: t.ui.about, path: "/about" },
        { label: t.ui.skills, path: "/skills" },
        { label: t.ui.services, path: "/services" },
        { label: t.ui.cv, path: "/cv" },
      ],
    },
  ];

  const canonicalEmail = getCanonicalContact().find((c) => c.kind === "email")?.value;
  const channels = [
    { label: "Email", href: canonicalEmail ? `mailto:${canonicalEmail}` : "" },
    ...getCanonicalSocialLinks().map((l) => ({
      label: l.platform === "github" ? "GitHub" : l.platform === "linkedin" ? "LinkedIn" : l.platform,
      href: l.url,
    })),
    { label: "WhatsApp", href: t.contact.whatsapp },
    { label: "X", href: t.contact.x },
  ].filter((c) => c.href);

  return (
    <footer className="hairline py-14 sm:py-20">
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
            channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {c.label}
              </a>
            ))
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
