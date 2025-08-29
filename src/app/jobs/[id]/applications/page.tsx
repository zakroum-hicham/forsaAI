import ApplicantAnalyticsDashboard from "./ApplicationDashboard";
import { getHeaderAnalytics ,getCandidateAnalytics} from "@/lib/applicationAnalytics/services";

const Page = async({ params }: { params: { id: string } }) => {
  const headerData = await getHeaderAnalytics(params.id);
  const candidateData = await getCandidateAnalytics(params.id);
  const topCandidates = candidateData?.filter(candidate => candidate.overallScore >= 80);
  return (
    <ApplicantAnalyticsDashboard headerData={headerData} candidateData={candidateData} topCandidates={topCandidates} />
  );
};

export default Page;
