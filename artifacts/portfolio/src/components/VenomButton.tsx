import { useEffect, useRef, type ReactNode } from "react";

/*
 * "Venom" goo button.
 *
 * When the pointer comes near, black goo bulges out of the button, then thin
 * tendrils lunge out, wrap around the pointer and hold on. Pull away and they
 * stretch, snap and recoil into the button. The visitor's real cursor is never
 * hidden or replaced.
 *
 * Idea inspired by Venom Button by exteestudio (MIT):
 * https://github.com/exteestudio/venom-button
 * This is a separate, lightweight 2D canvas implementation.
 *
 * Off on touch screens and for visitors who prefer reduced motion; it then
 * behaves as a normal button.
 */

// Distances in CSS pixels, measured from the button edge.
const SENSE = 150; // goo starts to bulge
const LUNGE = 95; // tendrils reach out
const SNAP = 230; // tendrils snap when stretched this far
const PAD = 270; // how far the drawing area extends past the button
const MAX_TENDRILS = 5;
const POINTS = 13;
const SPREAD = [0, -30, 30, -60, 60]; // where tendrils root along the edge
const ANGLE = [0, -0.45, 0.45, -0.85, 0.85];

type Point = { x: number; y: number; px: number; py: number };
type Tendril = {
  slot: number;
  pts: Point[];
  ax: number;
  ay: number;
  rest: number;
  state: "lunge" | "attached" | "recoil";
  attachLen: number;
  phase: number;
};
type Drop = { x: number; y: number; r: number; life: number };

const FILTER_ID = "wintas-venom-goo";

