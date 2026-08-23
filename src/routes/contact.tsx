import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { contact, ecosystem, socials } from "@/data/site";
import { services } from "@/data/services";

const title = "Contact — Eng/Ahmed Abdelwahab";
const description = "Have a product in mind? Let's turn the idea into a system that can actually ship.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const activeSocials = socials.filter((s) => s.href);

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Have a product in mind?"
        subtitle="Let's turn the idea into a system that can actually ship."
      >
        {contact.email && (
          <div className="mt-8">
            <Button asChild size="lg">
              <a href={`mailto:${contact.email}`}>
                <Mail className="size-4" /> Start a Conversation
              </a>
            </Button>
          </div>
        )}
      </PageHeader>

      <Section bordered={false}>
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">Details</p>
            <ul className="mt-6 grid gap-px overflow-hidden rounded-lg border border-border bg-border">
              {contact.email && (
                <li className="flex items-center gap-3 bg-surface/70 px-5 py-4">
                  <Mail className="size-4 text-muted-foreground" />
                  <a href={`mailto:${contact.email}`} className="font-mono text-sm hover:text-primary">
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.location && (
                <li className="flex items-center gap-3 bg-surface/70 px-5 py-4">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span className="font-mono text-sm">{contact.location}</span>
                </li>
              )}
              <li className="bg-surface/70 px-5 py-4 text-sm text-muted-foreground">{contact.availability}</li>
              {!contact.email && (
                <li className="bg-surface/70 px-5 py-4 text-sm text-muted-foreground">
                  Contact channels are configured centrally and will appear here once set.
                </li>
              )}
            </ul>

            {activeSocials.length > 0 && (
              <>
                <p className="eyebrow mt-10">Elsewhere</p>
                <ul className="mt-4 flex flex-wrap gap-4">
                  {activeSocials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="font-mono text-sm text-muted-foreground hover:text-foreground"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <p className="eyebrow mt-10">Ecosystem</p>
            <ul className="mt-4 flex flex-wrap gap-4">
              <li>
                <a href={ecosystem.portfolio.url} className="font-mono text-sm text-muted-foreground hover:text-foreground">
                  {ecosystem.portfolio.url}
                </a>
              </li>
              <li>
                <a
                  href={ecosystem.factoryApi.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-mono text-sm text-muted-foreground hover:text-foreground"
                >
                  {ecosystem.factoryApi.url}
                </a>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <p className="eyebrow">Build With Me</p>
            <ul className="mt-6 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
              {services.map((s) => (
                <li key={s.title} className="bg-surface/70 p-5">
                  <h2 className="font-display text-base font-medium">{s.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">
              Pricing depends on scope — let's discuss what you need.
            </p>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
