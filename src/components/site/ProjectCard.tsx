import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { Badge } from "@/components/ui/badge";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex h-full flex-col rounded-lg border border-border bg-surface/50 p-6 transition-colors hover:border-border-strong hover:bg-surface sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{project.category}</p>
          <h3 className="mt-3 font-display text-xl font-semibold sm:text-2xl">{project.name}</h3>
        </div>
        <Badge variant="secondary" className="shrink-0 font-mono text-[10px] tracking-wide">
          {project.status}
        </Badge>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{project.description}</p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {project.technology.map((t) => (
          <li
            key={t}
            className="rounded-sm border border-border px-2 py-1 font-mono text-[11px] text-muted-foreground"
          >
            {t}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
        <Link
          to="/projects/$slug"
          params={{ slug: project.slug }}
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
        >
          View Case Study <ArrowUpRight className="size-4" />
        </Link>
        {project.externalUrl && (
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {project.externalLabel ?? "Visit Product"} <ArrowUpRight className="size-4" />
          </a>
        )}
      </div>
    </article>
  );
}
