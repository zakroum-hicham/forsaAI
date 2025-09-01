"use client"
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// Dashboard Components
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import OverviewCards from '@/components/dashboard/OverviewCards';
import JobList from '@/components/dashboard/JobList';
import PipelineFunnel from '@/components/dashboard/PipelineFunnel';
import AIRecommendations from '@/components/dashboard/AIRecommendations';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import { DashboardApiResponse, DashboardFilters } from '@/types/dashboard';


export default function DashboardPage({session , dashboardData} :{session:SessionType, dashboardData : DashboardApiResponse}) {
  return (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    {/* Header */}
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardHeader session={session} />
        {/* Welcome Section */}
        <div className="space-y-2 py-4">
          <h2 className="text-2xl font-bold text-foreground">Welcome back, {session?.user?.name} ! 👋</h2>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your recruitment activities today.</p>
        </div>
      </div>
    </div>

    {/* Main Content */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Overview Cards */}
        <section>
          <Suspense fallback={<DashboardSkeleton.OverviewCards />}>
            <OverviewCards metrics={dashboardData.metrics} />
          </Suspense>
        </section>

        <Separator className="my-8" />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Jobs */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Active Jobs</h2>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <Suspense fallback={<DashboardSkeleton.JobList />}>
                <JobList
                    jobs={dashboardData.jobs.filter(job => job.status === 'ACTIVE')}
                    filters={{
                      jobStatus: 'active',
                      jobType: 'all',
                      dateRange: '30d',
                      sortBy: 'urgency',
                      sortOrder: 'desc',
                    }} 
                    onFiltersChange={function (filters: Partial<DashboardFilters>): void {
                      throw new Error('Function not implemented.');
                    } } onJobSelect={function (jobId: string): void {
                      throw new Error('Function not implemented.');
                    } }                  // onFiltersChange={() => {}}
                  // onJobSelect={(jobId) => console.log('Selected job:', jobId)}
                />
              </Suspense>
            </section>

            {/* Pipeline */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recruitment Pipeline</h2>
              </div>
              <Suspense fallback={<DashboardSkeleton.PipelineFunnel />}>
                <PipelineFunnel
                  pipeline={dashboardData.pipelineData}
                  availableJobs={dashboardData.jobs.filter(job => job.status === 'ACTIVE').map(job => ({ id: job.id, title: job.title }))}
                />
              </Suspense>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* AI Insights */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">AI Insights</h2>
              </div>
              <Suspense fallback={<DashboardSkeleton.AIRecommendations />}>
                <AIRecommendations recommendations={dashboardData.recommendations} />
              </Suspense>
            </section>

            {/* Activity Timeline */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <Suspense fallback={<DashboardSkeleton.ActivityTimeline />}>
                <ActivityTimeline activities={dashboardData.recentActivity} />
              </Suspense>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}