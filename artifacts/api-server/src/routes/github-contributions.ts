import { ReplitConnectors } from "@replit/connectors-sdk";
import {
  GetGithubContributionsQueryParams,
  GetGithubContributionsResponse,
} from "@workspace/api-zod";
import { Router, type IRouter } from "express";

const GITHUB_USERNAME = "wintas01";

const CONTRIBUTION_LEVELS = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
} as const;

type ContributionLevel = keyof typeof CONTRIBUTION_LEVELS;

type GitHubContributionDay = {
  date: string;
  contributionCount: number;
  contributionLevel: ContributionLevel;
};

type GitHubGraphQLResponse = {
  data?: {
    viewer?: { login: string } | null;
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: Array<{ contributionDays: GitHubContributionDay[] }>;
        } | null;
      } | null;
    } | null;
  } | null;
  errors?: Array<{ message: string }>;
};

const CONTRIBUTIONS_QUERY = `
  query Contributions($login: String!, $from: DateTime!, $to: DateTime!) {
    viewer {
      login
    }
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

const router: IRouter = Router();

function getContributionRange(year: number): { from: string; to: string } {
  const now = new Date();

  if (year === now.getUTCFullYear()) {
    const today = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
    const from = new Date(today);
    from.setUTCDate(from.getUTCDate() - from.getUTCDay() - 52 * 7);

    const to = new Date(today);
    to.setUTCHours(23, 59, 59, 999);

    return { from: from.toISOString(), to: to.toISOString() };
  }

  return {
    from: new Date(Date.UTC(year, 0, 1)).toISOString(),
    to: new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999)).toISOString(),
  };
}

router.get("/github/contributions", async (req, res): Promise<void> => {
  res.setHeader("Cache-Control", "no-store");

  const parsedQuery = GetGithubContributionsQueryParams.safeParse(req.query);
  const currentYear = new Date().getUTCFullYear();

  if (
    !parsedQuery.success ||
    !Number.isInteger(parsedQuery.data.year) ||
    parsedQuery.data.year > currentYear
  ) {
    res.status(400).json({ error: "Choose a valid contribution year." });
    return;
  }

  const { from, to } = getContributionRange(parsedQuery.data.year);

  try {
    const connectors = new ReplitConnectors();
    const response = await connectors.proxy("github", "/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: { login: GITHUB_USERNAME, from, to },
      }),
    });
    const result = (await response.json()) as GitHubGraphQLResponse;
    const viewerLogin = result.data?.viewer?.login;
    const calendar =
      result.data?.user?.contributionsCollection?.contributionCalendar;

    if (
      !response.ok ||
      result.errors?.length ||
      viewerLogin?.toLowerCase() !== GITHUB_USERNAME ||
      !calendar
    ) {
      req.log.error(
        { statusCode: response.status },
        "GitHub contribution data request failed",
      );
      res
        .status(502)
        .json({ error: "GitHub contribution activity is unavailable." });
      return;
    }

    const contributions = calendar.weeks.flatMap((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: CONTRIBUTION_LEVELS[day.contributionLevel],
      })),
    );

    const data = GetGithubContributionsResponse.parse({
      total: calendar.totalContributions,
      contributions,
    });

    res.json(data);
  } catch {
    req.log.error("GitHub contribution data request failed");
    res
      .status(502)
      .json({ error: "GitHub contribution activity is unavailable." });
  }
});

export default router;
