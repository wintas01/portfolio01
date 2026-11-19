import { useEffect, useMemo, useRef, useState } from "react";

/*
 * The contribution grid with a snake that travels to each green square,
 * eats it, and loops once the graph is empty. Uses the real contribution data.
 * Runs only while the grid is on screen; visitors who prefer reduced motion
 * see the normal, still graph.
 */

type Day = { date: string; count: number; level: number };

const SNAKE_LENGTH = 6;
const STEP_MS = 55; // time per square
const PAUSE_STEPS = 28; // empty-graph pause before the squares refill
const SNAKE_RGB = "205, 230, 0"; // brand lime

type Props = {
  days: Day[];
  leadingEmptyDays: number;
  weekCount: number;
  monthsByWeek: Map<number, string>;
  weekdays: readonly string[];
  colors: readonly string[];
  ariaLabel: string;
  dayTitle: (day: Day) => string;
};

/** Greedy route: from the current square, take the shortest grid path to the
 *  nearest uneaten green square, eating any green squares passed on the way. */
function buildRoute(days: Day[], leadingEmptyDays: number) {
  const n = days.length;
  const positionOf = (i: number) => leadingEmptyDays + i;
  const indexAt = new Map<number, number>();
  for (let i = 0; i < n; i++) indexAt.set(positionOf(i), i);

  const neighbours = (i: number) => {
    const p = positionOf(i);
    const out: number[] = [];
    const candidates = [p % 7 !== 0 ? p - 1 : -1, p % 7 !== 6 ? p + 1 : -1, p - 7, p + 7];
    for (const q of candidates) {
      const j = q >= 0 ? indexAt.get(q) : undefined;
      if (j !== undefined) out.push(j);
    }
    return out;
  };

  const remaining = new Set<number>();
  days.forEach((d, i) => {
    if (Math.round(d.level) > 0) remaining.add(i);
  });

  const route: number[] = [];
  const eatenAt = new Array<number>(n).fill(Number.POSITIVE_INFINITY);
  if (n === 0) return { route, eatenAt };

  let current = 0;
  route.push(current);
  if (remaining.delete(current)) eatenAt[current] = 0;

  while (remaining.size > 0) {
    // Breadth-first search to the nearest remaining green square.
    const prev = new Array<number>(n).fill(-1);
    const seen = new Uint8Array(n);
    const queue = [current];
    seen[current] = 1;
    let target = -1;
    for (let head = 0; head < queue.length && target < 0; head++) {
      for (const nb of neighbours(queue[head])) {
        if (seen[nb]) continue;
        seen[nb] = 1;
        prev[nb] = queue[head];
        if (remaining.has(nb)) {
          target = nb;
          break;
        }
        queue.push(nb);
      }
    }
    if (target < 0) break; // unreachable (shouldn't happen on a full grid)

    const leg: number[] = [];
    for (let c = target; c !== current; c = prev[c]) leg.push(c);
    leg.reverse();
    for (const c of leg) {
      route.push(c);
      if (remaining.delete(c)) eatenAt[c] = route.length - 1;
    }
    current = target;
  }
  return { route, eatenAt };
}

export default function ContributionSnakeGrid({
  days,
  leadingEmptyDays,
  weekCount,
  monthsByWeek,
  weekdays,
  colors,
  ariaLabel,
  dayTitle,
}: Props) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(-1); // -1 = still graph
  const { route, eatenAt } = useMemo(() => buildRoute(days, leadingEmptyDays), [days, leadingEmptyDays]);

  // Cycle: crawl the route, let the tail leave, pause on the empty graph, refill.
  const cycleLength = route.length + SNAKE_LENGTH + PAUSE_STEPS;

  useEffect(() => {
    setStep(-1);
    const grid = gridRef.current;
    if (!grid || route.length < 2) return;
    let reduce = false;
    try {
      reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      // ignore
    }
    if (reduce) return;

    let visible = false;
    let frame = 0;
    let last = 0;
    let current = 0;
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!visible) {
        last = now;
        return;
      }
      if (now - last < STEP_MS) return;
      last = now;
      current = (current + 1) % cycleLength;
      setStep(current);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries.some((e) => e.isIntersecting);
      },
      { threshold: 0.25 },
    );
    observer.observe(grid);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [route, cycleLength]);

  // Which day squares the snake covers right now (head first).
  const snakeAt = new Map<number, number>();
  if (step >= 0) {
    for (let k = 0; k < SNAKE_LENGTH; k++) {
      const r = step - k;
      if (r >= 0 && r < route.length && !snakeAt.has(route[r])) snakeAt.set(route[r], k);
    }
  }
  const crawling = step >= 0;

  return (
    <div
      ref={gridRef}
      role="img"
      aria-label={ariaLabel}
      className="min-w-[560px] text-[#8b949e]"
      style={{
        display: "grid",
        gridTemplateColumns: `auto repeat(${weekCount}, minmax(0, 1fr))`,
        gap: "3px",
      }}
    >
      {Array.from({ length: weekCount }, (_, weekIndex) => (
        <span
          key={`month-${weekIndex}`}
          aria-hidden="true"
          className="mb-1 whitespace-nowrap text-xs leading-none"
          style={{ gridColumn: weekIndex + 2, gridRow: 1 }}
        >
          {monthsByWeek.get(weekIndex) ?? ""}
        </span>
      ))}
      {weekdays.map((label, index) => (
        <span
          key={label}
          aria-hidden="true"
          className="pr-2 text-[10px] leading-none self-center"
          style={{ gridColumn: 1, gridRow: index * 2 + 3 }}
        >
          {label}
        </span>
      ))}
      {days.map((day, index) => {
        const position = leadingEmptyDays + index;
        const level = Math.min(Math.max(Math.round(day.level), 0), colors.length - 1);
        const segment = snakeAt.get(index);
        let background = colors[level];
        if (segment !== undefined) {
          const alpha = 1 - (segment / SNAKE_LENGTH) * 0.7;
          background = `rgba(${SNAKE_RGB}, ${alpha.toFixed(2)})`;
        } else if (crawling && eatenAt[index] <= step) {
          background = colors[0];
        }
        return (
          <span
            key={day.date}
            title={dayTitle(day)}
            className="aspect-square w-full rounded-[2px] outline outline-1 -outline-offset-1 outline-white/5"
            style={{
              gridColumn: Math.floor(position / 7) + 2,
              gridRow: (position % 7) + 2,
              backgroundColor: background,
              transition: segment !== undefined ? "none" : "background-color 0.6s ease",
            }}
          />
        );
      })}
    </div>
  );
}
