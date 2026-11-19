import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Code2,
  ExternalLink,
  Github,
  MapPin,
  RefreshCw,
  Users,
} from "lucide-react";
import { useI18n } from "@/i18n";
import ContributionSnakeGrid from "@/components/ContributionSnakeGrid";

const GITHUB_USERNAME = "wintas01";
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;
const CURRENT_YEAR = new Date().getFullYear();
const CONTRIBUTIONS_API_BASE_URL = (
  import.meta.env.VITE_GITHUB_CONTRIBUTIONS_API_URL ?? ""
).replace(/\/+$/, "");
// Public fallback that reads the same calendar shown on the GitHub profile.
const PUBLIC_CONTRIBUTIONS_API_URL = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}`;
const CONTRIBUTIONS_DOCS_URL =
  "https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/viewing-contributions-on-your-profile";

type GitHubProfile = {
  name: string | null;
  login: string;
  avatar_url: string;
  bio: string | null;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  location: string | null;
};

type GitHubData = {
  profile: GitHubProfile;
};

type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

type ContributionsResponse = {
  total: number;
  contributions: ContributionDay[];
};

const CONTRIBUTION_LEVEL_COLORS = [
  "#161b22",
  "#0e4429",
  "#006d32",
  "#26a641",
  "#39d353",
];

function isValidContributions(result: unknown): result is ContributionsResponse {
  const candidate = result as ContributionsResponse | null;
  return (
    !!candidate &&
    Number.isFinite(candidate.total) &&
    Array.isArray(candidate.contributions) &&
    candidate.contributions.every(
      (day) =>
        typeof day.date === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(day.date) &&
        Number.isFinite(day.count) &&
        Number.isFinite(day.level),
    )
  );
}

async function fetchOwnContributions(
  year: number,
  signal: AbortSignal,
): Promise<ContributionsResponse> {
  const response = await fetch(
    `${CONTRIBUTIONS_API_BASE_URL}/api/github/contributions?year=${year}`,
    { signal, cache: "no-store" },
  );
  if (!response.ok) {
    throw new Error("GitHub contribution data request failed");
  }

  const result: unknown = await response.json();
  if (!isValidContributions(result)) {
    throw new Error("GitHub contribution data was invalid");
  }
  return result;
}

type PublicContributionsResponse = {
  total: Record<string, number>;
  contributions: ContributionDay[];
};

async function fetchPublicContributions(
  year: number,
  signal: AbortSignal,
): Promise<ContributionsResponse> {
  const yearKey = year === CURRENT_YEAR ? "last" : String(year);
  const response = await fetch(`${PUBLIC_CONTRIBUTIONS_API_URL}?y=${yearKey}`, {
    signal,
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Public GitHub contribution data request failed");
  }

  const result = (await response.json()) as PublicContributionsResponse;
  const today = new Date().toISOString().slice(0, 10);
  const contributions = (result.contributions ?? [])
    .filter((day) => day.date <= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  const normalized = {
    total:
      result.total?.[year === CURRENT_YEAR ? "lastYear" : String(year)] ??
      contributions.reduce((sum, day) => sum + day.count, 0),
    contributions,
  };
  if (!isValidContributions(normalized)) {
    throw new Error("Public GitHub contribution data was invalid");
  }
  return normalized;
}

export default function GitHubShowcase() {
  const { t, locale } = useI18n();
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [contributionDays, setContributionDays] = useState<ContributionDay[] | null>(null);
  const [contributionTotal, setContributionTotal] = useState(0);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [contributionsLoading, setContributionsLoading] = useState(true);
  const [contributionsError, setContributionsError] = useState(false);
  const [contributionsUpdatedAt, setContributionsUpdatedAt] = useState<Date | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const graphScrollRef = useRef<HTMLDivElement>(null);

  // On narrow screens the graph scrolls; start at the most recent weeks.
  useEffect(() => {
    const graph = graphScrollRef.current;
    if (graph) {
      graph.scrollLeft = graph.scrollWidth;
    }
  }, [contributionDays]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadGitHubData() {
      try {
        const profileResponse = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}`,
          { signal: controller.signal },
        );

        if (!profileResponse.ok) {
          throw new Error("GitHub data request failed");
        }

        const profile = (await profileResponse.json()) as GitHubProfile;
        setData({ profile });
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
          return;
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadGitHubData();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadContributions() {
      setContributionsLoading(true);
      try {
        let result: ContributionsResponse;
        try {
          result = await fetchOwnContributions(selectedYear, controller.signal);
        } catch (ownApiError) {
          if (controller.signal.aborted) {
            throw ownApiError;
          }
          // The static GitHub Pages build has no API server of its own.
          result = await fetchPublicContributions(selectedYear, controller.signal);
        }

        setContributionDays(result.contributions);
        setContributionTotal(result.total);
        setContributionsUpdatedAt(new Date());
        setContributionsError(false);
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
          return;
        }
        setContributionsError(true);
      } finally {
        if (!controller.signal.aborted) {
          setContributionsLoading(false);
        }
      }
    }

    void loadContributions();
    const refreshInterval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void loadContributions();
      }
    }, 30 * 60 * 1000);

    return () => {
      controller.abort();
      window.clearInterval(refreshInterval);
    };
  }, [refreshKey, selectedYear]);

  const leadingEmptyDays = contributionDays?.length
    ? new Date(`${contributionDays[0].date}T00:00:00Z`).getUTCDay()
    : 0;
  const contributionWeekCount = contributionDays
    ? Math.ceil((leadingEmptyDays + contributionDays.length) / 7)
    : 0;
  const contributionMonthsByWeek = new Map<number, string>();
  contributionDays?.forEach((day, index) => {
    const date = new Date(`${day.date}T00:00:00Z`);
    if (date.getUTCDate() === 1) {
      contributionMonthsByWeek.set(
        Math.floor((leadingEmptyDays + index) / 7),
        date.toLocaleString(locale, { month: "short", timeZone: "UTC" }),
      );
    }
  });
  // Label the partial first month too, as GitHub does, when there's room before the next label.
  if (contributionDays?.length && !contributionMonthsByWeek.has(0)) {
    const nextLabelledWeek = Math.min(...contributionMonthsByWeek.keys());
    if (nextLabelledWeek >= 3) {
      contributionMonthsByWeek.set(
        0,
        new Date(`${contributionDays[0].date}T00:00:00Z`).toLocaleString(locale, {
          month: "short",
          timeZone: "UTC",
        }),
      );
    }
  }
  // Drop a label that starts too close to the right edge to fit.
  contributionMonthsByWeek.forEach((_, weekIndex) => {
    if (weekIndex > contributionWeekCount - 2) {
      contributionMonthsByWeek.delete(weekIndex);
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7 }}
      className="mt-12 sm:mt-16"
    >
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold">
          <Github className="w-4 h-4" />
          {t.github.eyebrow}
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {t.github.heading}
        </h3>
        <p className="text-muted-foreground max-w-2xl">
          {t.github.intro}
        </p>
      </div>

      <div className="grid lg:grid-cols-[minmax(250px,0.8fr)_minmax(0,1.8fr)] gap-6">
        <div className="rounded-2xl bg-foreground text-background p-6 sm:p-8 flex flex-col justify-between min-h-[250px]">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="w-16 h-16 rounded-full bg-background/20" />
              <div className="h-5 w-40 rounded bg-background/20" />
              <div className="h-4 w-52 rounded bg-background/20" />
            </div>
          ) : data ? (
            <>
              <div>
                <img
                  src={data.profile.avatar_url}
                  alt={t.github.avatarAlt(data.profile.login)}
                  className="w-16 h-16 rounded-full object-cover border-2 border-background/30 mb-5"
                />
                <h4 className="text-xl font-bold">
                  {data.profile.name || data.profile.login}
                </h4>
                <p className="text-sm text-background/65 mt-1">
                  @{data.profile.login}
                </p>
                {data.profile.bio && (
                  <p className="text-sm text-background/75 leading-relaxed mt-4">
                    {data.profile.bio}
                  </p>
                )}
              </div>

              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs text-background/70">
                {data.profile.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {data.profile.location}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" />
                  {t.github.publicRepos(data.profile.public_repos)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  {t.github.followers(data.profile.followers)}
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-between h-full gap-8">
              <div>
                <Github className="w-10 h-10 mb-5" />
                <h4 className="text-xl font-bold">{t.github.visitProfile}</h4>
                <p className="text-sm text-background/70 mt-2">
                  {t.github.unavailable}
                </p>
              </div>
              <a
                href={GITHUB_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold hover:opacity-70 transition-opacity"
              >
                {t.github.openGithub} <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {data && (
            <a
              href={data.profile.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold hover:opacity-70 transition-opacity"
            >
              {t.github.viewFullProfile} <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4 text-[#f0f6fc] sm:p-6 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <p className="text-base font-semibold">
              {t.github.contributions(
                contributionTotal,
                selectedYear === CURRENT_YEAR ? null : selectedYear,
              )}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRefreshKey((key) => key + 1)}
                disabled={contributionsLoading}
                aria-label={t.github.refresh}
                title={t.github.refresh}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-[#30363d] text-[#8b949e] transition-colors hover:bg-[#161b22] hover:text-[#f0f6fc] disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${contributionsLoading ? "animate-spin" : ""}`}
                />
              </button>
              <div className="relative">
                <label className="sr-only" htmlFor="contribution-year">
                  {t.github.yearLabel}
                </label>
                <select
                  id="contribution-year"
                  value={selectedYear}
                  onChange={(event) => {
                    setSelectedYear(Number(event.target.value));
                    setContributionDays(null);
                    setContributionTotal(0);
                    setContributionsError(false);
                  }}
                  className="h-9 appearance-none rounded-md border border-[#1f6feb] bg-[#0969da] py-0 pl-4 pr-9 text-sm font-medium text-white outline-none transition-colors hover:bg-[#0757bd] focus:ring-2 focus:ring-[#58a6ff]"
                >
                  {Array.from(
                    { length: CURRENT_YEAR - 2014 },
                    (_, index) => CURRENT_YEAR - index,
                  ).map((year) => (
                    <option
                      key={year}
                      value={year}
                      className="bg-[#0d1117] text-[#f0f6fc]"
                    >
                      {year}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white"
                />
              </div>
              <a
                href={`${GITHUB_PROFILE_URL}?tab=overview`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.github.viewProfile}
                title={t.github.viewProfile}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-[#30363d] text-[#8b949e] transition-colors hover:bg-[#161b22] hover:text-[#f0f6fc]"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="rounded-lg border border-[#30363d] px-3 py-4 sm:px-5 sm:py-5">
            {contributionDays ? (
              <div ref={graphScrollRef} dir="ltr" className="overflow-x-auto pb-1">
                <ContributionSnakeGrid
                  days={contributionDays}
                  leadingEmptyDays={leadingEmptyDays}
                  weekCount={contributionWeekCount}
                  monthsByWeek={contributionMonthsByWeek}
                  weekdays={t.github.weekdays}
                  colors={CONTRIBUTION_LEVEL_COLORS}
                  ariaLabel={`${t.github.graphLabel(GITHUB_USERNAME)}: ${t.github.contributions(contributionTotal, selectedYear === CURRENT_YEAR ? null : selectedYear)}`}
                  dayTitle={(day) =>
                    t.github.dayTitle(
                      day.count,
                      new Date(`${day.date}T00:00:00Z`).toLocaleDateString(locale, { timeZone: "UTC" }),
                    )
                  }
                />
              </div>
            ) : (
              <p className="py-8 text-sm text-[#8b949e]">
                {contributionsLoading
                  ? t.github.loading
                  : t.github.activityUnavailable}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#8b949e]">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <a
                  href={CONTRIBUTIONS_DOCS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-2 hover:text-[#58a6ff] hover:underline"
                >
                  {t.github.learnCount}
                </a>
                <span aria-live="polite">
                  {contributionsError
                    ? t.github.couldntRefresh
                    : contributionsUpdatedAt
                      ? t.github.lastChecked(
                          contributionsUpdatedAt.toLocaleTimeString(locale, {
                            hour: "numeric",
                            minute: "2-digit",
                          }),
                        )
                      : t.github.loadingLive}
                </span>
              </div>
              <div
                role="img"
                aria-label={t.github.levels}
                className="flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>{t.github.less}</span>
                {CONTRIBUTION_LEVEL_COLORS.map((color, index) => (
                  <span
                    key={index}
                    className="h-3 w-3 rounded-[3px] border border-white/5"
                    style={{ backgroundColor: color }}
                  />
                ))}
                <span>{t.github.more}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}