import prisma from '../prisma';

type HeaderAnalyticsData = {
  jobTitle: string;
  totalApplicants: number;
  avgGithubContributions: number;
  avgHackathons: number;
  devsportParticipation: number;
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
    githubContributions.reduce((a, b) => a + b, 0) / Math.max(totalApplicants, 1) * 1000 // Simulated logic
  );

  const avgHackathons = parseFloat(
    (hackathonCounts.reduce((a, b) => a + b, 0) / Math.max(totalApplicants, 1)).toFixed(1)
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
