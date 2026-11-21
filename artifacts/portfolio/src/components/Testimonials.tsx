import { useEffect, useRef, useState, type CSSProperties } from "react";

export type Testimonial = {
  from: string;
  project: string;
  quote: string[];
  /** Screenshot of the project, shown on the card (path inside public/). */
  image?: string;
  theme?: "dark" | "lime" | "light";
};

type Props = {
  title: string;
  projectLabel: string;
  items: Testimonial[];
  /** Turns a public/ path into a URL (adds the site's base path). */
  assetUrl: (file: string) => string;
};

// Testimonials as a curved 3D track that turns as the visitor scrolls
// ("scroll to rotate"):
// - the section stays on screen while the visitor scrolls through it, and each bit of
//   scrolling turns the track to the next card; the front card faces the visitor and the
//   cards beside it bend away in 3D;
// - each quote writes itself letter by letter as its card comes to the front (text already
//   written stays written; the full text is always laid out, so cards never change size,
//   and screen readers get the whole quote);
// - a label under the track names the front card, with a 01 / 03 counter.
// Reduced motion (or no JavaScript): the cards are shown one under another, fully written.
const STEP_VH = 0.75; // scrolling this much of the screen height turns the track one card
const HOLD = 0.4; // the first card stays at the front for this long (in cards) while it writes

export default function Testimonials({ title, projectLabel, items, assetUrl }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [motion, setMotion] = useState(false);
  const [active, setActive] = useState(0);
  const count = items.length;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotion(!reduce.matches);
    update();
    reduce.addEventListener("change", update);
    return () => reduce.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const cards = Array.from(section.querySelectorAll<HTMLElement>(".t3d-card"));

    const writers = cards.map((card) => {
      const paras = Array.from(card.querySelectorAll<HTMLElement>(".t-line")).map((p) => ({
        typed: p.querySelector<HTMLElement>(".t-typed")!,
        rest: p.querySelector<HTMLElement>(".t-rest")!,
        text: p.dataset.text ?? "",
      }));
      const total = paras.reduce((n, p) => n + p.text.length, 0);
      return { card, paras, total, shown: -1 };
    });

    const write = (w: (typeof writers)[number], amount: number) => {
      if (amount <= w.shown) return; // never un-write
      w.shown = amount;
      let left = amount;
      w.paras.forEach((p) => {
        const k = Math.max(0, Math.min(p.text.length, left));
        left -= p.text.length;
        p.typed.textContent = p.text.slice(0, k);
        p.rest.textContent = p.text.slice(k);
      });
      const current = w.paras.find((p) => p.typed.textContent!.length < p.text.length);
      w.paras.forEach((p) => p.typed.classList.toggle("t-caret", p === current && amount > 0));
      w.card.classList.toggle("t-done", amount >= w.total);
    };

    if (!motion) {
      writers.forEach((w) => {
        w.shown = -1;
        write(w, w.total);
      });
      cards.forEach((c) => {
        c.style.transform = "";
        c.style.opacity = "";
        c.style.filter = "";
        c.style.zIndex = "";
      });
      return;
    }
    writers.forEach((w) => {
      w.shown = -1;
      write(w, 0);
    });

    let raf = 0;
    let lastActive = -1;
    const frame = () => {
      raf = 0;
      const vh = window.innerHeight;
      const step = vh * STEP_VH;
      const t = -section.getBoundingClientRect().top / step; // cards scrolled
      const x = Math.max(0, Math.min(count - 1, t - HOLD)); // track position

      const cardW = cards[0]?.offsetWidth ?? 800;
      const gap = cardW * 1.02;
      cards.forEach((card, i) => {
        const d = i - x;
        const a = Math.abs(d);
        const tx = d * gap;
        const ry = Math.max(-60, Math.min(60, -d * 34));
        const tz = -Math.min(a, 1.5) * 120;
        card.style.transform = `translate3d(calc(-50% + ${tx.toFixed(1)}px), 0, ${tz.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg)`;
        card.style.opacity = a > 2.2 ? "0" : "1";
        card.style.filter = `brightness(${(1 - Math.min(a, 1) * 0.12).toFixed(3)})`;
        card.style.zIndex = String(100 - Math.round(a * 10));
      });

      // Writing: card 0 writes while the section arrives; each later card writes as it
      // turns to the front.
      writers.forEach((w, i) => {
        const start = i === 0 ? -0.6 : i + HOLD - 0.7;
        const span = i === 0 ? 1.0 : 0.7;
        const progress = Math.max(0, Math.min(1, (t - start) / span));
        write(w, Math.round(progress * w.total));
      });

      const now = Math.round(x);
      if (now !== lastActive) {
        lastActive = now;
        setActive(now);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    frame();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [motion, count]);

  const pad = (n: number) => String(n).padStart(2, "0");
  const current = items[active] ?? items[0];

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className={`t3d ${motion ? "t3d-on" : ""}`}
      style={{ "--t3d-steps": count - 1 + HOLD + 0.35 } as CSSProperties}
    >
      <div className="t3d-sticky">
        <div className="t3d-head px-5 sm:px-8 max-w-[1400px] mx-auto w-full flex items-end justify-between gap-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">{title}</h2>
          {motion && (
            <span
              dir="ltr"
              className="font-mono text-xs sm:text-sm tracking-[0.2em] text-muted-foreground pb-1 sm:pb-2"
            >
              {pad(active + 1)} / {pad(count)}
            </span>
          )}
        </div>

        <div className="t3d-stage" dir="ltr">
          {items.map((item, i) => (
            <figure
              key={item.from + item.project}
              className={`t3d-card t3d-${item.theme ?? "dark"}`}
              aria-current={motion && i === active ? "true" : undefined}
            >
              <div className="t3d-text">
                <span aria-hidden="true" className="t3d-mark">
                  &ldquo;
                </span>
                <blockquote lang="en" className="t3d-quote">
                  {item.quote.map((para) => (
                    <p key={para.slice(0, 24)} className="t-line" data-text={para}>
                      <span className="sr-only">{para}</span>
                      <span aria-hidden="true">
                        <span className="t-typed" />
                        <span className="t-rest">{para}</span>
                      </span>
                    </p>
                  ))}
                </blockquote>
                <figcaption className="t3d-caption">
                  <p className="t3d-from">{item.from}</p>
                  <p className="t3d-project">
                    {projectLabel}: {item.project}
                  </p>
                </figcaption>
              </div>
              {item.image && (
                <div className="t3d-shot">
                  <img
                    src={assetUrl(item.image)}
                    alt={`${item.project} screenshot`}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
            </figure>
          ))}
        </div>

        {motion && current && (
          <div className="t3d-label text-center px-5" aria-live="polite">
            <p className="font-bold text-sm sm:text-base">{current.project}</p>
            <p className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-muted-foreground mt-1">
              {current.from}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