export default function VenomButton({
  href,
  children,
  className = "",
  wrapperClassName = "",
  target,
  rel,
}: {
  href: string;
  target?: string;
  rel?: string;
  children: ReactNode;
  className?: string;
  wrapperClassName?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const gooRef = useRef<HTMLCanvasElement>(null);
  const fibreRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    const wrap = wrapRef.current;
    const clip = clipRef.current;
    const button = buttonRef.current;
    const gooCanvas = gooRef.current;
    const fibreCanvas = fibreRef.current;
    if (!wrap || !clip || !button || !gooCanvas || !fibreCanvas) return;
    const goo = gooCanvas.getContext("2d");
    const fibre = fibreCanvas.getContext("2d");
    if (!goo || !fibre) return;

    let pointerX = -1e5;
    let pointerY = -1e5;
    let overOtherControl = false;
    let frame = 0;
    let running = false;
    let lastTime = 0;
    let lastSpawn = 0;
    let lastSnap = -1e5;
    let swell = 0;
    let color = "#111";
    let canvasW = 0;
    let canvasH = 0;
    let dpr = 1;
    const tendrils: Tendril[] = [];
    const drops: Drop[] = [];

    const resize = (w: number, h: number) => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (w === canvasW && h === canvasH) return;
      canvasW = w;
      canvasH = h;
      for (const canvas of [gooCanvas, fibreCanvas]) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
      }
    };

    // The drawing layer is clipped to the visible screen so the goo can never
    // widen the page (which would shift right-to-left layouts sideways).
    const placeLayer = (buttonRect: DOMRect) => {
      const wrapRect = wrap.getBoundingClientRect();
      clip.style.left = `${-wrapRect.left}px`;
      clip.style.top = `${-wrapRect.top}px`;
      clip.style.width = `${document.documentElement.clientWidth}px`;
      clip.style.height = `${document.documentElement.clientHeight}px`;
      for (const canvas of [gooCanvas, fibreCanvas]) {
        canvas.style.left = `${buttonRect.left - PAD}px`;
        canvas.style.top = `${buttonRect.top - PAD}px`;
      }
    };

    const stop = () => {
      clear();
      clip.style.display = "none";
      running = false;
    };

    const clear = () => {
      goo.setTransform(1, 0, 0, 1, 0, 0);
      goo.clearRect(0, 0, gooCanvas.width, gooCanvas.height);
      fibre.setTransform(1, 0, 0, 1, 0, 0);
      fibre.clearRect(0, 0, fibreCanvas.width, fibreCanvas.height);
    };

    const start = () => {
      if (running) return;
      running = true;
      clip.style.display = "block";
      lastTime = performance.now();
      color = getComputedStyle(button).backgroundColor || color;
      frame = requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      // Leave the visitor alone while they use another link or button
      // (e.g. the language menu right next to this one).
      const target = event.target as Element | null;
      overOtherControl = Boolean(
        target?.closest?.("a, button, input, select, textarea, [role=menu]") &&
          !button.contains(target),
      );
      if (!running && button.offsetParent) {
        const rect = button.getBoundingClientRect();
        const dx = Math.max(rect.left - pointerX, 0, pointerX - rect.right);
        const dy = Math.max(rect.top - pointerY, 0, pointerY - rect.bottom);
        if (Math.hypot(dx, dy) < SENSE + 20) start();
      }
    };
    const onPointerLeave = () => {
      pointerX = -1e5;
      pointerY = -1e5;
    };

    function tick(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 1 / 30);
      lastTime = now;
      const t = now / 1000;

      if (!button!.offsetParent) {
        tendrils.length = 0;
        drops.length = 0;
        swell = 0;
        stop();
        return;
      }

      // Everything below works in canvas-local coordinates.
      const rect = button!.getBoundingClientRect();
      resize(rect.width + PAD * 2, rect.height + PAD * 2);
      placeLayer(rect);
      const ox = rect.left - PAD;
      const oy = rect.top - PAD;
      const left = PAD;
      const top = PAD;
      const w = rect.width;
      const h = rect.height;
      const r = h / 2;
      const cy = top + r;
      const cx0 = left + r;
      const cx1 = left + w - r;
      const px = pointerX - ox;
      const py = pointerY - oy;

      // Nearest point on the pill's centre line, and distance to its edge.
      const nearX = Math.min(Math.max(px, cx0), cx1);
      const toPointer = Math.hypot(px - nearX, py - cy);
      const edgeDist = toPointer - r;
      const inside = edgeDist < 0 || overOtherControl;
      const knotX = px + 5; // gather around the arrow's body, not its tip
      const knotY = py + 9;

      const anchorFor = (slot: number) => {
        const baseX = Math.min(Math.max(nearX + SPREAD[slot], cx0), cx1);
        let dx = px - baseX;
        let dy = py - cy;
        const len = Math.hypot(dx, dy) || 1;
        dx /= len;
        dy /= len;
        const a = ANGLE[slot];
        const rx = dx * Math.cos(a) - dy * Math.sin(a);
        const ry = dx * Math.sin(a) + dy * Math.cos(a);
        return { x: baseX + rx * r * 0.9, y: cy + ry * r * 0.9 };
      };

      // Surface swell as the pointer approaches.
      const proximity = inside ? 0 : Math.max(0, 1 - edgeDist / SENSE);
      swell += (proximity - swell) * Math.min(1, dt * 8);

      // Spawn tendrils.
      const active = tendrils.filter((td) => td.state !== "recoil");
      if (
        !inside &&
        edgeDist < LUNGE &&
        active.length < MAX_TENDRILS &&
        now - lastSpawn > 70 &&
        now - lastSnap > 450
      ) {
        const used = new Set(active.map((td) => td.slot));
        const slot = [0, 1, 2, 3, 4].find((s) => !used.has(s));
        if (slot !== undefined) {
          const anchor = anchorFor(slot);
          tendrils.push({
            slot,
            pts: Array.from({ length: POINTS }, () => ({
              x: anchor.x,
              y: anchor.y,
              px: anchor.x,
              py: anchor.y,
            })),
            ax: anchor.x,
            ay: anchor.y,
            rest: 0.5,
            state: "lunge",
            attachLen: 1,
            phase: Math.random() * Math.PI * 2,
          });
          lastSpawn = now;
        }
      }

      // Simulate.
      const steps = 3;
      const h1 = dt / steps;
      for (const td of tendrils) {
        const anchor = anchorFor(td.slot);
        td.ax += (anchor.x - td.ax) * Math.min(1, dt * 14);
        td.ay += (anchor.y - td.ay) * Math.min(1, dt * 14);

        const angle = (td.slot / MAX_TENDRILS) * Math.PI * 2 + t * 1.7;
        const tx = knotX + Math.cos(angle) * 9;
        const ty = knotY + Math.sin(angle) * 7;
        const reach = Math.hypot(tx - td.ax, ty - td.ay);
        const pointerReach = Math.hypot(px - td.ax, py - td.ay);

        if (td.state !== "recoil" && (inside || pointerReach > SNAP || edgeDist > SENSE)) {
          if (td.state === "attached") {
            drops.push({ x: td.pts[POINTS - 1].x, y: td.pts[POINTS - 1].y, r: 4.5, life: 1 });
          }
          td.state = "recoil";
          lastSnap = now;
        }

        if (td.state === "lunge") {
          td.rest = Math.min(td.rest + (1100 * dt) / (POINTS - 1), (reach * 1.05) / (POINTS - 1));
        } else if (td.state === "attached") {
          td.rest = (reach * 1.04) / (POINTS - 1);
        } else {
          td.rest *= Math.pow(0.0009, dt); // fast elastic retract
        }

        for (let s = 0; s < steps; s++) {
          const tip = td.pts[POINTS - 1];
          for (let i = 1; i < POINTS; i++) {
            const p = td.pts[i];
            const vx = (p.x - p.px) * 0.9;
            const vy = (p.y - p.py) * 0.9;
            p.px = p.x;
            p.py = p.y;
            // gentle slither + a little gravity
            const wave = Math.sin(t * 7 + i * 0.8 + td.phase) * (td.state === "recoil" ? 0 : 0.35);
            const seg = i < POINTS - 1 ? td.pts[i + 1] : td.pts[i - 1];
            const sx = seg.y - p.y;
            const sy = p.x - seg.x;
            const sl = Math.hypot(sx, sy) || 1;
            p.x += vx + (sx / sl) * wave;
            p.y += vy + (sy / sl) * wave + 900 * h1 * h1; // gravity
          }

          if (td.state === "lunge") {
            tip.x += (tx - tip.x) * 0.3;
            tip.y += (ty - tip.y) * 0.3;
            if (Math.hypot(tx - tip.x, ty - tip.y) < 4) {
              td.state = "attached";
              td.attachLen = Math.max(reach, 1);
            }
          } else if (td.state === "attached") {
            tip.x = tx;
            tip.y = ty;
          }

          td.pts[0].x = td.ax;
          td.pts[0].y = td.ay;
          for (let iter = 0; iter < 6; iter++) {
            for (let i = 0; i < POINTS - 1; i++) {
              const a = td.pts[i];
              const b = td.pts[i + 1];
              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const d = Math.hypot(dx, dy) || 0.0001;
              const diff = (d - td.rest) / d;
              const aPinned = i === 0;
              const bPinned = i + 1 === POINTS - 1 && td.state === "attached";
              if (aPinned && bPinned) continue;
              const wa = aPinned ? 0 : bPinned ? 1 : 0.5;
              const wb = bPinned ? 0 : aPinned ? 1 : 0.5;
              a.x += dx * diff * wa;
              a.y += dy * diff * wa;
              b.x -= dx * diff * wb;
              b.y -= dy * diff * wb;
            }
          }
        }
      }
      for (let i = tendrils.length - 1; i >= 0; i--) {
        if (tendrils[i].state === "recoil" && tendrils[i].rest * (POINTS - 1) < 3) {
          tendrils.splice(i, 1);
        }
      }
      for (let i = drops.length - 1; i >= 0; i--) {
        drops[i].life -= dt * 4;
        if (drops[i].life <= 0) drops.splice(i, 1);
      }

      // Draw.
      clear();
      goo.setTransform(dpr, 0, 0, dpr, 0, 0);
      fibre.setTransform(dpr, 0, 0, dpr, 0, 0);
      goo.fillStyle = color;
      goo.strokeStyle = color;
      goo.lineCap = "round";

      // The body (sits under the real button so the goo blends into it).
      goo.beginPath();
      goo.roundRect(left + 0.5, top + 0.5, w - 1, h - 1, r);
      goo.fill();

      // Bulges on the edge facing the pointer.
      if (swell > 0.01) {
        for (let k = -3; k <= 3; k++) {
          const bx = Math.min(Math.max(nearX + k * 13, cx0), cx1);
          let dx = px - bx;
          let dy = py - cy;
          const len = Math.hypot(dx, dy) || 1;
          dx /= len;
          dy /= len;
          const falloff = 1 - Math.abs(k) / 4;
          const bump = swell * falloff * (5 + 4 * Math.sin(t * 6 + k * 1.7));
          goo.beginPath();
          goo.arc(bx + dx * (r - 2 + bump), cy + dy * (r - 2 + bump), 3 + swell * 2.5 * falloff, 0, Math.PI * 2);
          goo.fill();
        }
      }

      for (const td of tendrils) {
        const stretch = Math.hypot(
          td.pts[POINTS - 1].x - td.ax,
          td.pts[POINTS - 1].y - td.ay,
        ) / td.attachLen;
        const thin =
          td.state === "attached" ? Math.min(1, Math.max(0.5, 1 / Math.sqrt(Math.max(stretch, 0.01)))) : 0.9;
        // root fillet
        goo.beginPath();
        goo.arc(td.ax, td.ay, 6 * thin, 0, Math.PI * 2);
        goo.fill();
        for (let i = 0; i < POINTS - 1; i++) {
          const f = i / (POINTS - 1);
          const radius = Math.max(2.2, (4.6 - 2.6 * f) * thin);
          goo.lineWidth = radius * 2;
          goo.beginPath();
          goo.moveTo(td.pts[i].x, td.pts[i].y);
          goo.lineTo(td.pts[i + 1].x, td.pts[i + 1].y);
          goo.stroke();
        }
        if (td.state === "attached") {
          const tip = td.pts[POINTS - 1];
          goo.beginPath();
          goo.arc(tip.x, tip.y, 3, 0, Math.PI * 2);
          goo.fill();
        }
      }

      for (const drop of drops) {
        goo.beginPath();
        goo.arc(drop.x, drop.y, drop.r * drop.life, 0, Math.PI * 2);
        goo.fill();
      }

      // Thin cheesy webbing between neighbouring tendrils (unfiltered canvas).
      const held = tendrils
        .filter((td) => td.state === "attached")
        .sort((a, b) => SPREAD[a.slot] - SPREAD[b.slot]);
      fibre.strokeStyle = color;
      fibre.lineCap = "round";
      for (let i = 0; i < held.length - 1; i++) {
        for (const at of [0.45, 0.7]) {
          const idx = Math.round(at * (POINTS - 1));
          const a = held[i].pts[idx];
          const b = held[i + 1].pts[idx];
          const gap = Math.hypot(b.x - a.x, b.y - a.y);
          if (gap > 90) continue;
          fibre.globalAlpha = 0.85 * (1 - gap / 90);
          fibre.lineWidth = 1.1;
          fibre.beginPath();
          fibre.moveTo(a.x, a.y);
          fibre.quadraticCurveTo((a.x + b.x) / 2, (a.y + b.y) / 2 + 6 + gap * 0.12, b.x, b.y);
          fibre.stroke();
        }
      }
      fibre.globalAlpha = 1;

      if (tendrils.length || drops.length || swell > 0.01 || edgeDist < SENSE + 20) {
        frame = requestAnimationFrame(tick);
      } else {
        stop();
      }
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`relative ${wrapperClassName}`}>
      <svg aria-hidden="true" className="absolute h-0 w-0" focusable="false">
        <defs>
          <filter id={FILTER_ID} colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
            />
          </filter>
        </defs>
      </svg>
      <div
        ref={clipRef}
        aria-hidden="true"
        className="pointer-events-none absolute overflow-hidden"
        style={{ display: "none" }}
      >
        <canvas
          ref={gooRef}
          className="absolute"
          style={{ filter: `url(#${FILTER_ID})` }}
        />
        <canvas ref={fibreRef} className="absolute" />
      </div>
      <a ref={buttonRef} href={href} target={target} rel={rel} className={`relative ${className}`}>
        {children}
      </a>
    </div>
  );
}
