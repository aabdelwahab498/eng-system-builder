import { useEffect, useRef } from "react";

/**
 * Matrix Rain + Sci-Fi HUD + Glitch strip.
 * Purely decorative canvas banner rendered under the navbar.
 */
export function MatrixHud({ height = 180 }: { height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const glyphs =
      "01ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]()/\\|=+-*#$%&@∑∫√π∞λΔΩ≠≈≤≥∂ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶ";
    const palette = ["#22ff88", "#39ff14", "#00e5ff", "#7c5cff", "#ff3d81", "#ffd166"];

    let raf = 0;
    let width = 0;
    let h = height;
    let cols = 0;
    let drops: number[] = [];
    let speeds: number[] = [];
    let colors: string[] = [];
    const fontSize = 14;

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth ?? window.innerWidth;
      h = height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / fontSize);
      drops = Array.from({ length: cols }, () => Math.random() * (h / fontSize));
      speeds = Array.from({ length: cols }, () => 0.4 + Math.random() * 1.1);
      colors = Array.from({ length: cols }, () =>
        Math.random() > 0.82 ? palette[Math.floor(Math.random() * palette.length)]! : "#22ff88",
      );
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
      // grid
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
      // scanning sweep
      const sweep = ((t * 2.2) % (width + 240)) - 120;
      const grad = ctx.createLinearGradient(sweep - 120, 0, sweep + 120, 0);
      grad.addColorStop(0, "rgba(0,229,255,0)");
      grad.addColorStop(0.5, "rgba(0,229,255,0.16)");
      grad.addColorStop(1, "rgba(0,229,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(sweep - 120, 0, 240, h);

      // rotating reticle
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

      // telemetry text
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

    const render = () => {
      t += 1;
      ctx.fillStyle = "rgba(4,8,10,0.16)";
      ctx.fillRect(0, 0, width, h);

      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      for (let i = 0; i < cols; i++) {
        const ch = glyphs[Math.floor(Math.random() * glyphs.length)]!;
        const x = i * fontSize;
        const y = drops[i]! * fontSize;
        ctx.fillStyle = "rgba(220,255,235,0.9)";
        ctx.fillText(ch, x, y);
        ctx.fillStyle = colors[i]!;
        ctx.globalAlpha = 0.65;
        ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)]!, x, y - fontSize);
        ctx.globalAlpha = 1;

        drops[i] = drops[i]! + speeds[i]!;
        if (y > h && Math.random() > 0.975) {
          drops[i] = 0;
          colors[i] = Math.random() > 0.82 ? palette[Math.floor(Math.random() * palette.length)]! : "#22ff88";
        }
      }

      drawHud();

      // glitch bursts
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
  }, [height]);

  return (
    <div
      aria-hidden="true"
      className="relative w-full overflow-hidden border-y border-primary/25 bg-[#04080a]"
      style={{ height }}
    >
      <canvas ref={canvasRef} className="block" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.45),transparent_35%,transparent_65%,rgba(0,0,0,0.55))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.15] [background:repeating-linear-gradient(to_bottom,rgba(255,255,255,0.5)_0px,rgba(255,255,255,0.5)_1px,transparent_1px,transparent_3px)]" />
    </div>
  );
}
