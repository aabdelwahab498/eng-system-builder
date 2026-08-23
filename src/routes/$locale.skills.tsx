import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { SkillsGrid } from "@/components/site/SkillsGrid";
import { ContactCta } from "@/components/site/ContactCta";
import { useLocale } from "@/hooks/useLocale";
import { buildHead, metaFor } from "@/lib/seo";
import type { Locale } from "@/types/content";

export const Route = createFileRoute("/$locale/skills")({
  head: ({ params }) => {
    const locale = params.locale as Locale;
    const m = metaFor(locale, "skills");
    return buildHead({ locale, path: "/skills", title: m.title, description: m.description });
  },
  component: SkillsPage,
});

function SkillsPage() {
  const { t } = useLocale();

  return (
    <>
      <PageHeader eyebrow={t.ui.skills} title={t.ui.skills} subtitle={t.profile.positioning} />
      <Section>
        <SkillsGrid categories={t.skills} />
      </Section>
      <ContactCta />
    </>
  );
}
