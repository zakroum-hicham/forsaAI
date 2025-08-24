import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import ForsaAILanding from "@/components/ForsaAILanding";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === "recruiter") {
    redirect("/dashboard");
  }

  return <ForsaAILanding />;
}
