import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function getUserJobs() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Not authenticated');

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) throw new Error('User not found');

  const jobs = await prisma.job.findMany({
    where: { userId: user.id }
  });

  return jobs;
}
