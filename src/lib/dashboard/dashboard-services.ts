import prisma from '../prisma';
import type { 
  DashboardMetrics, 
  JobWithMetrics, 
  JobPipeline, 
  AIRecommendation, 
  ActivityItem,
  DashboardApiResponse 
} from '@/types/dashboard';


/**
 * Calculate urgency score based on end posting date
 */
function calculateUrgencyScore(endPostingDate: Date | null): number {
  if (!endPostingDate) return 1;
  
  const now = new Date();
  const daysUntilEnd = Math.ceil((endPostingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilEnd <= 3) return 5;
  if (daysUntilEnd <= 7) return 4;
  if (daysUntilEnd <= 14) return 3;
  if (daysUntilEnd <= 30) return 2;
  return 1;
}

/**
 * Calculate AI match score (placeholder - implement your AI logic here)
 */
function calculateAIMatchScore(job: any, applicationCount: number): number {
  // Placeholder AI scoring logic - replace with your actual AI implementation
  let score = 50;
  
  // Boost score based on application count relative to time posted
  const daysSincePosted = Math.ceil((new Date().getTime() - job.postingDate.getTime()) / (1000 * 60 * 60 * 24));
  const applicationRate = applicationCount / Math.max(daysSincePosted, 1);
  
  if (applicationRate > 2) score += 30;
  else if (applicationRate > 1) score += 20;
  else if (applicationRate > 0.5) score += 10;
  
  // Boost for recent activity
  if (daysSincePosted <= 7) score += 15;
  
  // Add some variability based on job characteristics
  if (job.salaryMax && job.salaryMax > 100000) score += 10;
  if (job.type === 'FULL_TIME') score += 5;
  if (job.location?.toLowerCase().includes('remote')) score += 10;
  
  return Math.min(Math.max(score, 1), 100);
}

/**
 * Fetch dashboard metrics
 */
export async function getDashboardMetrics(userId: string): Promise<DashboardMetrics> {
  const [
    totalJobs,
    activeJobs,
    draftJobs,
    archivedJobs,
    totalApplications,
    newApplicationsToday
  ] = await Promise.all([
    prisma.job.count({
      where: { userId }
    }),
    prisma.job.count({
      where: { userId, status: 'ACTIVE' }
    }),
    prisma.job.count({
      where: { userId, status: 'DRAFT' }
    }),
    prisma.job.count({
      where: { userId, status: 'ARCHIVED' }
    }),
    prisma.jobApplication.count({
      where: { job: { userId } }
    }),
    prisma.jobApplication.count({
      where: {
        job: { userId },
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    })
  ]);

  const averageApplicationsPerJob = totalJobs > 0 ? totalApplications / totalJobs : 0;

  // Get unique candidates (by email)
  const uniqueCandidates = await prisma.jobApplication.groupBy({
    by: ['email'],
    where: { job: { userId } }
  });

  return {
    totalJobs,
    activeJobs,
    draftJobs,
    archivedJobs,
    totalApplications,
    newApplicationsToday,
    averageApplicationsPerJob,
    totalCandidates: uniqueCandidates.length
  };
}

/**
 * Fetch jobs with metrics
 */
export async function getJobsWithMetrics(userId: string): Promise<JobWithMetrics[]> {
  const jobs = await prisma.job.findMany({
    where: { userId },
    include: {
      JobApplication: {
        select: {
          id: true,
          createdAt: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return jobs.map(job => {
    const applicationCount = job.JobApplication.length;
    const newApplicationsToday = job.JobApplication.filter(
      app => app.createdAt >= today
    ).length;

    return {
      id: job.id,
      title: job.title,
      type: job.type as 'INTERNSHIP' | 'FULL_TIME' | 'PART_TIME' | 'CONTRACT',
      location: job.location,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      postingDate: job.postingDate,
      endPostingDate: job.endPostingDate,
      status: job.status as 'DRAFT' | 'ACTIVE' | 'ARCHIVED',
      description: job.description,
      requirements: job.requirements,
      applicationCount,
      newApplicationsToday,
      urgencyScore: calculateUrgencyScore(job.endPostingDate),
      aiMatchScore: calculateAIMatchScore(job, applicationCount),
      createdAt: job.createdAt,
      updatedAt: job.updatedAt
    };
  });
}

/**
 * Generate AI recommendations based on real data
 */
export async function getAIRecommendations(userId: string): Promise<AIRecommendation[]> {
  const recommendations: AIRecommendation[] = [];
  
  // Get jobs with applications
  const jobsWithApps = await prisma.job.findMany({
    where: { userId },
    include: {
      JobApplication: {
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  });

  // Find jobs with high application counts
  const highApplicationJobs = jobsWithApps.filter(job => job.JobApplication.length > 20);
  if (highApplicationJobs.length > 0) {
    const job = highApplicationJobs[0];
    recommendations.push({
      id: `rec-high-apps-${job.id}`,
      type: 'job',
      title: 'High Application Volume',
      description: `${job.title} has received ${job.JobApplication.length} applications. Consider reviewing and shortlisting candidates.`,
      priority: 'high',
      actionLabel: 'Review Applications',
      actionUrl: `/jobs/${job.id}/applications`
    });
  }

  // Find jobs nearing deadline
  const now = new Date();
  const upcomingDeadlines = jobsWithApps.filter(job => {
    if (!job.endPostingDate) return false;
    const daysUntilDeadline = Math.ceil((job.endPostingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDeadline <= 7 && daysUntilDeadline > 0;
  });

  for (const job of upcomingDeadlines) {
    const daysLeft = Math.ceil((job.endPostingDate!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    recommendations.push({
      id: `rec-deadline-${job.id}`,
      type: 'job',
      title: 'Deadline Approaching',
      description: `${job.title} posting ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'} with ${job.JobApplication.length} applications.`,
      priority: daysLeft <= 3 ? 'high' : 'medium',
      actionLabel: 'Review Applications',
      actionUrl: `/jobs/${job.id}/applications`
    });
  }

  // Find recent high-quality candidates (placeholder logic)
  const recentApplications = await prisma.jobApplication.findMany({
    where: {
      job: { userId },
      createdAt: {
        gte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // Last 3 days
      }
    },
    include: { job: true },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  for (const app of recentApplications) {
    // Simple scoring based on profile completeness
    let score = 70;
    if (app.linkedinUrl) score += 10;
    if (app.portfolioUrl) score += 10;
    if (app.university) score += 5;
    if (app.githubConnected) score += 5;

    if (score >= 85) {
      recommendations.push({
        id: `rec-candidate-${app.id}`,
        type: 'candidate',
        title: 'High-Quality Candidate',
        description: `${app.firstName} ${app.lastName} has a strong profile for ${app.job.title} (${score}% match).`,
        priority: 'high',
        actionLabel: 'Review Profile',
        actionUrl: `/candidates/${app.id}`
      });
    }
  }

  // Find jobs with low application rates
  const lowApplicationJobs = jobsWithApps.filter(job => {
    const daysSincePosted = Math.ceil((now.getTime() - job.postingDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSincePosted >= 7 && job.JobApplication.length < 5;
  });

  for (const job of lowApplicationJobs.slice(0, 2)) {
    recommendations.push({
      id: `rec-low-apps-${job.id}`,
      type: 'insight',
      title: 'Low Application Rate',
      description: `${job.title} has only ${job.JobApplication.length} applications. Consider improving the job description or requirements.`,
      priority: 'medium',
      actionLabel: 'Edit Job',
      actionUrl: `/jobs/${job.id}/edit`
    });
  }

  return recommendations.slice(0, 5); // Return top 5 recommendations
}

/**
 * Generate pipeline data for a specific job
 */
export async function getJobPipeline(jobId: string): Promise<JobPipeline | null> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      JobApplication: true
    }
  });

  if (!job) return null;

  // Since your schema doesn't have application stages, we'll create a simple pipeline
  // You might want to add a 'status' field to JobApplication model for better pipeline tracking
  const totalCandidates = job.JobApplication.length;
  
  // Simulate pipeline stages based on application age and other factors
  const now = new Date();
  const applications = job.JobApplication.map(app => ({
    ...app,
    daysOld: Math.floor((now.getTime() - app.createdAt.getTime()) / (1000 * 60 * 60 * 24))
  }));

  const stages = [
    {
      stage: 'Applied',
      count: totalCandidates,
      color: '#3b82f6'
    },
    {
      stage: 'Screening',
      count: Math.floor(totalCandidates * 0.6), // 60% move to screening
      color: '#8b5cf6'
    },
    {
      stage: 'Interview',
      count: Math.floor(totalCandidates * 0.3), // 30% get interviewed
      color: '#06b6d4'
    },
    {
      stage: 'Final Round',
      count: Math.floor(totalCandidates * 0.1), // 10% reach final round
      color: '#10b981'
    },
    {
      stage: 'Offer',
      count: Math.floor(totalCandidates * 0.05), // 5% get offers
      color: '#f59e0b'
    }
  ];

  return {
    jobId: job.id,
    jobTitle: job.title,
    stages,
    totalCandidates
  };
}

/**
 * Generate recent activity feed
 */
export async function getRecentActivity(userId: string): Promise<ActivityItem[]> {
  const activities: ActivityItem[] = [];

  // Get recent applications
  const recentApplications = await prisma.jobApplication.findMany({
    where: {
      job: { userId }
    },
    include: { job: true },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  for (const app of recentApplications) {
    activities.push({
      id: `app-${app.id}`,
      type: 'application',
      title: 'New Application Received',
      description: `${app.firstName} ${app.lastName} applied for ${app.job.title}`,
      timestamp: app.createdAt,
      jobId: app.job.id,
      jobTitle: app.job.title,
      candidateName: `${app.firstName} ${app.lastName}`,
      icon: 'user-plus',
      color: 'blue'
    });
  }

  // Get recent job updates
  const recentJobs = await prisma.job.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    take: 5
  });

  for (const job of recentJobs) {
    if (job.createdAt.getTime() === job.updatedAt.getTime()) {
      // Job was just created
      activities.push({
        id: `job-created-${job.id}`,
        type: 'job_created',
        title: 'New Job Posted',
        description: `${job.title} was published and is now accepting applications`,
        timestamp: job.createdAt,
        jobId: job.id,
        jobTitle: job.title,
        icon: 'briefcase',
        color: 'green'
      });
    } else {
      // Job was updated
      activities.push({
        id: `job-updated-${job.id}`,
        type: 'job_updated',
        title: 'Job Updated',
        description: `${job.title} details have been modified`,
        timestamp: job.updatedAt,
        jobId: job.id,
        jobTitle: job.title,
        icon: 'edit',
        color: 'yellow'
      });
    }
  }

  // Sort all activities by timestamp (newest first) and return top 15
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 15);
}

/**
 * Main function to fetch all dashboard data
 */
export async function getDashboardData(userId: string): Promise<DashboardApiResponse> {
  const [metrics, jobs, recommendations, recentActivity] = await Promise.all([
    getDashboardMetrics(userId),
    getJobsWithMetrics(userId),
    getAIRecommendations(userId),
    getRecentActivity(userId)
  ]);

  // Get pipeline data for the most all active job
  const activeJobs = jobs.filter(job => job.status === 'ACTIVE');

  const pipelineData = await Promise.all(
    activeJobs.map(job => getJobPipeline(job.id))
  );

  return {
    metrics,
    jobs,
    recommendations,
    recentActivity,
    pipelineData: pipelineData.filter(Boolean) as JobPipeline[]
  };
}

/**
 * Cleanup function to disconnect Prisma client
 */
export async function disconnectPrisma() {
  await prisma.$disconnect();
}