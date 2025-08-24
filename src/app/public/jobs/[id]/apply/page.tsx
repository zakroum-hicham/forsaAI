import { GetJob } from '@/lib/jobs/get-job';
import { notFound } from 'next/navigation';
import JobApply from './JobApply';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'


export default async function Page({ params }: { params: { id: string } }) {
  const job = await GetJob(params.id);
  const session = await getServerSession(authOptions);

  if (!job || !job.public) return notFound();
  return <JobApply job={job} session={session} />;
}
