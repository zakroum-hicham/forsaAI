"use client"
import { Briefcase, Calendar, MapPin, DollarSign, Edit, BarChart3, ExternalLink, Share2, CheckCircle2, Copy, Delete } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { deleteJob } from '@/lib/jobs/delete-job';
import { redirect } from 'next/navigation';
import toggleJobVisibility from '@/lib/jobs/job-visibility';
import ToggleJobVisibility from '@/lib/jobs/job-visibility';
import { Job } from '@prisma/client';

// Mock types for demo
type JobType = 'INTERNSHIP' | 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
type JobStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

// Simple date formatter to replace date-fns
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function JobDetails({ job}: { job: Job }) {
  const [loading, setLoading] = useState<boolean>(false);
   const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPublic, setIsPublic] = useState(job.public);

  // Generate public link (in real app, this would come from API)
  const publicLink = `localhost:3000/public/jobs/${job.id}`;
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(publicLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'Negotiable';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const jobTypeMap: Record<JobType, string> = {
    INTERNSHIP: 'Internship',
    FULL_TIME: 'Full-time',
    PART_TIME: 'Part-time',
    CONTRACT: 'Contract',
  };

  const statusMap: Record<JobStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    DRAFT: { label: 'Draft', variant: 'secondary' },
    ACTIVE: { label: 'ACTIVE', variant: 'default' },
    ARCHIVED: { label: 'Archived', variant: 'outline' },
  };

  const getStatusVariant = (status: JobStatus) => {
    return statusMap[status]?.variant || 'default';
  };

  const handleToggleVisibility = async () => {
    try {
      // Call the server function to toggle visibility
      const updatedJob = await ToggleJobVisibility(job.id);
      setIsPublic(updatedJob.public);
    } catch (error) {
      console.error("Error toggling job visibility:", error);
    }
  };


  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">{job.title}</h1>
          <Badge variant={getStatusVariant(job.status)} className="self-start">
            {statusMap[job.status].label}
          </Badge>
          </div>
        {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="bg-white/50 border-slate-300 hover:bg-blue-50 hover:border-blue-300">
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle className="flex items-center">
                                <Share2 className="w-5 h-5 mr-2 text-blue-600" />
                                Share Job Posting
                              </DialogTitle>
                              <DialogDescription>
                                Share this job posting publicly so candidates can apply
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="visibility-toggle">Job Visibility</Label>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    onClick={handleToggleVisibility}
                                    // variant={isPublic ? 'success' : 'outline'}
                                    className="px-4 py-2"
                                  >
                                    {isPublic ? 'Make Private' : 'Make Public'}
                                  </Button>
                                </div>
                              </div>

                              {isPublic && (
                                <>
                                  <Separator />
                                  <div className="space-y-2">
                                    <Label htmlFor="link">Public Link</Label>
                                    <div className="flex space-x-2">
                                      <Input
                                        id="link"
                                        value={publicLink}
                                        readOnly
                                        className="bg-slate-50 border-slate-200"
                                      />
                                      <Button
                                        type="button"
                                        size="sm"
                                        onClick={copyToClipboard}
                                        className={copied ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}
                                      >
                                        {copied ? (
                                          <>
                                            <CheckCircle2 className="w-4 h-4 mr-1" />
                                            Copied!
                                          </>
                                        ) : (
                                          <>
                                            <Copy className="w-4 h-4 mr-1" />
                                            Copy
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                  <Separator />
                                  <div className="flex items-center justify-between pt-2">
                                    <div className="space-y-1">
                                      <p className="text-sm font-medium">Job Visibility</p>
                                      <p className="text-xs text-slate-600">This link allows public access to your job posting</p>
                                    </div>
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                      Public
                                    </Badge>
                                  </div>
                                  <Button
                                    onClick={() => window.open(publicLink, '_blank')}
                                    variant="outline"
                                    className="w-full"
                                  >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    View Public Page
                                  </Button>
                                </>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share job publicly</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={`/jobs/${job.id}/analytics`}>
                        <Button variant="outline" className="bg-white/50 border-slate-300 hover:bg-purple-50 hover:border-purple-300">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Analytics
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View job analytics</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={`/jobs/${job.id}/edit`}>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Job
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit job details</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Job Type</p>
              <p className="text-sm text-gray-900">{jobTypeMap[job.type]}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Location</p>
              <p className="text-sm text-gray-900">{job.location || 'Remote'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Duration</p>
              <p className="text-sm text-gray-900">
                {formatDate(job.postingDate)} -{' '}
                {job.endPostingDate ? formatDate(job.endPostingDate) : 'Until filled'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Salary Range</p>
              <p className="text-sm text-gray-900">
                {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        <Separator />
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
            Job Description
          </h2>
          <div 
            className="prose prose-gray max-w-none text-gray-700 leading-relaxed" 
            dangerouslySetInnerHTML={{ __html: job.description }} 
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
            Requirements
          </h2>
          <div 
            className="prose prose-gray max-w-none text-gray-700 leading-relaxed" 
            dangerouslySetInnerHTML={{ __html: job.requirements }} 
          />
        </div>

        <Separator />

        <div className="flex justify-end pt-4">
          <Button onClick={() => {deleteJob(job.id, setLoading);redirect('/jobs')}} className="bg-orange-500 hover:bg-orange-600 text-white" disabled={loading}>
            <Delete className="w-4 h-4 mr-2" />
            Delete Job
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}