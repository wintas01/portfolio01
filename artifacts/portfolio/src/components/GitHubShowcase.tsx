import { useEffect, useState } from "react";
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

const GITHUB_USERNAME = "wintas01";
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;
const CURRENT_YEAR = new Date().getFullYear();
const CONTRIBUTIONS_API_BASE_URL = (
  import.meta.env.VITE_GITHUB_CONTRIBUTIONS_API_URL ?? ""
).replace(/\/+$/, "");
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

export default function GitHubShowcase() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [contributionDays, setContributionDays] = useState<ContributionDay[] | null>(null);
  const [contributionTotal, setContributionTotal] = useState(0);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [contributionsLoading, setContributionsLoading] = useState(true);
  const [contributionsError, setContributionsError] = useState(false);
  const [contributionsUpdatedAt, setContributionsUpdatedAt] = useState<Date | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

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
        const response = await fetch(
          `${CONTRIBUTIONS_API_BASE_URL}/api/github/contributions?year=${selectedYear}`,
          { signal: controller.signal, cache: "no-store" },
        );
        if (!response.ok) {
          throw new Error("GitHub contribution data request failed");
        }

        const result = (await response.json()) as ContributionsResponse;
        if (
          !Number.isFinite(result.total) ||
          !Array.isArray(result.contributions) ||
          !result.contributions.every(
            (day) =>
              typeof day.date === "string" &&
              /^\d{4}-\d{2}-\d{2}$/.test(day.date) &&
              Number.isFinite(day.count) &&
              Number.isFinite(day.level),
          )
        ) {
          throw new Error("GitHub contribution data was invalid");
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
        date.toLocaleString("en-US", { month: "short", timeZone: "UTC" }),
      );
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
          Live on GitHub
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Open-source work and contributions
        </h3>
        <p className="text-muted-foreground max-w-2xl">
          Follow my latest repositories and see what I&apos;ve been contributing
          to on GitHub.
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
                  alt={`${data.profile.login} GitHub avatar`}
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
                  {data.profile.public_repos} public repos
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  {data.profile.followers} followers
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-between h-full gap-8">
              <div>
                <Github className="w-10 h-10 mb-5" />
                <h4 className="text-xl font-bold">Visit my GitHub profile</h4>
                <p className="text-sm text-background/70 mt-2">
                  GitHub data is temporarily unavailable here.
                </p>
              </div>
              <a
                href={GITHUB_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold hover:opacity-70 transition-opacity"
              >
                Open GitHub <ExternalLink className="w-4 h-4" />
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
              View full profile <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4 text-[#f0f6fc] sm:p-6 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <p className="text-base font-semibold">
              {contributionTotal} contribution{contributionTotal === 1 ? "" : "s"}{" "}
              {selectedYear === CURRENT_YEAR
                ? "in the last year"
                : `in ${selectedYear}`}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRefreshKey((key) => key + 1)}
                disabled={contributionsLoading}
                aria-label="Refresh contribution activity"
                title="Refresh contribution activity"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-[#30363d] text-[#8b949e] transition-colors hover:bg-[#161b22] hover:text-[#f0f6fc] disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${contributionsLoading ? "animate-spin" : ""}`}
                />
              </button>
              <div className="relative">
                <label className="sr-only" htmlFor="contribution-year">
                  Contribution year
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
                aria-label="View GitHub profile"
                title="View GitHub profile"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-[#30363d] text-[#8b949e] transition-colors hover:bg-[#161b22] hover:text-[#f0f6fc]"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg border border-[#30363d] px-3 py-4 sm:px-5 sm:py-5">
            {contributionDays ? (
              <div className="w-max">
                <div className="mb-2 flex items-end gap-3">
                  <span aria-hidden="true" className="w-8 shrink-0" />
                  <div
                    aria-hidden="true"
                    className="text-xs leading-none text-[#8b949e]"
                    style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${contributionWeekCount}, 11px)`,
                      columnGap: "3px",
                    }}
                  >
                    {Array.from({ length: contributionWeekCount }, (_, weekIndex) => (
                      <span key={weekIndex} className="whitespace-nowrap">
                        {contributionMonthsByWeek.get(weekIndex) ?? ""}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <div
                    aria-hidden="true"
                    className="grid w-8 shrink-0 grid-rows-7 gap-[3px] text-[10px] leading-[11px] text-[#8b949e]"
                  >
                    <span />
                    <span>Mon</span>
                    <span />
                    <span>Wed</span>
                    <span />
                    <span>Fri</span>
                    <span />
                  </div>
                  <div
                    role="img"
                    aria-label={`GitHub contributions for ${GITHUB_USERNAME}: ${contributionTotal} ${selectedYear === CURRENT_YEAR ? "in the last year" : `in ${selectedYear}`}`}
                    className="grid w-max grid-flow-col grid-rows-7 gap-[3px]"
                    style={{
                      gridAutoColumns: "11px",
                      gridTemplateRows: "repeat(7, 11px)",
                    }}
                  >
                    {Array.from({ length: leadingEmptyDays }, (_, index) => (
                      <span key={`leading-${index}`} aria-hidden="true" />
                    ))}
                    {contributionDays.map((day) => {
                      const level = Math.min(
                        Math.max(Math.round(day.level), 0),
                        CONTRIBUTION_LEVEL_COLORS.length - 1,
                      );
                      return (
                        <span
                          key={day.date}
                          title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${new Date(`${day.date}T00:00:00Z`).toLocaleDateString()}`}
                          className="rounded-[2px] transition-colors"
                          style={{ backgroundColor: CONTRIBUTION_LEVEL_COLORS[level] }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <p className="py-8 text-sm text-[#8b949e]">
                {contributionsLoading
                  ? "Loading contribution activity…"
                  : "Contribution activity is unavailable right now."}
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
                  Learn how we count contributions
                </a>
                <span aria-live="polite">
                  {contributionsError
                    ? "Couldn’t refresh activity."
                    : contributionsUpdatedAt
                      ? `Last checked ${contributionsUpdatedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
                      : "Loading live activity"}
                </span>
              </div>
              <div
                role="img"
                aria-label="Contribution levels from less to more"
                className="flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>Less</span>
                {CONTRIBUTION_LEVEL_COLORS.map((color, index) => (
                  <span
                    key={index}
                    className="h-3 w-3 rounded-[3px] border border-white/5"
                    style={{ backgroundColor: color }}
                  />
                ))}
                <span>More</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}