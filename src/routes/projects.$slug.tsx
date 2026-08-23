import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Container, Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ContactCta } from "@/components/site/ContactCta";
import { Button } from "@/components/ui/button";
import { getProject } from "@/data/projects";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Project unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const { project } = loaderData;
    const title = `${project.name} — Case Study`;
    return {
      meta: [
        { title },
        { name: "description", content: project.description },
        { property: "og:title", content: title },
        { property: "og:description", content: project.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/projects/${params.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/projects/${params.slug}` }],
    };
  },
  component: ProjectCaseStudy,
});

function Block({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <Reveal className="hairline grid gap-4 py-8 lg:grid-cols-[220px_1fr] lg:gap-12">
      <h2 className="eyebrow lg:pt-1">{heading}</h2>
      <div className="text-base leading-relaxed text-muted-foreground">{children}</div>
    </Reveal>
  );
}

function ProjectCaseStudy() {
  const { project } = Route.useLoaderData();
  const cs = project.caseStudy;

  return (
    <>
      <PageHeader eyebrow={project.category} title={project.name} subtitle={project.description}>
        <div className="mt-8 flex flex-wrap gap-3">
          {project.externalUrl && (
            <Button asChild>
              <a href={project.externalUrl} target="_blank" rel="noreferrer noopener">
                {project.externalLabel ?? "Visit Product"} <ArrowUpRight className="size-4" />
              </a>
            </Button>
          )}
          <Button asChild variant="outline">
            <Link to="/projects">
              <ArrowLeft className="size-4" /> All projects
            </Link>
          </Button>
        </div>
      </PageHeader>

      <Section bordered={false}>
        <Block heading="Overview">{cs.overview}</Block>
        <Block heading="Problem">{cs.problem}</Block>
        <Block heading="Approach">{cs.approach}</Block>
        <Block heading="Architecture">
          <ol className="grid gap-px overflow-hidden rounded-lg border border-border bg-border">
            {cs.architecture.map((step, i) => (
              <li key={step} className="flex items-center gap-4 bg-surface/70 px-5 py-3">
                <span className="font-mono text-[11px] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </Block>
        <Block heading="Technology">
          <ul className="flex flex-wrap gap-2">
            {project.technology.map((t) => (
              <li key={t} className="rounded-sm border border-border px-2.5 py-1 font-mono text-xs">
                {t}
              </li>
            ))}
          </ul>
        </Block>
        <Block heading="Implementation">{cs.implementation}</Block>
        <Block heading="Challenges">{cs.challenges}</Block>
        <Block heading="Outcome">{cs.outcome}</Block>
        <Block heading="Screenshots">
          {cs.screenshots.length === 0 ? (
            <p>Screenshots will be published alongside the project.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {cs.screenshots.map((s) => (
                <img
                  key={s.src}
                  src={s.src}
                  alt={s.alt}
                  loading="lazy"
                  className="rounded-lg border border-border"
                />
              ))}
            </div>
          )}
        </Block>
        <Block heading="Status">{project.status}</Block>
      </Section>

      <Container>
        <div className="pb-4" />
      </Container>
      <ContactCta />
    </>
  );
}
