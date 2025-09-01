import { GitHubProfile, JobApplication, User } from '@prisma/client';
import prisma from '../prisma';
import { ContributionCalendar, ContributionDay, ContributionsCollection, ContributionWeek, PullRequests, Repositories, RepositoryNode } from '@/types/graphql';

export type HeaderAnalyticsData = {
  jobTitle: string;
  totalApplicants: number;
  avgGithubContributions: number;
  avgHackathons: number;
  devsportParticipation: number;
} | null;

export type CandidateAnalyticsData = {
  id: string;
  avatarUrl: string | null;
  name: string | null;
  email: string | null;
  location: string | null;
  overallScore: number | null;
  githubScore: number | null;
  contributions: number | null;
  hackathonsScore: number | null;
  experience: number | null;
  currentRole: string | null;
  status: string | null;
} | null;


export type CandidateProfileDataType = {
  email : User['email'];
  firstName: JobApplication['firstName'] | null;
  lastName : JobApplication['lastName'] | null;
  institution: JobApplication['institution'] | null;
  fieldOfStudy: JobApplication['fieldOfStudy'] | null;
  graduationYear: JobApplication['graduationYear'] | null;
  linkedinUrl : JobApplication['linkedinUrl'] | null;
  portfolioUrl : JobApplication['portfolioUrl'] | null;
  whyInterested : JobApplication['whyInterested'] | null;
  appliedOn : JobApplication['createdAt'] | undefined;

  github: {
    name: GitHubProfile['name'],
    login: GitHubProfile['login'],
    avatarUrl: GitHubProfile['avatarUrl'],
    bioHTML: GitHubProfile['bioHTML'],
    followers: GitHubProfile['followersCount'],
    following: GitHubProfile['followingCount'],
    url: GitHubProfile['url'],
    location: GitHubProfile['location'],
    githubCreatedAt: GitHubProfile['githubCreatedAt'],

    repositoriesCount: number | null,
    totalContributions: number | null,
    longestStreak : number | null,
    languageData: { [key: string]: { count: number; color: string | null } },
    contributionStats : {
      mostActiveDay: string,
      weeklyAverage: string,
      contributionsPerDay: string,
      activeDaysPerWeek: string,
      currentStreak : number,
      pullRequests: number,
    },

    repositories: Repositories["nodes"],
    } | null;
} | null;

export async function getHeaderAnalytics(jobId: string): Promise<HeaderAnalyticsData> {
  // Get job and related applications
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      JobApplication: true
    }
  });

  if (!job) return null;

  const applications = job.JobApplication;

  const totalApplicants = applications.length;
  ////////////////////////////   for now this is incorrect
  // Calculate averages
  const githubContributions = applications.map(app => (true ? 1 : 0));
  const hackathonCounts = applications.map(app => {
    return true ? 1 : 0;
  });
  const devsportParticipation = applications.filter(app => true).length;

  const avgGithubContributions = Math.round(
    githubContributions.reduce((a, b) => a + b, 0 as number) / Math.max(totalApplicants, 1) * 1000 // Simulated logic
  );

  const avgHackathons = parseFloat(
    (hackathonCounts.reduce((a, b) => a + b, 0 as number) / Math.max(totalApplicants, 1)).toFixed(1)
  );

  const devsportPercent = totalApplicants > 0
    ? parseFloat(((devsportParticipation / totalApplicants) * 100).toFixed(1))
    : 0;

  return {
    jobTitle: job.title,
    totalApplicants,
    avgGithubContributions,
    avgHackathons,
    devsportParticipation: devsportPercent
  };
}



