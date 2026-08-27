import { useEffect, useRef } from "react";

/**
 * Matrix Rain + Sci-Fi HUD + Glitch strip.
 * Purely decorative canvas banner rendered under the navbar.
 *
 * variant="rain"     — classic cascading glyph columns.
 * variant="equations"— flowing algorithmic / math equations.
 */
type Variant = "rain" | "equations";

const EQUATIONS = [
  "O(n·log n)",
  "Σ x² → ∞",
  "∫ f(x) dx",
  "λx. x + 1",
  "a² + b² = c²",
  "∂Ψ/∂t = ĤΨ",
  "∇²E = ρ/ε₀",
  "f(n) = Θ(n²)",
  "P ≠ NP ?",
  "e^(iπ) + 1 = 0",
  "lim 1/n = 0",
  "x ↦ g(f(x))",
  "∀ε ∃δ : …",
  "y = mx + b",
  "argmax p(y|x)",
  "log₂(n)",
];

const MATH_GLYPHS = "0123456789+=-*/<>[](){}|^$%#&∂∇Σ∫√π∞λΔΩ≠≈≤≥∀∃∈∪∩⊂⊃→←↦·²³";

export function MatrixHud({
  height = 180,
  variant = "rain",
}: {
  height?: number;
  variant?: Variant;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const glyphs =
      variant === "equations"
        ? MATH_GLYPHS
        : "01ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]()/\\|=+-*#$%&@∑∫√π∞λΔΩ≠≈≤≥∂ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶ";
    const palette = ["#22ff88", "#39ff14", "#00e5ff", "#7c5cff", "#ff3d81", "#ffd166"];
    const headColor = "#dfffe8";

    let raf = 0;
    let width = 0;
    let h = height;
    let cols = 0;
    let drops: number[] = [];
    let speeds: number[] = [];
    let colors: string[] = [];
    // equation streams: each column carries a token moving downward
    let tokens: string[] = [];
    let tokenPos: number[] = [];
    let tokenSpeed: number[] = [];
    const fontSize = 14;

    const pickToken = () => EQUATIONS[Math.floor(Math.random() * EQUATIONS.length)]!;
    const pickColor = () =>
      Math.random() > 0.78 ? palette[Math.floor(Math.random() * palette.length)]! : "#22ff88";

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth ?? window.innerWidth;
      h = height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.max(1, Math.ceil(width / fontSize));
      drops = Array.from({ length: cols }, () => Math.random() * (h / fontSize));
      speeds = Array.from({ length: cols }, () => 0.4 + Math.random() * 1.1);
      colors = Array.from({ length: cols }, pickColor);
      tokens = Array.from({ length: cols }, pickToken);
      tokenPos = Array.from({ length: cols }, () => Math.random() * (h / fontSize));
      tokenSpeed = Array.from({ length: cols }, () => 0.18 + Math.random() * 0.32);
    };

    setup();
    const onResize = () => setup();
    window.addEventListener("resize", onResize);

    let t = 0;
    let glitchUntil = 0;

    const drawHud = () => {
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = "rgba(34,255,136,0.14)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 72) {
        ctx.beginPath();
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 36) {
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
        ctx.stroke();
      }
      const sweep = ((t * 2.2) % (width + 240)) - 120;
      const grad = ctx.createLinearGradient(sweep - 120, 0, sweep + 120, 0);
      grad.addColorStop(0, "rgba(0,229,255,0)");
      grad.addColorStop(0.5, "rgba(0,229,255,0.16)");
      grad.addColorStop(1, "rgba(0,229,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(sweep - 120, 0, 240, h);

      const cx = width - 90;
      const cy = h / 2;
      ctx.translate(cx, cy);
      ctx.rotate((t * 0.01) % (Math.PI * 2));
      ctx.strokeStyle = "rgba(0,229,255,0.45)";
      ctx.beginPath();
      ctx.arc(0, 0, 34, 0.4, 2.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 22, 3.4, 5.6);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.font = "11px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillStyle = "rgba(34,255,136,0.55)";
      const readouts = [
        `SYS::ONLINE  ${(Math.sin(t / 40) * 50 + 50).toFixed(1)}%`,
        `∂f/∂x = ${(Math.sin(t / 17) * 3.14).toFixed(3)}`,
        `NODE ${String(Math.floor(t / 6) % 9999).padStart(4, "0")}  LAT ${(8 + Math.abs(Math.sin(t / 23)) * 30).toFixed(0)}ms`,
      ];
      readouts.forEach((line, i) => ctx.fillText(line, 16, 20 + i * 15));
      ctx.restore();
    };

    const renderRain = () => {
      ctx.fillStyle = "rgba(4,8,10,0.16)";
      ctx.fillRect(0, 0, width, h);
      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      for (let i = 0; i < cols; i++) {
        const ch = glyphs[Math.floor(Math.random() * glyphs.length)]!;
        const x = i * fontSize;
        const y = drops[i]! * fontSize;
        ctx.fillStyle = headColor;
        ctx.globalAlpha = 0.9;
        ctx.fillText(ch, x, y);
        ctx.fillStyle = colors[i]!;
        ctx.globalAlpha = 0.65;
        ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)]!, x, y - fontSize);
        ctx.globalAlpha = 1;
        drops[i] = drops[i]! + speeds[i]!;
        if (y > h && Math.random() > 0.975) {
          drops[i] = 0;
          colors[i] = pickColor();
        }
      }
    };

    const renderEquations = () => {
      ctx.fillStyle = "rgba(4,8,10,0.20)";
      ctx.fillRect(0, 0, width, h);
      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textBaseline = "top";
      for (let i = 0; i < cols; i++) {
        const token = tokens[i]!;
        const x = i * fontSize;
        // draw the token vertically, char by char, starting at tokenPos
        const startY = tokenPos[i]! * fontSize;
        ctx.fillStyle = headColor;
        ctx.globalAlpha = 0.95;
        // leading (brightest) char
        ctx.fillText(token[0]!, x, startY);
        ctx.globalAlpha = 0.7;
        for (let c = 1; c < token.length; c++) {
          const chY = startY - c * fontSize;
          if (chY < -fontSize) break;
          ctx.fillStyle = colors[i]!;
          ctx.fillText(token[c]!, x, chY);
        }
        ctx.globalAlpha = 1;
        // sprinkle faint math glyph noise around the token for density
        if (Math.random() > 0.6) {
          const ny = (tokenPos[i]! + 1.5) * fontSize;
          ctx.fillStyle = colors[i]!;
          ctx.globalAlpha = 0.25;
          ctx.fillText(MATH_GLYPHS[Math.floor(Math.random() * MATH_GLYPHS.length)]!, x, ny);
          ctx.globalAlpha = 1;
        }
        tokenPos[i] = tokenPos[i]! + tokenSpeed[i]!;
        const tokenHeight = token.length * fontSize;
        if (startY > h + tokenHeight && Math.random() > 0.9) {
          tokenPos[i] = -token.length;
          tokens[i] = pickToken();
          colors[i] = pickColor();
          tokenSpeed[i] = 0.18 + Math.random() * 0.32;
        }
      }
      ctx.textBaseline = "alphabetic";
    };

    const render = () => {
      t += 1;
      if (variant === "equations") renderEquations();
      else renderRain();

      drawHud();

      if (t > glitchUntil && Math.random() > 0.985) glitchUntil = t + 8 + Math.random() * 10;
      if (t < glitchUntil) {
        const slices = 3 + Math.floor(Math.random() * 4);
        for (let s = 0; s < slices; s++) {
          const sy = Math.random() * h;
          const sh = 4 + Math.random() * 14;
          const dx = (Math.random() - 0.5) * 40;
          const slice = ctx.getImageData(0, sy, Math.max(1, width), Math.max(1, sh));
          ctx.putImageData(slice, dx, sy);
        }
        ctx.fillStyle = "rgba(255,61,129,0.08)";
        ctx.fillRect(0, 0, width, h);
      }

      raf = requestAnimationFrame(render);
    };

    if (reduce) {
      ctx.fillStyle = "rgba(4,8,10,1)";
      ctx.fillRect(0, 0, width, h);
      drawHud();
    } else {
      raf = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [height, variant]);

  return (
    <div
      aria-hidden="true"
      className="relative h-full w-full overflow-hidden bg-[#04080a]"
      style={{ height }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.45),transparent_35%,transparent_65%,rgba(0,0,0,0.55))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.15] [background:repeating-linear-gradient(to_bottom,rgba(255,255,255,0.5)_0px,rgba(255,255,255,0.5)_1px,transparent_1px,transparent_3px)]" />
    </div>
  );
}

/**
 * Two-box matrix strip placed under the navbar.
 * Left box ≈ 3 units, right box ≈ 6 units (1:2 ratio).
 */
export function MatrixStrip({ height = 180 }: { height?: number }) {
  return (
    <div
      aria-hidden="true"
      className="grid w-full gap-2 px-2 py-2 sm:gap-3 sm:px-3"
      style={{ gridTemplateColumns: "3fr 6fr" }}
    >
      <div className="overflow-hidden rounded-md border border-primary/30 shadow-[0_0_24px_-12px_rgba(34,255,136,0.5)]">
        <MatrixHud height={height} variant="equations" />
      </div>
      <div className="overflow-hidden rounded-md border border-primary/30 shadow-[0_0_24px_-12px_rgba(34,255,136,0.5)]">
        <MatrixHud height={height} variant="equations" />
      </div>
    </div>
  );
}
