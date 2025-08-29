import { notFound } from 'next/navigation';
import { GetJob } from '@/lib/jobs/get-job';
import JobDetails from '@/components/jobs/JobDetails';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';

export default async function JobPage({ params }: { params: { id: string } }) {
  const job = await GetJob(params.id);
  if (!job) return notFound();

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
        <div className="mb-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
                 
                 
            </BreadcrumbList>
          </Breadcrumb>
          </div>
      <JobDetails job={job} />
    </div>
  );
}