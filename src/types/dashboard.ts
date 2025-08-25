export interface DashboardMetrics {
  totalJobs: number;
  activeJobs: number;
  draftJobs: number;
  archivedJobs: number;
  totalApplications: number;
  newApplicationsToday: number;
  averageApplicationsPerJob: number;
  totalCandidates: number;
}

export interface JobWithMetrics {
  id: string;
  title: string;
  type: 'INTERNSHIP' | 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  location: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  postingDate: Date;
  endPostingDate: Date | null;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  description: string;
  requirements: string;
  applicationCount: number;
  newApplicationsToday: number;
  urgencyScore: number; // 1-5 scale based on end date proximity
  aiMatchScore: number; // 1-100 AI-generated score
  createdAt: Date;
  updatedAt: Date;
}

export interface PipelineStage {
  stage: string;
  count: number;
  color: string;
}

export interface JobPipeline {
  jobId: string;
  jobTitle: string;
  stages: PipelineStage[];
  totalCandidates: number;
}

export interface AIRecommendation {
  id: string;
  type: 'candidate' | 'job' | 'action' | 'insight';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionLabel?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface ActivityItem {
  id: string;
  type: 'application' | 'interview' | 'job_created' | 'job_updated' | 'candidate_reviewed';
  title: string;
  description: string;
  timestamp: Date;
  jobId?: string;
  jobTitle?: string;
  candidateName?: string;
  icon: string;
  color: string;
}

export interface DashboardFilters {
  jobStatus: 'all' | 'active' | 'draft' | 'archived';
  jobType: 'all' | 'INTERNSHIP' | 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  dateRange: '7d' | '30d' | '90d' | 'all';
  sortBy: 'newest' | 'applications' | 'urgency' | 'match_score';
  sortOrder: 'asc' | 'desc';
}

export interface CandidateProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  university?: string;
  major?: string;
  graduationYear?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  aiMatchScore: number;
  appliedDate: Date;
  status: 'new' | 'reviewed' | 'shortlisted' | 'interviewed' | 'rejected' | 'hired';
}

export interface JobDetailsWithCandidates extends JobWithMetrics {
  candidates: CandidateProfile[];
  pipeline: JobPipeline;
}

// Chart data interfaces for Recharts
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesDataPoint {
  date: string;
  applications: number;
  jobs: number;
}

// API Response interfaces
export interface DashboardApiResponse {
  metrics: DashboardMetrics;
  jobs: JobWithMetrics[];
  recommendations: AIRecommendation[];
  recentActivity: ActivityItem[];
  pipelineData: JobPipeline[];
}

// Component Props interfaces
export interface OverviewCardsProps {
  metrics: DashboardMetrics;
  loading?: boolean;
}

export interface JobListProps {
  jobs: JobWithMetrics[];
  filters: DashboardFilters;
  onFiltersChange: (filters: Partial<DashboardFilters>) => void;
  onJobSelect: (jobId: string) => void;
  loading?: boolean;
}

export interface PipelineFunnelProps {
  pipeline: JobPipeline[] | null;
  availableJobs: { id: string; title: string }[];
  loading?: boolean;
}

export interface AIRecommendationsProps {
  recommendations: AIRecommendation[];
  loading?: boolean;
}

export interface ActivityTimelineProps {
  activities: ActivityItem[];
  loading?: boolean;
}