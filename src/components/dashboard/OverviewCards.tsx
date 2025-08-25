import { 
  Briefcase, 
  Users, 
  FileText, 
  TrendingUp,
  Clock,
  Archive,
  Edit
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { OverviewCardsProps } from '@/types/dashboard';

/**
 * Individual metric card component
 */
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
    trend: 'up' | 'down' | 'neutral';
  };
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'gray';
  loading?: boolean;
}

function MetricCard({ title, value, change, icon, color, loading }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    yellow: 'bg-yellow-500 text-white',
    purple: 'bg-purple-500 text-white',
    red: 'bg-red-500 text-white',
    gray: 'bg-gray-500 text-white',
  };

  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400',
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-md ${colorClasses[color]}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {change && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <TrendingUp 
                className={`h-4 w-4 ${
                  change.trend === 'down' ? 'rotate-180' : ''
                } ${trendColors[change.trend]}`}
              />
              <span className={`text-sm font-medium ${trendColors[change.trend]}`}>
                {change.trend === 'up' ? '+' : change.trend === 'down' ? '-' : ''}
                {Math.abs(change.value)}%
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {change.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Main OverviewCards component displaying key dashboard metrics
 */
export default function OverviewCards({ metrics, loading }: OverviewCardsProps) {
  const cards: Omit<MetricCardProps, 'loading'>[] = [
    {
      title: 'Total Jobs',
      value: metrics.totalJobs,
      icon: <Briefcase className="h-4 w-4" />,
      color: 'blue',
      change: {
        value: 12,
        label: 'vs last month',
        trend: 'up',
      },
    },
    {
      title: 'Active Jobs',
      value: metrics.activeJobs,
      icon: <Clock className="h-4 w-4" />,
      color: 'green',
      change: {
        value: 8,
        label: 'vs last month',
        trend: 'up',
      },
    },
    {
      title: 'Total Applications',
      value: metrics.totalApplications,
      icon: <FileText className="h-4 w-4" />,
      color: 'purple',
      change: {
        value: 23,
        label: 'vs last month',
        trend: 'up',
      },
    },
    {
      title: 'New Today',
      value: metrics.newApplicationsToday,
      icon: <Users className="h-4 w-4" />,
      color: 'yellow',
    },
    {
      title: 'Draft Jobs',
      value: metrics.draftJobs,
      icon: <Edit className="h-4 w-4" />,
      color: 'gray',
    },
    {
      title: 'Avg per Job',
      value: metrics.averageApplicationsPerJob.toFixed(1),
      icon: <TrendingUp className="h-4 w-4" />,
      color: 'blue',
      change: {
        value: 5,
        label: 'vs last month',
        trend: 'up',
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Status Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            <Clock className="h-3 w-3 mr-1" />
            {metrics.activeJobs} Active
          </Badge>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
            <Edit className="h-3 w-3 mr-1" />
            {metrics.draftJobs} Draft
          </Badge>
          <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
            <Archive className="h-3 w-3 mr-1" />
            {metrics.archivedJobs} Archived
          </Badge>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {cards.map((card, index) => (
          <MetricCard
            key={card.title}
            {...card}
            loading={loading}
          />
        ))}
      </div>

      {/* Quick Insights Bar */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Your recruitment is performing well!
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300">
                Applications are up 23% and you have {metrics.newApplicationsToday} new candidates to review today.
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
            +23%
          </Badge>
        </div>
      </div>
    </div>
  );
}