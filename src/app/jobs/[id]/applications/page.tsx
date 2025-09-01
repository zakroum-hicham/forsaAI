import ApplicantAnalyticsDashboard from "./ApplicationDashboard";
import { getHeaderAnalytics ,getCandidateAnalytics} from "@/lib/applicationAnalytics/services";

const Page = async({ params } : { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const headerData = await getHeaderAnalytics(id);
  const candidateData = await getCandidateAnalytics(id);
  const topCandidates = candidateData?.filter(candidate => candidate?.overallScore ?? 0 >= 80);
  return (
    <ApplicantAnalyticsDashboard headerData={headerData} candidateData={candidateData} topCandidates={topCandidates} />
  );
};

export default Page;
