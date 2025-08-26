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
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      location: user.company ?? null,  // Assuming the location is stored in 'company' field
      overallScore: calculateOverallScore(githubProfile, app), // Function to calculate the overall score
      githubScore: calculateGithubScore(githubProfile), // Function to calculate GitHub score
      contributions: githubProfile?.contributionsTotal ?? 0,
      hackathonsScore: 0,  // Assuming no hackathons data for now, can be expanded
      experience: 0,  // Assuming no experience data for now, can be expanded
      currentRole: user.role,
      status: app.githubConnected ? 'Connected' : 'Not Connected', // Example of status based on GitHub connection
    };
  });

  // Return the first candidate's analytics as an example (or all candidates if needed)
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

export async function getCandidateProfile(candidateId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: candidateId,
    },
    include: {
      githubProfile: true,
      JobApplication: {
        orderBy: { createdAt: 'desc' }, // in case you want latest application
        take: 1, // assuming you want the latest job application
      },
    },
  });

  if (!user) return null;

  const jobApplication = user.JobApplication[0] || null;

  const candidateProfile = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    university: jobApplication?.university || null,
    major: jobApplication?.major || null,
    graduationYear: jobApplication?.graduationYear || null,
    linkedinUrl: jobApplication?.linkedinUrl || null,
    portfolioUrl: jobApplication?.portfolioUrl || null,
    devpostUsername: jobApplication?.devpostUsername || null,
    whyInterested: jobApplication?.whyInterested || null,
    appliedOn: jobApplication?.createdAt || null,
    githubConnected: jobApplication?.githubConnected || false,

    github: user.githubProfile
      ? {
          login: user.githubProfile.login,
          avatarUrl: user.githubProfile.avatarUrl,
          bio: user.githubProfile.bio,
          followers: user.githubProfile.followersCount,
          following: user.githubProfile.followingCount,
          repositoriesCount: user.githubProfile.repositoriesCount,
          topRepositories: user.githubProfile.topRepositories,
          contributionsTotal: user.githubProfile.contributionsTotal,
          contributionsCalendar: user.githubProfile.contributionsCalendar,
          createdAt: user.githubProfile.createdAt,
        }
      : null,
  };

  return candidateProfile;
}

