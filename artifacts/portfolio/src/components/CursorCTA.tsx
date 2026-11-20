import { useEffect, useRef, useState } from "react";

type Props = {
  href: string;
  label: string;
};

// A "Let's talk" pill that trails the visitor's normal cursor around the page.
// - The real cursor is never changed or hidden.
// - While the mouse moves, the pill follows a little below-right of it.
// - When the mouse rests, the pill parks so the visitor can click it (opens WhatsApp).
// - It hides over real links/buttons, while selecting text, and outside the window.
// - Desktop only (fine pointer + hover); off for reduced-motion visitors.
const OFFSET_X = 18;
const OFFSET_Y = 22;
const PARK_AFTER_MS = 650;
const UNPARK_DISTANCE = 150;

export default function CursorCTA({ href, label }: Props) {
  const pillRef = useRef<HTMLAnchorElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(fine.matches && !reduce.matches);
    update();
    fine.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const pill = pillRef.current;
    if (!pill) return;

    let tx = -200, ty = -200, x = -200, y = -200;
    let mx = 0, my = 0;
    let parked = false;
    let visible = false;
    let started = false;
    let idleTimer = 0;
    let raf = 0;
    const rtl = () => document.documentElement.dir === "rtl";

    const setVisible = (v: boolean) => {
      if (v === visible) return;
      visible = v;
      pill.dataset.visible = v ? "true" : "false";
    };
    const setParked = (p: boolean) => {
      parked = p;
      pill.dataset.parked = p ? "true" : "false";
    };

    const targetFor = (cx: number, cy: number) => {
      const w = pill.offsetWidth || 110;
      const h = pill.offsetHeight || 34;
      let nx = rtl() ? cx - OFFSET_X - w : cx + OFFSET_X;
      let ny = cy + OFFSET_Y;
      // keep it on screen
      if (nx + w > window.innerWidth - 8) nx = cx - OFFSET_X - w;
      if (nx < 8) nx = cx + OFFSET_X;
      if (ny + h > window.innerHeight - 8) ny = cy - OFFSET_Y - h;
      return [nx, ny];
    };

    const overInteractive = (el: Element | null) =>
      !!el?.closest(
        "a, button, input, textarea, select, label, summary, [role='button'], [role='menu'], [role='listbox'], [data-no-cursor-cta]",
      );

    const onMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      mx = e.clientX;
      my = e.clientY;
      const target = e.target as Element | null;
      const onPill = target === pill || pill.contains(target);

      if (parked) {
        // Stay put while the visitor heads to the pill; only leave if they move far away.
        if (onPill) return;
        const r = pill.getBoundingClientRect();
        const dx = mx - (r.left + r.width / 2);
        const dy = my - (r.top + r.height / 2);
        if (Math.hypot(dx, dy) < UNPARK_DISTANCE) return;
        setParked(false);
      }

      const hide =
        overInteractive(target) ||
        !!document.querySelector("html.intro-on") ||
        (window.getSelection()?.toString().length ?? 0) > 0;
      setVisible(!hide);

      [tx, ty] = targetFor(mx, my);
      if (!started) {
        x = tx;
        y = ty;
        started = true;
      }
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        if (visible) setParked(true);
      }, PARK_AFTER_MS);
    };

    const onLeave = () => {
      setVisible(false);
      setParked(false);
    };
    const onScroll = () => {
      // The page moved under a parked pill: let it follow again.
      if (parked) setParked(false);
      [tx, ty] = targetFor(mx, my);
    };
    const onDown = (e: PointerEvent) => {
      if (e.target !== pill && !pill.contains(e.target as Node)) setVisible(false);
    };

    const loop = () => {
      if (!parked) {
        x += (tx - x) * 0.2;
        y += (ty - y) * 0.2;
        pill.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(idleTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <a
      ref={pillRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={-1}
      aria-hidden="true"
      data-visible="false"
      data-parked="false"
      className="cursor-cta fixed left-0 top-0 z-[60] whitespace-nowrap"
    >
      <span className="cursor-cta-inner items-center gap-1.5 rounded-full bg-[#CDE600] px-3.5 py-1.5 text-[13px] font-semibold text-[#0B0B0C] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.45)]">
        <span className="cursor-cta-dot h-1.5 w-1.5 rounded-full bg-[#0B0B0C]" />
        {label}
      </span>
    </a>
  );
}
