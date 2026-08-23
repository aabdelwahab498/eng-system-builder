import {
  siDotnet,
  siSharp,
  siReact,
  siTypescript,
  siVite,
  siTailwindcss,
  siShadcnui,
  siFlutter,
  siDart,
  siPostgresql,
  siSupabase,
  siRedis,
  siDocker,
  siNginx,
  siLinux,
  siGit,
  siNestjs,
  siFastapi,
  type SimpleIcon,
} from "simple-icons";
import {
  Boxes,
  Brain,
  Database,
  GitBranch,
  Network,
  Server,
  Smartphone,
  Sparkles,
  Terminal,
  Timer,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const brand: Record<string, SimpleIcon> = {
  ".net": siDotnet,
  "c#": siSharp,
  "asp.net core": siDotnet,
  nestjs: siNestjs,
  fastapi: siFastapi,
  react: siReact,
  typescript: siTypescript,
  vite: siVite,
  "tailwind css": siTailwindcss,
  "shadcn/ui": siShadcnui,
  flutter: siFlutter,
  dart: siDart,
  postgresql: siPostgresql,
  supabase: siSupabase,
  redis: siRedis,
  docker: siDocker,
  nginx: siNginx,
  linux: siLinux,
  git: siGit,
};

/** Non-brand concepts fall back to a semantic line icon (locale-independent by category). */
const generic: Record<string, LucideIcon> = {
  "rest apis": Network,
  "background jobs": Timer,
  "mobile architecture": Smartphone,
  "app delivery": Boxes,
  "ai orchestration": Workflow,
  "model integration": Brain,
  "prompt systems": Sparkles,
  "ai services": Server,
  "sql server": Database,
  sql: Database,
  "ci pipelines": GitBranch,
};

const fallbackByCategory: Record<string, LucideIcon> = {
  backend: Server,
  frontend: Boxes,
  mobile: Smartphone,
  ai: Brain,
  databases: Database,
  devops: Terminal,
};

export function TechIcon({
  name,
  category,
  className,
}: {
  name: string;
  category?: string;
  className?: string;
}) {
  const key = name.trim().toLowerCase();
  const icon = brand[key];
  const classes = cn("size-3.5 shrink-0", className);

  if (icon) {
    return (
      <svg
        role="img"
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={classes}
        fill="currentColor"
      >
        <path d={icon.path} />
      </svg>
    );
  }

  const Fallback =
    generic[key] ?? (category ? fallbackByCategory[category] : undefined) ?? Terminal;
  return <Fallback aria-hidden="true" className={classes} strokeWidth={1.75} />;
}
