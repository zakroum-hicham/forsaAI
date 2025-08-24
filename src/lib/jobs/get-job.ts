import prisma from '@/lib/prisma';

export const GetJob = async (id: string) => {
  const job = await prisma.job.findUnique({
    where: { id }
  });
  return job;
};

