// Type for a single language on a repository
export type Language = {
  name: string;
  color: string | null;
};

// Type for a single topic on a repository
export type Topic = {
  topic: {
    name: string;
  };
};

// Type for a single repository node
export type RepositoryNode = {
  name: string;
  description: string | null;
  url: string | null;
  isFork: boolean;
  stargazerCount: number;
  forkCount: number;
  createdAt: string;
  updatedAt: string;
  primaryLanguage: Language | null;
  languages: {
    edges: {
      size: number;
      node: Language;
    }[];
  };
  repositoryTopics: {
    nodes: Topic[];
  };
};

// Type for the main repositories object
export type Repositories = {
  totalCount: number;
  nodes: RepositoryNode[];
};

// Type for a single day in the contribution calendar
export type ContributionDay = {
  contributionCount: number;
  date: string;
  color: string;
};

// Type for a week in the contribution calendar
export type ContributionWeek = {
  contributionDays: ContributionDay[];
};

// Type for the contribution calendar
export type ContributionCalendar = {
  totalContributions: number;
  weeks: ContributionWeek[];
};

// Type for the main contributionsCollection object
export type ContributionsCollection = {
  totalCommitContributions: number;
  totalPullRequestContributions: number;
  totalIssueContributions: number;
  totalRepositoriesWithContributedCommits: number;
  contributionCalendar: ContributionCalendar;
};


/////////////// PULL requests

export type PullRequests = {
  totalCount: number;
  nodes: {
    title: string;
    url: string;
    state: string;
    createdAt: string;
    mergedAt: string | null;
    additions: number;
    deletions: number;
  }[];
};