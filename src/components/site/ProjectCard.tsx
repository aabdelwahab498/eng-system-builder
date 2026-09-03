import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import type { Project } from "@/types/content";
import { MediaSlot } from "./MediaSlot";
import { useLocale } from "@/hooks/useLocale";

export function ProjectCard({ project }: { project: Project }) {
  const { locale, t } = useLocale();
  const liveUrl = project.links?.find((l) => /^https?:\/\//.test(l.url))?.url;

  return (
    <article className="lift group flex h-full flex-col rounded-lg border border-border bg-surface/60 p-6 transition-colors hover:border-border-strong sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow">{project.category}</p>
        {project.flagship && (
          <span className="rounded-sm border border-primary/40 px-2 py-1 font-mono text-[10px] tracking-wide text-primary">
            Flagship
          </span>
        )}
      </div>

      <h3 className="mt-4 font-display text-2xl font-semibold">{project.name}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.summary}</p>

      {(project.disciplines?.length ?? 0) > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {project.disciplines!.map((d) => (
            <li
              key={d}
              className="rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-[11px] text-primary"
            >
              {d}
            </li>
          ))}
        </ul>
      )}

      {project.role && (
        <p className="mt-4 font-mono text-[11px] text-muted-foreground">
          {t.ui.roleLabel}: {project.role}
        </p>
      )}


      {project.media[0] && (
        <MediaSlot media={project.media[0]} note={t.ui.mediaPlaceholder} className="mt-6" />
      )}

      <ul className="mt-6 flex flex-wrap gap-2">
        {project.tech.slice(0, 6).map((tech) => (
          <li
            key={tech}
            className="rounded-sm border border-border px-2 py-1 font-mono text-[11px] text-muted-foreground"
          >
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-5">
        {liveUrl ? (
          <a
            href={liveUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-sm font-mono text-[11px] text-primary underline-offset-4 transition-colors hover:underline sm:min-h-0"
          >
            {project.status}
            <ExternalLink className="size-3" />
          </a>
        ) : (
          <span className="font-mono text-[11px] text-muted-foreground">{project.status}</span>
        )}
        <Link
          to="/$locale/projects/$slug"
          params={{ locale, slug: project.slug }}
          className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
        >
          {t.ui.viewProject}
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}
