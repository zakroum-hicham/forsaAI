import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import GitHubGraphQLDashboard from "./p";

const Page = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <GitHubGraphQLDashboard session={session} />
    </div>
  );
};
export default Page;