export async function getCandidateAnalytics(jobId: string): Promise<CandidateAnalyticsData[]> {
  // Fetch all job applications for the given jobId
  const jobApplications = await prisma.jobApplication.findMany({
    where: { jobId },
    include: {
      user: {
        include: {
          githubProfile: true,  // Include GitHub profile data
        },
      },
    },
  });

  // If no job applications exist, return null
  if (jobApplications.length === 0) {
    return [];
  }

  // Map through the job applications to gather candidate analytics data
  const candidateAnalytics = jobApplications.map(app => {
    const user = app.user;
    const githubProfile = user.githubProfile;

    return {
      id: user.id,
      avatarUrl: githubProfile?.avatarUrl ?? null,
      name: githubProfile?.name ?? null,
      email: user.email,
      location: githubProfile?.location ?? null,
      // overallScore: calculateOverallScore(githubProfile, app),
      // githubScore: calculateGithubScore(githubProfile),
      overallScore: 0,
      githubScore: 0,
      contributions: (githubProfile?.contributionsCollection as ContributionsCollection).contributionCalendar.totalContributions ?? 0,
      hackathonsScore: 0,  // Assuming no hackathons data for now, can be expanded
      experience: 0,  // Assuming no experience data for now, can be expanded
      currentRole: user.role,
      status: true ? 'Connected' : 'Not Connected', // Example of status based on GitHub connection
    };
  });
  return candidateAnalytics.length > 0 ? candidateAnalytics : [];
}

// Example function to calculate overall score based on some criteria
// function calculateOverallScore(githubProfile: {
//   contributionsTotal: number; name: string; id: string; location: string | null; createdAt: Date; updatedAt: Date; userId: string; accessToken: string; githubCreatedAt: Date | null; login: string; url: string | null; bioHTML: string | null; avatarUrl: string | null; followersCount: number; followingCount: number; contributionsCollection: JsonValue | null; repositories: JsonValue | null; Contributions: JsonValue | null; pullRequests: JsonValue | null; issues: JsonValue | null; CodeReviewActivity: JsonValue | null; 
// } | null, application: { user: { githubProfile: { name: string; id: string; location: string | null; createdAt: Date; updatedAt: Date; userId: string; accessToken: string; githubCreatedAt: Date | null; login: string; url: string | null; bioHTML: string | null; avatarUrl: string | null; followersCount: number; followingCount: number; contributionsCollection: JsonValue | null; repositories: JsonValue | null; Contributions: JsonValue | null; pullRequests: JsonValue | null; issues: JsonValue | null; CodeReviewActivity: JsonValue | null; } | null; } & { name: string | null; id: string; createdAt: Date; updatedAt: Date; firstName: string; lastName: string; email: string; emailVerified: Date | null; company: string | null; password: string | null; image: string | null; role: string; githubProfileId: string | null; }; } & { id: string; createdAt: Date; userId: string; firstName: string; lastName: string; email: string; jobId: string; phone: string; city: string; educationLevel: $Enums.EducationLevel; institution: string | null; fieldOfStudy: string | null; graduationYear: string | null; experience: $Enums.ExperienceEnum; skills: string[]; linkedinUrl: string | null; portfolioUrl: string | null; whyInterested: string; termsAccepted: boolean; }): number {
//   // Placeholder logic for calculating score, can be expanded based on your needs
//   let score = 0;
//   if (githubProfile) {
//     score += githubProfile.followersCount * 0.1;  // Example multiplier for followers count
//     score += githubProfile.contributionsTotal ?? 0;  // Example: Add total contributions
//   }
//   score += true ? 10 : 0;  // Add a score boost if GitHub is connected

//   return score;
// }

// Example function to calculate GitHub score (just an example logic)
// function calculateGithubScore(githubProfile): number {
//   let score = 0;
//   if (githubProfile) {
//     score += githubProfile.followersCount * 0.1;  // Example multiplier for followers count
//     score += githubProfile.repositoriesCount * 0.05;  // Example multiplier for repositories
//   }
//   return score;
// }


