import ApplicantAnalyticsDashboard from "./ApplicationDashboard";
import { getHeaderAnalytics } from "@/lib/applicationAnalytics/services";

const Page = async({ params }: { params: { id: string } }) => {
  const headerData = await getHeaderAnalytics(params.id);
  return (
    <ApplicantAnalyticsDashboard headerData={headerData} />
  );
};

export default Page;
