import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { TechMatrix } from "@/components/site/TechMatrix";
import { ContactCta } from "@/components/site/ContactCta";
import { whatIBuild } from "@/data/services";

const title = "About — Eng/Ahmed Abdelwahab";
const description =
  "Software engineer working across backend architecture, AI systems and digital products — from idea to architecture, implementation and production.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Engineering with a product mindset."
        subtitle="Software engineering, backend development, architecture and AI systems — applied to building digital products that reach production."
      />

      <Section bordered={false}>
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal className="space-y-6 text-base leading-relaxed text-muted-foreground">
            <p>
              My work sits between software engineering and product building. I design backend systems and
              architecture, implement services and APIs, and integrate AI where it makes a product genuinely more
              useful.
            </p>
            <p>
              The path I care about is the full one: requirement, architecture, contracts, implementation, quality and
              deployment. A system is only interesting once it runs in production and someone can actually use it.
            </p>
            <p>
              That mindset shapes the projects here — an Arabic-first AI story platform, and a software factory that
              turns structured requirements into structured systems.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <p className="eyebrow">What I build</p>
            <ul className="mt-6 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
              {whatIBuild.map((item) => (
                <li key={item} className="bg-surface/70 px-5 py-5 font-display text-base">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section eyebrow="Stack" title="Technology Matrix">
        <TechMatrix />
      </Section>

      <ContactCta />
    </>
  );
}
