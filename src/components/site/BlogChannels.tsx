import {
  siQuora,
  siReddit,
  siStackexchange,
  siFacebook,
  siGlassdoor,
} from "simple-icons";
import { useLocale } from "@/hooks/useLocale";
import { getCanonicalContact, getCanonicalSocialLinks } from "@/content/api";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/content";

/** LinkedIn was removed from simple-icons — reuse the known path. */
const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

type Channel = {
  key: string;
  label: string;
  href: string;
  path: string;
};

const COPY: Record<Locale, { intro: string }> = {
  en: {
    intro: "You can also read our technical articles on",
  },
  ar: {
    intro: "يمكنك أيضًا الإطلاع على مقالاتنا التقنية على",
  },
};

const LABELS: Record<Locale, Record<string, string>> = {
  en: {
    quora: "Quora",
    reddit: "Reddit",
    stackexchange: "Stack Exchange",
    facebook: "Facebook",
    glassdoor: "Glassdoor",
    linkedin: "LinkedIn",
  },
  ar: {
    quora: "كورا",
    reddit: "ريديت",
    stackexchange: "ستاك إكستشينج",
    facebook: "فيسبوك",
    glassdoor: "جلاسدور",
    linkedin: "لينكدإن",
  },
};

export function BlogChannels() {
  const { locale } = useLocale();
  const t = COPY[locale] ?? COPY.en;
  const labels = LABELS[locale] ?? LABELS.en;

  const facebook = getCanonicalSocialLinks().find((s) => s.platform === "facebook")?.url;
  const linkedin = getCanonicalSocialLinks().find((s) => s.platform === "linkedin")?.url;
  const name = getCanonicalContact().length ? "Ahmed Abdelwahab" : "Ahmed Abdelwahab";
  const enc = encodeURIComponent(name);

  const channels: Channel[] = [
    {
      key: "quora",
      label: labels.quora,
      href: `https://www.quora.com/search?q=${enc}`,
      path: siQuora.path,
    },
    {
      key: "reddit",
      label: labels.reddit,
      href: `https://www.reddit.com/search/?q=${enc}`,
      path: siReddit.path,
    },
    {
      key: "stackexchange",
      label: labels.stackexchange,
      href: `https://stackexchange.com/search?q=${enc}`,
      path: siStackexchange.path,
    },
    {
      key: "facebook",
      label: labels.facebook,
      href: facebook ?? `https://www.facebook.com/search/top/?q=${enc}`,
      path: siFacebook.path,
    },
    {
      key: "glassdoor",
      label: labels.glassdoor,
      href: `https://www.glassdoor.com/search.htm?keyword=${enc}`,
      path: siGlassdoor.path,
    },
    {
      key: "linkedin",
      label: labels.linkedin,
      href: linkedin ?? `https://www.linkedin.com/search/results/all/?keywords=${enc}`,
      path: LINKEDIN_PATH,
    },
  ];

  return (
    <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-3">
      <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">{t.intro}</p>
      <ul className="flex flex-wrap items-center gap-2.5">
        {channels.map((c) => (
          <li key={c.key}>
            <a
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-surface/40 px-3 py-1.5",
                "transition-all hover:border-[#E19F65]/70 hover:bg-[#E19F65]/10",
              )}
              aria-label={c.label}
            >
              <svg
                role="img"
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-4 shrink-0"
                style={{ color: "#E19F65" }}
                fill="currentColor"
              >
                <path d={c.path} />
              </svg>
              <span className="text-xs font-medium" style={{ color: "#E19F65" }}>
                {c.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
