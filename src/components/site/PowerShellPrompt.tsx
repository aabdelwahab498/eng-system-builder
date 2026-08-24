import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** A PowerShell-style terminal box that types the given text word-by-word
 *  in glowing green on a dark console background. Loops continuously. */
export function PowerShellPrompt({
  text,
  className,
  prompt = "PS C:\\nextnext-gen>",
  speed = 110,
  startDelay = 400,
  holdDelay = 1800,
  deleteSpeed = 45,
}: {
  text: string;
  className?: string;
  prompt?: string;
  speed?: number;
  startDelay?: number;
  holdDelay?: number;
  deleteSpeed?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [words, setWords] = useState<string[]>([]);
  const [started, setStarted] = useState(false);
  const [reduced, setReduced] = useState(false);

  const wordList = text.split(" ");

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      setWords(wordList);
      return;
    }
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setStarted(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setStarted(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  useEffect(() => {
    if (!started || reduced) return;
    let i = 0;
    let phase: "type" | "hold" | "delete" | "gap" = "type";
    let timer: ReturnType<typeof setTimeout>;

    const step = () => {
      if (phase === "type") {
        i += 1;
        setWords(wordList.slice(0, i));
        if (i < wordList.length) {
          timer = setTimeout(step, speed);
        } else {
          phase = "hold";
          timer = setTimeout(step, holdDelay);
        }
      } else if (phase === "hold") {
        phase = "delete";
        timer = setTimeout(step, 200);
      } else if (phase === "delete") {
        i -= 1;
        setWords(i > 0 ? wordList.slice(0, i) : []);
        if (i > 0) {
          timer = setTimeout(step, deleteSpeed);
        } else {
          phase = "gap";
          timer = setTimeout(step, startDelay);
        }
      } else {
        phase = "type";
        timer = setTimeout(step, speed);
      }
    };
    timer = setTimeout(step, startDelay);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, reduced, speed, startDelay, holdDelay, deleteSpeed, text]);

  const typing = words.length < wordList.length;

  return (
    <div
      ref={ref}
      className={cn(
        "ps-box relative w-fit max-w-full overflow-hidden rounded-md border border-emerald-500/25 bg-[#012456] px-3 py-2 font-mono text-xs sm:text-sm",
        className,
      )}
    >
      <div className="flex items-start gap-2">
        <span className="ps-prompt shrink-0 select-none font-semibold text-emerald-400">
          {prompt}
        </span>
        <span className="ps-text font-semibold text-emerald-400">
          {reduced ? text : words.join(" ")}
          <span aria-hidden className={cn("ps-caret", typing || reduced ? "" : "ps-caret-hidden")} />
        </span>
      </div>
    </div>
  );
}
