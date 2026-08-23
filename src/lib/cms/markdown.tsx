import type { ReactNode } from "react";

/**
 * Minimal, safe Markdown renderer. Produces React nodes only — no
 * `dangerouslySetInnerHTML`, so stored article bodies can never inject HTML.
 * Supports: headings, paragraphs, bold, italic, inline code, links, images,
 * unordered/ordered lists, blockquotes and fenced code blocks.
 */

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern =
    /(!\[[^\]]*\]\([^)\s]+\))|(\[[^\]]+\]\([^)\s]+\))|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(`[^`]+`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${i++}`;

    if (token.startsWith("![")) {
      const alt = token.slice(2, token.indexOf("]"));
      const src = token.slice(token.indexOf("(") + 1, -1);
      nodes.push(
        <img key={key} src={src} alt={alt} loading="lazy" className="my-4 w-full rounded-md border border-border" />,
      );
    } else if (token.startsWith("[")) {
      const label = token.slice(1, token.indexOf("]"));
      const href = token.slice(token.indexOf("(") + 1, -1);
      const external = /^https?:\/\//.test(href);
      nodes.push(
        <a
          key={key}
          href={href}
          className="text-primary underline underline-offset-4"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {label}
        </a>,
      );
    } else if (token.startsWith("**")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*")) {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    } else {
      nodes.push(
        <code key={key} className="rounded bg-surface px-1.5 py-0.5 font-mono text-[0.85em]">
          {token.slice(1, -1)}
        </code>,
      );
    }
    last = match.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] ?? "";

    if (line.trim() === "") {
      i += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !(lines[i] ?? "").startsWith("```")) {
        code.push(lines[i] ?? "");
        i += 1;
      }
      i += 1;
      blocks.push(
        <pre
          key={`code-${blocks.length}`}
          className="my-5 overflow-x-auto rounded-md border border-border bg-surface p-4 font-mono text-xs leading-relaxed"
        >
          <code>{code.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1]!.length;
      const content = renderInline(heading[2] ?? "", `h-${blocks.length}`);
      const cls = [
        "mt-10 font-display text-2xl font-semibold text-foreground",
        "mt-9 font-display text-xl font-semibold text-foreground",
        "mt-8 font-display text-lg font-semibold text-foreground",
        "mt-6 font-display text-base font-semibold text-foreground",
      ][level - 1];
      const Tag = (["h2", "h3", "h4", "h5"] as const)[level - 1]!;
      blocks.push(
        <Tag key={`h-${blocks.length}`} className={cls}>
          {content}
        </Tag>,
      );
      i += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i] ?? "")) {
        quote.push((lines[i] ?? "").replace(/^>\s?/, ""));
        i += 1;
      }
      blocks.push(
        <blockquote
          key={`q-${blocks.length}`}
          className="my-5 border-l-2 border-primary/60 pl-4 text-muted-foreground italic"
        >
          {renderInline(quote.join(" "), `q-${blocks.length}`)}
        </blockquote>,
      );
      continue;
    }

    if (/^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      const ordered = /^\d+\.\s+/.test(line);
      const items: string[] = [];
      const test = ordered ? /^\d+\.\s+/ : /^[-*]\s+/;
      while (i < lines.length && test.test(lines[i] ?? "")) {
        items.push((lines[i] ?? "").replace(test, ""));
        i += 1;
      }
      const ListTag = ordered ? "ol" : "ul";
      blocks.push(
        <ListTag
          key={`l-${blocks.length}`}
          className={`my-4 space-y-2 pl-5 text-muted-foreground ${ordered ? "list-decimal" : "list-disc"}`}
        >
          {items.map((item, index) => (
            <li key={index}>{renderInline(item, `li-${blocks.length}-${index}`)}</li>
          ))}
        </ListTag>,
      );
      continue;
    }

    const para: string[] = [];
    while (i < lines.length && (lines[i] ?? "").trim() !== "" && !/^(#{1,4}\s|>|```|[-*]\s|\d+\.\s)/.test(lines[i] ?? "")) {
      para.push(lines[i] ?? "");
      i += 1;
    }
    blocks.push(
      <p key={`p-${blocks.length}`} className="my-4 leading-relaxed text-muted-foreground">
        {renderInline(para.join(" "), `p-${blocks.length}`)}
      </p>,
    );
  }

  return <div className="max-w-none">{blocks}</div>;
}
