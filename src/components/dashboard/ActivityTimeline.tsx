'use client';

import { 
  UserPlus, 
  Calendar, 
  Briefcase, 
  Edit, 
  Eye,
  Clock,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ActivityTimelineProps, ActivityItem } from '@/types/dashboard';

/**
 * Individual activity item component
 */
interface ActivityItemProps {
  activity: ActivityItem;
  isLast: boolean;
}

function ActivityItemComponent({ activity, isLast }: ActivityItemProps) {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'application':
        return <UserPlus className="h-4 w-4" />;
      case 'interview':
        return <Calendar className="h-4 w-4" />;
      case 'job_created':
        return <Briefcase className="h-4 w-4" />;
      case 'job_updated':
        return <Edit className="h-4 w-4" />;
      case 'candidate_reviewed':
        return <Eye className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
      blue: {
        bg: 'bg-blue-100 dark:bg-blue-900/20',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800'
      },
      green: {
        bg: 'bg-green-100 dark:bg-green-900/20',
        text: 'text-green-600 dark:text-green-400',
        border: 'border-green-200 dark:border-green-800'
      },
      yellow: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/20',
        text: 'text-yellow-600 dark:text-yellow-400',
        border: 'border-yellow-200 dark:border-yellow-800'
      },
      red: {
        bg: 'bg-red-100 dark:bg-red-900/20',
        text: 'text-red-600 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800'
      },
      purple: {
        bg: 'bg-purple-100 dark:bg-purple-900/20',
        text: 'text-purple-600 dark:text-purple-400',
        border: 'border-purple-200 dark:border-purple-800'
      },
    };
    return colorMap[color] || colorMap.blue;
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  const colorClasses = getColorClasses(activity.color);

  return (
    <div className="relative group">
      <div className="flex items-start space-x-4 pb-6">
        {/* Timeline dot and line */}
        <div className="relative flex-shrink-0">
          <div className={`w-10 h-10 rounded-full border-2 ${colorClasses.border} ${colorClasses.bg} flex items-center justify-center`}>
            <div className={colorClasses.text}>
              {getIcon(activity.type)}
            </div>
          </div>
          {!isLast && (
            <div className="absolute top-10 left-5 w-px h-full bg-gray-200 dark:bg-gray-700 transform -translate-x-px" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {activity.title}
                  </h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {activity.description}
                </p>

                {/* Job and candidate info */}
                <div className="flex items-center space-x-3">
                  {activity.jobTitle && (
                    <Badge variant="outline" className="text-xs">
                      {activity.jobTitle}
                    </Badge>
                  )}
                  {activity.candidateName && (
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-xs">
                          {activity.candidateName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {activity.candidateName}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    {activity.jobId && (
                      <DropdownMenuItem>Go to Job</DropdownMenuItem>
                    )}
                    {activity.candidateName && (
                      <DropdownMenuItem>View Candidate</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Activity filters component
 */
function ActivityFilters() {
  const filters = [
    { label: 'All', active: true },
    { label: 'Applications', active: false },
    { label: 'Interviews', active: false },
    { label: 'Jobs', active: false },
  ];

  return (
    <div className="flex items-center space-x-2 mb-4">
      <span className="text-sm text-gray-600 dark:text-gray-400">Filter:</span>
      <div className="flex space-x-1">
        {filters.map((filter, index) => (
          <Button
            key={index}
            variant={filter.active ? "default" : "ghost"}
            size="sm"
            className="text-xs px-3 py-1 h-7"
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

/**
 * Activity summary component
 */
function ActivitySummary({ activities }: { activities: ActivityItem[] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayActivities = activities.filter(activity => {
    const activityDate = new Date(activity.timestamp);
    activityDate.setHours(0, 0, 0, 0);
    return activityDate.getTime() === today.getTime();
  });

  const activityCounts = activities.reduce((acc, activity) => {
    acc[activity.type] = (acc[activity.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {todayActivities.length}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Today&apos;s Activity
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
            {activityCounts.application || 0}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            New Applications
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600 dark:text-green-400">
            {activityCounts.interview || 0}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Interviews
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
            {(activityCounts.job_created || 0) + (activityCounts.job_updated || 0)}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Job Updates
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Main ActivityTimeline component
 */
export default function ActivityTimeline({ activities, loading }: ActivityTimelineProps) {
  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort activities by timestamp (newest first)
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center">
              <Clock className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
              Recent Activity
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Stay updated with the latest recruitment activities
            </p>
          </div>
          <Button variant="ghost" size="sm">
            <ChevronRight className="h-4 w-4 mr-1" />
            View All
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Activity Summary */}
        <ActivitySummary activities={activities} />

        {/* Activity Filters */}
        <ActivityFilters />

        {/* Timeline */}
        <div className="space-y-0">
          {sortedActivities.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Recent Activity
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Activity will appear here as candidates apply and you manage your jobs.
              </p>
            </div>
          ) : (
            sortedActivities.map((activity, index) => (
              <ActivityItemComponent
                key={activity.id}
                activity={activity}
                isLast={index === sortedActivities.length - 1}
              />
            ))
          )}
        </div>

        {/* Load More Button */}
        {sortedActivities.length >= 5 && (
          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" size="sm">
              Load More Activity
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}