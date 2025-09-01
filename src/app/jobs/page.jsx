import JobsDashboard from "@/app/jobs/JobsDashboard";
import { getUserJobs } from '@/lib/jobs/get-user-jobs';

export default async function JobsPage() {

  // return <JobsDashboard jobs={await getUserJobs()} />
  return <p>Jobs Page</p>;
}
