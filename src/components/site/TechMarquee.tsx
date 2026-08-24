import {
  siTypescript,
  siPython,
  siDart,
  siFlutter,
  siSharp,
  siCplusplus,
  siDotnet,
  siReact,
  siVite,
  siTailwindcss,
  siSupabase,
  siPostgresql,
  siRedis,
  siDocker,
  siNginx,
  siLinux,
  siGit,
  siGithub,
  siNestjs,
  siFastapi,
  type SimpleIcon,
} from "simple-icons";

const ICONS: SimpleIcon[] = [
  siTypescript,
  siPython,
  siDart,
  siFlutter,
  siSharp,
  siCplusplus,
  siDotnet,
  siReact,
  siVite,
  siTailwindcss,
  siNestjs,
  siFastapi,
  siSupabase,
  siPostgresql,
  siRedis,
  siDocker,
  siNginx,
  siLinux,
  siGit,
  siGithub,
];

function Row() {
  return (
    <ul className="flex shrink-0 items-center gap-8 pe-8" aria-hidden="true">
      {ICONS.map((icon) => (
        <li key={icon.title} className="shrink-0">
          <svg
            role="img"
            viewBox="0 0 24 24"
            className="size-8 opacity-80 transition-opacity duration-200 hover:opacity-100 sm:size-10"
            fill={`#${icon.hex}`}
          >
            <title>{icon.title}</title>
            <path d={icon.path} />
          </svg>
        </li>
      ))}
    </ul>
  );
}

/** Infinite left-to-right icon marquee of the engineering stack. */
export function TechMarquee({ label }: { label?: string }) {
  return (
    <div className="w-full">
      {label && <p className="eyebrow mb-5 text-center">{label}</p>}
      <div className="marquee-mask relative overflow-hidden py-2">
        <div className="marquee-track flex w-max">
          <Row />
          <Row />
        </div>
      </div>
    </div>
  );
}
