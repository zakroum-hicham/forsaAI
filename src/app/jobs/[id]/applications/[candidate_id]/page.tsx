import { getCandidateProfile } from "@/lib/applicationAnalytics/services";
import CandidateProfile from "./CandidateProfile";

interface PageProps {
  params: {
    candidate_id: string;
    id: string;
    [key: string]: any;
  };
}

const Page = async({ params }: PageProps) => {
  const {id, candidate_id} = await params
  const CandidateProfileData = await getCandidateProfile(id, candidate_id)
  // console.log(CandidateProfileData)
  
  return (
   <CandidateProfile data={CandidateProfileData} />
  );
};
export default Page;