import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  ExternalLink,
  GitFork,
  Github,
  MapPin,
  Star,
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

type GitHubRepository = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
};

type GitHubData = {
  profile: GitHubProfile;
  repositories: GitHubRepository[];
};

function formatUpdatedDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default function GitHubShowcase() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadGitHubData() {
      try {
        const [profileResponse, repositoriesResponse] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
            signal: controller.signal,
          }),
          fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=6&type=owner`,
            { signal: controller.signal },
          ),
        ]);

        if (!profileResponse.ok || !repositoriesResponse.ok) {
          throw new Error("GitHub data request failed");
        }

        const profile = (await profileResponse.json()) as GitHubProfile;
        const repositories = (await repositoriesResponse.json()) as GitHubRepository[];

        setData({
          profile,
          repositories: repositories.filter((repository) => !repository.fork),
        });
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
          return;
        }
        setError(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadGitHubData();
    return () => controller.abort();
  }, []);

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
                Updated directly from GitHub
              </p>
            </div>
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
          <div className="rounded-xl border border-border bg-card p-3 sm:p-5 overflow-x-auto">
            <img
              src={`https://ghchart.rshah.org/${GITHUB_USERNAME}`}
              alt={`GitHub contribution graph for ${GITHUB_USERNAME}`}
              className="min-w-[680px] w-full h-auto"
              loading="lazy"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            {error
              ? "Live repository details are unavailable right now, but the contribution graph and profile link remain available."
              : "Repository data refreshes when this page loads."}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-40 rounded-2xl border border-border bg-background animate-pulse"
            />
          ))}
        </div>
      ) : data && data.repositories.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {data.repositories.map((repository) => (
            <a
              key={repository.id}
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-border bg-background p-5 hover:border-foreground/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-semibold truncate group-hover:underline underline-offset-4">
                  {repository.name}
                </h4>
                <ExternalLink className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3 min-h-[3rem] line-clamp-2">
                {repository.description || "A project from my GitHub workspace."}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground mt-5">
                {repository.language && (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-foreground" />
                    {repository.language}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Star className="w-3.5 h-3.5" />
                  {repository.stargazers_count}
                </span>
                <span className="inline-flex items-center gap-1">
                  <GitFork className="w-3.5 h-3.5" />
                  {repository.forks_count}
                </span>
              </div>
              <p className="text-xs text-muted-foreground/75 mt-4">
                Updated {formatUpdatedDate(repository.updated_at)}
              </p>
            </a>
          ))}
        </div>
      ) : null}
    </motion.div>
  );
}