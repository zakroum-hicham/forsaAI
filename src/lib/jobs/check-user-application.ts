import prisma  from '@/lib/prisma';
export interface UserApplication {
  id: string;
  appliedDate: Date;
}

export async function CheckUserApplication(
  jobId: string, 
  userId: string
): Promise<UserApplication | null> {
    const application = await prisma.jobApplication.findFirst({
      where: {
        jobId: jobId,
        userId: userId,
      },
      select: {
        id: true,
        createdAt: true,
      }
    });

    if (!application) {
      return null;
    }

    return {
      id: application.id,
      appliedDate: application.createdAt,
    };
}