function calculateLongestStreak(contributionCalendar: ContributionCalendar) {
  const days = contributionCalendar.weeks.flatMap((week: ContributionWeek) => week.contributionDays);

  let currentStreak = 0;
  let longestStreak = 0;

  for (const day of days) {
    if (day.contributionCount > 0) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return longestStreak;
}


function extractLanguageData(nodes: RepositoryNode[]) {
  const languageData : Record<string, { count: number; color: string | null }> = {};

  for (const repo of nodes) {
    if (!repo.languages) continue;

    for (const edge of repo.languages.edges) {
      const lang = edge.node.name;
      const color = edge.node.color;

      if (!languageData[lang]) {
        languageData[lang] = { count: 0, color };
      }
      languageData[lang].count += 1;
    }
  }

  return languageData;
}


function extractContributionStats(contributionCalendar: { totalContributions: number; weeks: ContributionWeek[]; }, pullRequestsCount: number) {
  const weeks = contributionCalendar.weeks;
  const allDays = weeks.flatMap((w: ContributionWeek) => w.contributionDays);

  // Most Active Day
  const mostActive = allDays.reduce((a: ContributionDay, b: ContributionDay) =>
    b.contributionCount > a.contributionCount ? b : a
  );

  const totalContributions = contributionCalendar.totalContributions;
  const numberOfWeeks = weeks.length;
  const numberOfDays = allDays.length;
  // Metrics
  const weeklyAverage = totalContributions / numberOfWeeks;
  const contributionsPerDay = totalContributions / numberOfDays;
  const activeDays = allDays.filter((d: { contributionCount: number; }) => d.contributionCount > 0).length;
  const activeDaysPerWeek = activeDays / numberOfWeeks;

  // Current streak
  let currentStreak = 0;
  for (let i = allDays.length - 1; i >= 0; i--) {
    if (allDays[i].contributionCount > 0) currentStreak++;
    else break;
  }

  return {
    mostActiveDay: `${mostActive.date}: ${mostActive.contributionCount} contributions`,
    weeklyAverage: weeklyAverage.toFixed(1),
    contributionsPerDay: contributionsPerDay.toFixed(1),
    activeDaysPerWeek: activeDaysPerWeek.toFixed(1),
    currentStreak,
    pullRequests: pullRequestsCount
  };
}




export async function getCandidateProfile(jobId: string, candidateId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: candidateId,
    },
    include: {
      githubProfile: true,
      JobApplication: true,
    },
  });
  if (!user) return null;

  const jobApplication = user?.JobApplication.find(app => app.jobId === jobId) || null;
  // console.log(jobApplication)
  const githubProfile = user.githubProfile;
  const repositories = githubProfile?.repositories as Repositories;
  const contributionsCollection = githubProfile?.contributionsCollection as ContributionsCollection;
  const pullRequests = githubProfile?.pullRequests as PullRequests;
  const candidateProfile : CandidateProfileDataType = {
    email: user.email,
    firstName: jobApplication?.firstName || null,
    lastName: jobApplication?.lastName || null,
    institution: jobApplication?.institution || null,
    fieldOfStudy: jobApplication?.fieldOfStudy || null,
    graduationYear: jobApplication?.graduationYear || null,
    linkedinUrl: jobApplication?.linkedinUrl || null,
    portfolioUrl: jobApplication?.portfolioUrl || null,
    whyInterested: jobApplication?.whyInterested || null,
    appliedOn: jobApplication?.createdAt || undefined,

    github: githubProfile
      ? {
          name: githubProfile.name,
          login: githubProfile.login,
          avatarUrl: githubProfile.avatarUrl,
          bioHTML: githubProfile.bioHTML,
          followers: githubProfile.followersCount,
          following: githubProfile.followingCount,
          url: githubProfile.url,
          location: githubProfile.location,
          githubCreatedAt: githubProfile.githubCreatedAt,

          repositoriesCount: repositories.totalCount,
          totalContributions: contributionsCollection.contributionCalendar.totalContributions,
          longestStreak: calculateLongestStreak(contributionsCollection.contributionCalendar),
          languageData: extractLanguageData(repositories.nodes),
          contributionStats: extractContributionStats(contributionsCollection.contributionCalendar, pullRequests.totalCount),

          repositories: repositories.nodes || [],
        }
      : null,
  };

  return candidateProfile;
}

