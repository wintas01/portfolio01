import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  ExternalLink,
  Github,
  MapPin,
  RefreshCw,
  Users,
} from "lucide-react";

const GITHUB_USERNAME = "wintas01";
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;

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
  total?: {
    lastYear?: number;
  };
  contributions: ContributionDay[];
};

const CONTRIBUTION_LEVEL_CLASSES = [
  "bg-muted-foreground/10",
  "bg-green-200 dark:bg-green-900",
  "bg-green-400 dark:bg-green-700",
  "bg-green-500 dark:bg-green-600",
  "bg-green-700 dark:bg-green-500",
];

export default function GitHubShowcase() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [contributionDays, setContributionDays] = useState<ContributionDay[] | null>(null);
  const [contributionTotal, setContributionTotal] = useState(0);
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
          `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last&refresh=${Date.now()}`,
          { signal: controller.signal, cache: "no-store" },
        );
        if (!response.ok) {
          throw new Error("GitHub contribution data request failed");
        }

        const result = (await response.json()) as ContributionsResponse;
        if (
          !Array.isArray(result.contributions) ||
          !result.contributions.every(
            (day) =>
              typeof day.date === "string" &&
              Number.isFinite(day.count) &&
              Number.isFinite(day.level),
          )
        ) {
          throw new Error("GitHub contribution data was invalid");
        }

        setContributionDays(result.contributions);
        setContributionTotal(
          result.total?.lastYear ??
            result.contributions.reduce((total, day) => total + day.count, 0),
        );
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
  }, [refreshKey]);

  const contributionWeekCount = contributionDays
    ? Math.ceil(contributionDays.length / 7)
    : 0;
  const contributionMonthsByWeek = new Map<number, string>();
  contributionDays?.forEach((day, index) => {
    const date = new Date(`${day.date}T00:00:00Z`);
    if (date.getUTCDate() === 1) {
      contributionMonthsByWeek.set(
        Math.floor(index / 7),
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

        <div className="rounded-2xl bg-background border border-border p-5 sm:p-8 overflow-hidden">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <p className="font-semibold">Contribution activity</p>
              <p className="text-sm text-muted-foreground mt-1">
                {contributionDays
                  ? `${contributionTotal} contributions in the last year`
                  : "Live from GitHub"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRefreshKey((key) => key + 1)}
                disabled={contributionsLoading}
                aria-label="Refresh contribution activity"
                title="Refresh contribution activity"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-card transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${contributionsLoading ? "animate-spin" : ""}`}
                />
              </button>
              <a
                href={`${GITHUB_PROFILE_URL}?tab=overview`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View GitHub contribution activity"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-card transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 sm:p-5 overflow-x-auto">
            {contributionDays ? (
              <div className="min-w-[680px]">
                <div
                  aria-hidden="true"
                  className="mb-2 w-max text-[10px] leading-none text-muted-foreground"
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${contributionWeekCount}, 10px)`,
                    columnGap: "3px",
                  }}
                >
                  {Array.from({ length: contributionWeekCount }, (_, weekIndex) => (
                    <span key={weekIndex} className="whitespace-nowrap">
                      {contributionMonthsByWeek.get(weekIndex) ?? ""}
                    </span>
                  ))}
                </div>
                <div
                  role="img"
                  aria-label={`GitHub contributions for ${GITHUB_USERNAME}: ${contributionTotal} in the last year`}
                  className="grid w-max grid-flow-col grid-rows-7 gap-[3px]"
                  style={{
                    gridAutoColumns: "10px",
                    gridTemplateRows: "repeat(7, 10px)",
                  }}
                >
                  {contributionDays.map((day) => {
                    const level = Math.min(
                      Math.max(Math.round(day.level), 0),
                      CONTRIBUTION_LEVEL_CLASSES.length - 1,
                    );
                    return (
                      <span
                        key={day.date}
                        title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${new Date(`${day.date}T00:00:00`).toLocaleDateString()}`}
                        className={`rounded-[2px] ${CONTRIBUTION_LEVEL_CLASSES[level]}`}
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="py-8 text-sm text-muted-foreground">
                {contributionsLoading
                  ? "Loading contribution activity…"
                  : "Contribution activity is unavailable right now."}
              </p>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>
              {contributionsError
                ? "Couldn’t refresh activity. Showing the last available data."
                : contributionsUpdatedAt
                  ? `Last checked ${contributionsUpdatedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
                  : "Contribution activity is loaded from GitHub."}
            </p>
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span>Less</span>
              {CONTRIBUTION_LEVEL_CLASSES.map((colorClass, index) => (
                <span
                  key={index}
                  className={`h-2.5 w-2.5 rounded-[2px] ${colorClass}`}
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}