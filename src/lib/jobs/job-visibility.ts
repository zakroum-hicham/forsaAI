"use server"
import prisma from '@/lib/prisma';

export default async function ToggleJobVisibility(jobId: string) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new Error("Job not found");
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        public: !job.public,
      },
    });

    return updatedJob;
  } catch (error: unknown) {
    throw new Error("Error toggling job visibility");
  }
}
