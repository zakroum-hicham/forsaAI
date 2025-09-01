import prisma from '@/lib/prisma';

export const GetPublicJobs = async () =>  {
  const publicJobs = await prisma.job.findMany({
  where: {
    public: true,
  },
});
  return publicJobs;
};

