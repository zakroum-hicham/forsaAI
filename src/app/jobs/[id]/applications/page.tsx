import ApplicantAnalyticsDashboard from "./ApplicationDashboard";
import { getHeaderAnalytics ,getCandidateAnalytics} from "@/lib/applicationAnalytics/services";

const Page = async({ params }: { params: { id: string } }) => {
  const headerData = await getHeaderAnalytics(params.id);
  const candidateData = await getCandidateAnalytics(params.id);
  console.log("candidateData",candidateData);
  return (
    <ApplicantAnalyticsDashboard headerData={headerData} candidateData={candidateData} />
  );
};

export default Page;
