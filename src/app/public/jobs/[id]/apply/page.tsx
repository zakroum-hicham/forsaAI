import { GetJob } from '@/lib/jobs/get-job';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import JobApplicationForm from './JobApply';
import { CheckUserApplication, UserApplication } from '@/lib/jobs/check-user-application';


export default async function Page({ params } : { params: Promise<{id: string}> }) {
  const {id} = await params;
  const session :SessionType = await getServerSession(authOptions);

  let userApplication: UserApplication | null = null;
    if (session?.user?.id) {
      userApplication = await CheckUserApplication(id, session.user.id);
    }
  const hasAlreadyApplied = !!userApplication;
  if (hasAlreadyApplied) {
    redirect(`/public/jobs/${id}`);
  }
  const job = await GetJob(id);

  if (!job || !job.public) return notFound();
  return <JobApplicationForm job={job} session={session} />;
}
