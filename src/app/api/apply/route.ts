import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma  from '@/lib/prisma'; 
import { getServerSession } from 'next-auth'; 
import { authOptions } from '../auth/[...nextauth]/route';

const ApplicationSchema = z.object({
  jobId: z.string().uuid(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  university: z.string().optional(),
  major: z.string().optional(),
  graduationYear: z.string().optional(),
  githubConnected: z.boolean(),
   linkedinUrl: z
    .string()
    .url({ message: "Invalid URL format" })
    .optional()
    .or(z.literal('').transform(() => undefined)), // Handle empty string
  portfolioUrl: z
    .string()
    .url({ message: "Invalid URL format" })
    .optional()
    .or(z.literal('').transform(() => undefined)), // Handle empty string
  devpostUsername: z.string().optional(),
  whyInterested: z.string().min(1, "Why interested is required")
});

export async function POST(req: NextRequest) {
  try {
    // Get the session (this ensures the user is authenticated)
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'You must be signed in to apply' },
        { status: 401 } // Unauthorized
      );
    }

    const body = await req.json();

    const data = ApplicationSchema.parse(body);

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: data.jobId }
    });

    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }

    // Check if user has already applied to this job
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        jobId: data.jobId,
        userId: session.user.id
      }
    });

    if (existingApplication) {
      return NextResponse.json(
        { success: false, message: 'You have already applied to this job' },
        { status: 409 } // Conflict status code
      );
    }

    // Save to DB
    await prisma.jobApplication.create({
      data: {
        jobId: data.jobId,
        userId: session.user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        university: data.university,
        major: data.major,
        graduationYear: data.graduationYear,
        githubConnected: data.githubConnected,
        linkedinUrl: data.linkedinUrl,
        portfolioUrl: data.portfolioUrl,
        devpostUsername: data.devpostUsername,
        whyInterested: data.whyInterested
      }
    });

    return NextResponse.json(
      { success: true, message: 'Application submitted successfully' },
      { status: 200 }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    console.error('Error submitting application:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
