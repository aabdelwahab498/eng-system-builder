import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

/** Wraps each child in a Reveal with an incremental delay. */
export function Stagger({
  children,
  step = 70,
  className,
  itemClassName,
}: {
  children: ReactNode;
  step?: number;
  className?: string;
  itemClassName?: string;
}) {
  return (
    <div className={className}>
      {Children.toArray(children).map((child, i) => (
        <Reveal
          key={(isValidElement(child) && (child as ReactElement).key) || i}
          delay={i * step}
          {...(itemClassName ? { className: itemClassName } : {})}
        >
          {child}
        </Reveal>
      ))}
    </div>
  );
}

/** Word-by-word masked reveal for headings. Falls back to plain text without JS. */
export function TextReveal({
  text,
  className,
  delay = 0,
  step = 45,
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  delay?: number;
  step?: number;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <Tag ref={ref as never} className={cn("text-balance", className)}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <span
            className={cn("word-reveal inline-block", shown && "word-reveal-in")}
            style={{ transitionDelay: `${delay + i * step}ms` }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/** Subtle vertical parallax for media only. Disabled under reduced motion. */
export function Parallax({
  children,
  strength = 18,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = el.getBoundingClientRect();
        const progress = (rect.top + rect.height / 2) / window.innerHeight - 0.5;
        setOffset(-progress * strength);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [strength]);

  return (
    <div ref={ref} className={className} style={{ transform: `translate3d(0, ${offset}px, 0)` }}>
      {children}
    </div>
  );
}

/** Convenience for cloning a single element with a hover-lift class. */
export function Lift({ children, className }: { children: ReactElement; className?: string }) {
  return cloneElement(children, {
    className: cn("lift", (children.props as { className?: string }).className, className),
  } as never);
}
