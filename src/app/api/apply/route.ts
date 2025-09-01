import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma'; 
import { getServerSession } from 'next-auth'; 
import { authOptions } from "@/lib/auth";
import { jobApplicationSchema } from '@/lib/validations';
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const session : SessionType = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'You must be signed in to apply' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const jobId = formData.get('jobId') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const city = formData.get('city') as string;
    const educationLevel = formData.get('educationLevel');
    const institution = formData.get('institution') as string;
    const fieldOfStudy = formData.get('fieldOfStudy') as string;
    const graduationYear = formData.get('graduationYear') as string;
    const experience = formData.get('experience');
    const skills = JSON.parse(formData.get('skills') as string) as string[];
    const linkedin = formData.get('linkedin') as string;
    const portfolio = formData.get('portfolio') as string;
    const motivation = formData.get('motivation') as string;
    const terms = formData.get('terms') === 'true';
    const availability = formData.get('availability') as string;
    const resumeFile = formData.get('resume') as File | null;

    if (!resumeFile) {
      return NextResponse.json({ success: false, message: 'Resume is required' }, { status: 400 });
    }

    // Validate file type and size
    if (resumeFile.type !== 'application/pdf') {
      return NextResponse.json({ success: false, message: 'Only PDF files are allowed' }, { status: 400 });
    }

    if (resumeFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Validate other fields with Zod
    const data = jobApplicationSchema.parse({
      jobId,
      firstName,
      lastName,
      email,
      phone,
      city,
      educationLevel,
      institution,
      fieldOfStudy,
      graduationYear,
      experience,
      skills,
      linkedin,
      portfolio,
      motivation,
      terms,
      availability,
      resume: resumeFile,
    });

    // Check job existence
    const job = await prisma.job.findUnique({ where: { id: data.jobId } });
    if (!job) return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });

    // Check if already applied
    const existingApplication = await prisma.jobApplication.findFirst({
      where: { jobId: data.jobId, userId: session.user.id },
    });
    if (existingApplication) {
      return NextResponse.json({ success: false, message: 'You have already applied to this job' }, { status: 409 });
    }

    // Save resume
    const bytes = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = Date.now() + resumeFile.name;
    await writeFile(path.join(process.cwd(), filename), buffer);

    // Save application to DB
    await prisma.jobApplication.create({
      data: {
        jobId: data.jobId,
        userId: session.user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        city: data.city,
        educationLevel: data.educationLevel,
        institution: data.institution,
        fieldOfStudy: data.fieldOfStudy,
        graduationYear: data.graduationYear,
        experience: data.experience,
        skills: data.skills,
        linkedinUrl: data.linkedin,
        portfolioUrl: data.portfolio,
        whyInterested: data.motivation,
        termsAccepted: data.terms,
      },
    });

    return NextResponse.json({ success: true, message: 'Application submitted successfully' }, { status: 200 });

  } catch (err: unknown) {
    // Proper type narrowing for errors
    if (err instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: err.flatten().fieldErrors,
      }, { status: 400 });
    }

    console.error('Error submitting application:', err instanceof Error ? err.message : err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
