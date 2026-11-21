import { useEffect, useRef, type CSSProperties } from "react";

export type Testimonial = {
  from: string;
  project: string;
  quote: string[];
};

type Props = {
  title: string;
  projectLabel: string;
  items: Testimonial[];
};

// Testimonial cards that animate as the visitor scrolls:
// - each card rises, straightens and fades in when it comes into view, and its quote mark pops;
// - the quote then "writes itself" letter by letter as the visitor scrolls down, with a
//   lime cursor; text already written stays written. The full text is always laid out
//   (unwritten letters are invisible), so the card never jumps in size, and screen readers
//   get the whole quote at once;
// - when the writing finishes, a lime line draws under the client's name;
// - while scrolling, the cards drift at slightly different speeds (wider screens only).
// Visitors who ask their device for reduced motion see everything at once, without movement.
const TILTS = [-3, 2, -2];
const DRIFT = [0.05, -0.035, 0.07];

export default function Testimonials({ title, projectLabel, items }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cards = Array.from(section.querySelectorAll<HTMLElement>(".t-card"));
    const drifters = Array.from(section.querySelectorAll<HTMLElement>(".t-drift"));

    // Each card's paragraphs, as [typed span, rest span, full text].
    const writers = cards.map((card) => {
      const paras = Array.from(card.querySelectorAll<HTMLElement>(".t-line")).map((p) => ({
        typed: p.querySelector<HTMLElement>(".t-typed")!,
        rest: p.querySelector<HTMLElement>(".t-rest")!,
        text: p.dataset.text ?? "",
      }));
      const total = paras.reduce((n, p) => n + p.text.length, 0);
      return { card, paras, total, shown: -1 };
    });

    const write = (w: (typeof writers)[number], count: number) => {
      if (count <= w.shown) return; // never un-write
      w.shown = count;
      let left = count;
      w.paras.forEach((p) => {
        const k = Math.max(0, Math.min(p.text.length, left));
        left -= p.text.length;
        p.typed.textContent = p.text.slice(0, k);
        p.rest.textContent = p.text.slice(k);
        p.typed.classList.toggle("t-writing", k > 0 && k < p.text.length);
      });
      // Cursor sits at the end of the paragraph currently being written.
      const active = w.paras.find((p) => p.typed.textContent!.length < p.text.length);
      w.paras.forEach((p) => p.typed.classList.toggle("t-caret", p === active && count > 0));
      if (count >= w.total) w.card.classList.add("t-done");
    };

    if (reduce.matches || !("IntersectionObserver" in window)) {
      writers.forEach((w) => {
        w.card.classList.add("t-in");
        write(w, w.total);
        w.paras.forEach((p) => p.typed.classList.remove("t-caret"));
      });
      return;
    }
    writers.forEach((w) => write(w, 0));

    const seen = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("t-in");
            seen.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );
    cards.forEach((c) => seen.observe(c));

    const wide = window.matchMedia("(min-width: 768px)");
    let raf = 0;
    const drift = () => {
      raf = 0;
      const vh = window.innerHeight;
      // Writing: starts when a card's top passes 80% down the screen and finishes
      // by the time it reaches 20%.
      writers.forEach((w) => {
        const top = w.card.getBoundingClientRect().top;
        const progress = Math.max(0, Math.min(1, (vh * 0.8 - top) / (vh * 0.6)));
        write(w, Math.round(progress * w.total));
      });
      const mid = vh / 2;
      drifters.forEach((d, i) => {
        if (!wide.matches) {
          d.style.transform = "";
          return;
        }
        const r = d.getBoundingClientRect();
        const offset = (r.top + r.height / 2 - mid) * (DRIFT[i % DRIFT.length] ?? 0.05);
        d.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(drift);
    };
    drift();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      seen.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items.length]);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="pb-20 sm:pb-32 px-5 sm:px-8 max-w-[1400px] mx-auto"
    >
      <h2 className="t-title text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-12 sm:mb-16">
        {title}
      </h2>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 items-start">
        {items.map((item, i) => (
          <div key={item.from + item.project} className="t-drift will-change-transform">
            <figure
              className="t-card flex flex-col gap-6 rounded-2xl bg-foreground text-background p-6 sm:p-10"
              style={
                {
                  "--t-delay": `${i * 0.15}s`,
                  "--t-tilt": `${TILTS[i % TILTS.length]}deg`,
                } as CSSProperties
              }
            >
              <span
                aria-hidden="true"
                className="t-mark text-6xl leading-none font-bold text-[#CDE600]"
              >
                &ldquo;
              </span>
              <blockquote
                lang="en"
                dir="ltr"
                className="-mt-6 space-y-4 text-base leading-relaxed text-background/85"
              >
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
              <figcaption className="t-caption relative mt-auto pt-5">
                <p className="font-semibold">{item.from}</p>
                <p className="text-sm text-background/60">
                  {projectLabel}: <span dir="ltr">{item.project}</span>
                </p>
              </figcaption>
            </figure>
          </div>
        ))}
      </div>
    </section>
  );
}
