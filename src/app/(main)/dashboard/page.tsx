import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';


// Data Services
import { getDashboardData } from '@/lib/dashboard/dashboard-services';
import DashboardPage from './_client';


export const metadata: Metadata = {
  title: 'Recruiter Dashboard | ForsaAI',
  description: 'Your AI-powered recruitment command center',
};

// Revalidate the page every 5 minutes to keep data fresh
// export const revalidate = 300;

export default async function Page() {
  // Check authentication
  const session : SessionType = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch real dashboard data from database
  let dashboardData;
  try {
    dashboardData = await getDashboardData(session.user.id);
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    // Handle error gracefully - could show error page or fallback
    throw new Error('Failed to load dashboard data');
  }

  return (
  <DashboardPage session={session} dashboardData={dashboardData}/>
);
}