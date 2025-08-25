'use client';

import { useState } from 'react';
import { 
  MoreHorizontal,
  Filter,
  Search,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  AlertTriangle,
  Star,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { JobListProps, JobWithMetrics } from '@/types/dashboard';
import Link from 'next/link';

/**
 * Individual job card component
 */
interface JobCardProps {
  job: JobWithMetrics;
  onSelect: (jobId: string) => void;
}

function JobCard({ job, onSelect }: JobCardProps) {
  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
    if (min) return `$${(min / 1000).toFixed(0)}k+`;
    return `Up to $${(max! / 1000).toFixed(0)}k`;
  };

  const getUrgencyColor = (score: number) => {
    if (score >= 4) return 'text-red-600 dark:text-red-400';
    if (score >= 3) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getUrgencyLabel = (score: number) => {
    if (score >= 4) return 'High';
    if (score >= 3) return 'Medium';
    return 'Low';
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 75) return 'text-blue-600 dark:text-blue-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const typeColors = {
    FULL_TIME: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    PART_TIME: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    CONTRACT: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
    INTERNSHIP: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  };

  const daysUntilEnd = job.endPostingDate 
    ? Math.ceil((new Date(job.endPostingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <Card className="transition-all duration-200 hover:shadow-md cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {job.title}
            </CardTitle>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
              {job.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {job.location}
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(job.postingDate).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                {formatSalary(job.salaryMin, job.salaryMax)}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/jobs/${job.id}`}>
              <DropdownMenuItem onClick={() => onSelect(job.id)}>
                View Details
              </DropdownMenuItem>
              </Link>
              <Link href={`/jobs/${job.id}/edit`}>
              <DropdownMenuItem>Edit Job</DropdownMenuItem>
              </Link>
              <Link href={`/jobs/${job.id}/applications`}>
              <DropdownMenuItem>View Applications</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Archive Job
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Type and Status Badges */}
          <div className="flex items-center space-x-2">
            <Badge className={typeColors[job.type]}>
              {job.type.replace('_', ' ')}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {job.status.toLowerCase()}
            </Badge>
            {daysUntilEnd !== null && daysUntilEnd <= 7 && (
              <Badge variant="destructive" className="flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {daysUntilEnd}d left
              </Badge>
            )}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {job.applicationCount}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Applications
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  +{job.newApplicationsToday}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Today
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <AlertTriangle className={`h-4 w-4 ${getUrgencyColor(job.urgencyScore)}`} />
              <div>
                <div className={`text-sm font-medium ${getUrgencyColor(job.urgencyScore)}`}>
                  {getUrgencyLabel(job.urgencyScore)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Urgency
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Star className={`h-4 w-4 ${getMatchScoreColor(job.aiMatchScore)}`} />
              <div>
                <div className={`text-sm font-medium ${getMatchScoreColor(job.aiMatchScore)}`}>
                  {job.aiMatchScore}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  AI Match
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar for Applications */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">Application Progress</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {job.applicationCount}/50 target
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((job.applicationCount / 50) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Main JobList component
 */
export default function JobList({ jobs, filters, onFiltersChange, onJobSelect, loading }: JobListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter and sort jobs
  const filteredJobs = jobs
    .filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      
      const matchesType = filters.jobType === 'all' || job.type === filters.jobType;
      const matchesStatus = filters.jobStatus === 'all' || job.status.toLowerCase() === filters.jobStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'applications':
          return filters.sortOrder === 'desc' 
            ? b.applicationCount - a.applicationCount
            : a.applicationCount - b.applicationCount;
        case 'urgency':
          return filters.sortOrder === 'desc'
            ? b.urgencyScore - a.urgencyScore
            : a.urgencyScore - b.urgencyScore;
        case 'match_score':
          return filters.sortOrder === 'desc'
            ? b.aiMatchScore - a.aiMatchScore
            : a.aiMatchScore - b.aiMatchScore;
        default:
          return filters.sortOrder === 'desc'
            ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select
            value={filters.jobType}
            onValueChange={(value) => onFiltersChange({ jobType: value as any })}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="FULL_TIME">Full Time</SelectItem>
              <SelectItem value="PART_TIME">Part Time</SelectItem>
              <SelectItem value="CONTRACT">Contract</SelectItem>
              <SelectItem value="INTERNSHIP">Internship</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.sortBy}
            onValueChange={(value) => onFiltersChange({ sortBy: value as any })}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="applications">Applications</SelectItem>
              <SelectItem value="urgency">Urgency</SelectItem>
              <SelectItem value="match_score">AI Match</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredJobs.length} of {jobs.length} jobs
        </p>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Sort:</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFiltersChange({ 
              sortOrder: filters.sortOrder === 'desc' ? 'asc' : 'desc' 
            })}
          >
            {filters.sortOrder === 'desc' ? '↓' : '↑'}
          </Button>
        </div>
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-gray-400 dark:text-gray-600">
              <Briefcase className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No jobs found
              </h3>
              <p className="text-sm">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          </Card>
        ) : (
          filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSelect={onJobSelect}
            />
          ))
        )}
      </div>
    </div>
  );
}