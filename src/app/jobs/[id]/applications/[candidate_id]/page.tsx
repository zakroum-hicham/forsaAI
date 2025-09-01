import { CandidateProfileDataType, getCandidateProfile } from "@/lib/applicationAnalytics/services";
import CandidateProfile from "./CandidateProfile";

const Page = async({ params }: { params: Promise<{ id: string, candidate_id: string }> }) => {
  const { id, candidate_id } = await params
  const CandidateProfileData = await getCandidateProfile(id, candidate_id)
  // console.log(CandidateProfileData)
  
  return (
   <CandidateProfile data={CandidateProfileData} />
  );
};
export default Page;