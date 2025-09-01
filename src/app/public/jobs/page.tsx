import { GetPublicJobs } from "@/lib/jobs/getJobs";
import JobsPage from "./_client";
import { Job } from "@prisma/client";

const Page = async () => {
    const jobs =  await GetPublicJobs();
return(
    <JobsPage allJobs={jobs}/>
);
}

export default Page;