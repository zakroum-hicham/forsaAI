import { notFound } from 'next/navigation';
import { GetJob } from '@/lib/jobs/get-job';
import { CheckUserApplication } from '@/lib/jobs/check-user-application';
import { MapPin, Building, ArrowLeft, ExternalLink, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { Job } from '@prisma/client';
import { authOptions } from '@/lib/auth';

interface UserApplication {
  id: string;
  appliedDate: Date;
}

// Utilities
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatCurrency = (amount: number | null) => {
  if (!amount) return null;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const jobTypeMap: Record<Job["type"], string> = {
  INTERNSHIP: 'Internship',
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
};

const ApplicationStatusBadge = ({ application }: { application: UserApplication }) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <div>
          <Badge className="bg-green-100 text-green-800 border border-green-200">
            Application Submitted
          </Badge>
          <p className="text-sm text-gray-600 mt-1">
            Applied on {formatDate(application.appliedDate)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default async function JobPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  console.log("session", session);
  const job = await GetJob(params.id);
  
  if (!job?.public) return notFound();

  // Check if user has already applied (only if logged in)
  let userApplication: UserApplication | null = null;
  if (session?.user?.id) {
    userApplication = await CheckUserApplication(params.id, session.user.id);
  }

  const salaryRange = job.salaryMin && job.salaryMax 
    ? `${formatCurrency(job.salaryMin)} - ${formatCurrency(job.salaryMax)}`
    : job.salaryMin 
    ? `From ${formatCurrency(job.salaryMin)}`
    : job.salaryMax 
    ? `Up to ${formatCurrency(job.salaryMax)}`
    : null;

  // Determine if job is still accepting applications
  const isDeadlinePassed = job.endPostingDate && new Date() > job.endPostingDate;
  const hasAlreadyApplied = !!userApplication;
//   const canApply = !isDeadlinePassed && !hasAlreadyApplied;

  const renderApplyButton = () => {
    if (isDeadlinePassed) {
      return (
        <Button 
          disabled 
          className="w-full bg-gray-100 text-gray-500 py-3 text-lg cursor-not-allowed"
        >
          Application Deadline Passed
        </Button>
      );
    }
    if (!session) {
      return (
        <Link href={`/public/jobs/${job.id}/login`}>
          <Button className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg">
            Sign in to Apply
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      );
    }

    if (hasAlreadyApplied) {
      return (
        <div className="space-y-3">
          <Button 
            disabled 
            className="w-full bg-gray-100 text-gray-500 py-3 text-lg cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Already Applied
          </Button>
          <p className="text-sm text-gray-600 text-center">
            You can track your application status in your{' '}
            <Link href="/dashboard/applications" className="text-blue-600 hover:underline">
              dashboard
            </Link>
          </p>
        </div>
      );
    }


    return (
      <Link href={`/public/jobs/${job.id}/apply`}>
        <Button className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg">
          Apply for this position
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Navigation */}
        <Link 
          href="." 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Job Board
        </Link>

        {/* Main Job Card */}
        <Card> 
          <CardContent className="p-8">
            {/* Application Status Badge - Show if user has applied */}
            {userApplication && (
              <ApplicationStatusBadge application={userApplication} />
            )}

            {/* Company Logo Placeholder */}
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center mr-4">
                <Building className="w-6 h-6 text-gray-500" />
              </div>
              <span className="text-gray-600">Company Logo</span>
            </div>

            {/* Job Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {job.title}
            </h1>

            {/* Job Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8">
              <div className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                <span>{jobTypeMap[job.type]}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{job.location || 'Remote'}</span>
              </div>
              <span>Posted {formatDate(job.postingDate)}</span>
              {salaryRange && (
                <span className="font-medium text-gray-900">{salaryRange}</span>
              )}
            </div>

            {/* Description Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Description</h2>
              <div 
                className="prose prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: job.description }} 
              />
            </div>

            {/* Requirements */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Requirements</h2>
              <div 
                className="prose prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: job.requirements }} 
              />
            </div>

            {/* Job Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-t border-gray-200 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Posted on</h3>
                <p className="text-gray-600">{formatDate(job.postingDate)}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Application Deadline</h3>
                <p className="text-gray-600">
                  {job.endPostingDate ? formatDate(job.endPostingDate) : 'Open until filled'}
                  {isDeadlinePassed && (
                    <Badge className="ml-2 bg-red-100 text-red-800">
                      Closed
                    </Badge>
                  )}
                </p>
              </div>
            </div>

            {/* Apply Button */}
            {renderApplyButton()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}