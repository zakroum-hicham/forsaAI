import prisma from '../prisma';

type HeaderAnalyticsData = {
  jobTitle: string;
  totalApplicants: number;
  avgGithubContributions: number;
  avgHackathons: number;
  devsportParticipation: number;
};

type CandidateAnalyticsData = {
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
};

export type CandidateProfileData = {
  email : string | null;
  firstName: string | null;
  lastName : string | null;
  institution: string | null;
  fieldOfStudy: string | null;
  graduationYear: number | null;
  linkedinUrl : string | null;
  portfolioUrl : string | null;
  whyInterested : string | null;
  appliedOn : string;

  github: {
    name : string,
    login: string ,
    avatarUrl: string,
    bioHTML: string | null,
    followers: number | null,
    following: number | null,
    url: string | null,
    location: string | null,
    githubCreatedAt: string,

    repositoriesCount: number | null,
    totalContributions: number | null,
    longestStreak : number | null,
    languageData: { [key: string]: { count: number; color: string | null } },
    contributionStats: any,

    repositories: any | [],
    } | null;
} | null;
export async function getHeaderAnalytics(jobId: string): Promise<HeaderAnalyticsData | null> {
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
  const githubContributions = applications.map(app => (app.githubConnected ? 1 : 0));
  const hackathonCounts = applications.map(app => {
    return app.devpostUsername ? 1 : 0;
  });
  const devsportParticipation = applications.filter(app => app.devpostUsername).length;

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



export async function getCandidateAnalytics(jobId: string): Promise<CandidateAnalyticsData | null> {
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
    return null;
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
      overallScore: calculateOverallScore(githubProfile, app),
      githubScore: calculateGithubScore(githubProfile),
      contributions: githubProfile?.contributionsCalendar?.totalContributions ?? 0,
      hackathonsScore: 0,  // Assuming no hackathons data for now, can be expanded
      experience: 0,  // Assuming no experience data for now, can be expanded
      currentRole: user.role,
      status: app.githubConnected ? 'Connected' : 'Not Connected', // Example of status based on GitHub connection
    };
  });
  return candidateAnalytics.length > 0 ? candidateAnalytics : null;
}

// Example function to calculate overall score based on some criteria
function calculateOverallScore(githubProfile: any, application: any): number {
  // Placeholder logic for calculating score, can be expanded based on your needs
  let score = 0;
  if (githubProfile) {
    score += githubProfile.followersCount * 0.1;  // Example multiplier for followers count
    score += githubProfile.contributionsTotal ?? 0;  // Example: Add total contributions
  }
  score += application.githubConnected ? 10 : 0;  // Add a score boost if GitHub is connected

  return score;
}

// Example function to calculate GitHub score (just an example logic)
function calculateGithubScore(githubProfile: any): number {
  let score = 0;
  if (githubProfile) {
    score += githubProfile.followersCount * 0.1;  // Example multiplier for followers count
    score += githubProfile.repositoriesCount * 0.05;  // Example multiplier for repositories
  }
  return score;
}


function calculateLongestStreak(contributionCalendar: any) {
  const days = contributionCalendar.weeks.flatMap((week :any) => week.contributionDays);

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


function extractLanguageData(repositories: any) {
  const languageData = {};

  for (const repo of repositories) {
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


function extractContributionStats(contributionCalendar: any, pullRequestsCount: number) {
  const weeks = contributionCalendar.weeks;
  const allDays = weeks.flatMap((w: any) => w.contributionDays);

  // Most Active Day
  const mostActive = allDays.reduce((a: any, b: any) =>
    b.contributionCount > a.contributionCount ? b : a
  );

  const totalContributions = contributionCalendar.totalContributions;
  const numberOfWeeks = weeks.length;
  const numberOfDays = allDays.length;
  // Metrics
  const weeklyAverage = totalContributions / numberOfWeeks;
  const contributionsPerDay = totalContributions / numberOfDays;
  const activeDays = allDays.filter((d: any) => d.contributionCount > 0).length;
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
  const candidateProfile : CandidateProfileData = {
    email: user.email,
    firstName: jobApplication?.firstName || null,
    lastName: jobApplication?.lastName || null,
    institution: jobApplication?.institution || null,
    fieldOfStudy: jobApplication?.fieldOfStudy || null,
    graduationYear: jobApplication?.graduationYear || null,
    linkedinUrl: jobApplication?.linkedinUrl || null,
    portfolioUrl: jobApplication?.portfolioUrl || null,
    whyInterested: jobApplication?.whyInterested || null,
    appliedOn: jobApplication?.createdAt,

    github: user.githubProfile
      ? {
          name : user.githubProfile.name,
          login: user.githubProfile.login,
          avatarUrl: user.githubProfile.avatarUrl,
          bioHTML: user.githubProfile.bioHTML,
          followers: user.githubProfile.followersCount,
          following: user.githubProfile.followingCount,
          url: user.githubProfile.url,
          location: user.githubProfile.location,
          githubCreatedAt: user.githubProfile.githubCreatedAt,

          repositoriesCount: user.githubProfile.repositories.totalCount,
          totalContributions: user.githubProfile.contributionsCollection.contributionCalendar.totalContributions,
          longestStreak : calculateLongestStreak(user.githubProfile.contributionsCollection.contributionCalendar),
          languageData: extractLanguageData(user.githubProfile.repositories.nodes),
          contributionStats: extractContributionStats(user.githubProfile.contributionsCollection.contributionCalendar, user.githubProfile.pullRequests.totalCount),

          repositories: user.githubProfile?.repositories?.nodes || [],
        }
      : null,
  };

  return candidateProfile;
}

