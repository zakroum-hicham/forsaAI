import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authOptions } from "@/lib/auth";
import { JobCreateSchema } from '@/lib/validations/job'

export async function POST(req: NextRequest) {
    const session : SessionType = await getServerSession(authOptions)
    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email! },
        })
        
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }
        
    const body = await req.json()
    const validation = JobCreateSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues },
        { status: 400 }
      )
    }

    const { 
      jobTitle, 
      jobType, 
      location, 
      salaryMin, 
      salaryMax, 
      postingDate, 
      endPostingDate, 
      startDate, 
      endDate, 
      jobDescription, 
      requirements, 
      status 
    } = validation.data


    const job = await prisma.job.create({
      data: {
        title: jobTitle,
        type: jobType,
        location: location,
        salaryMin: parseInt(salaryMin || '') || null,
        salaryMax: parseInt(salaryMax || '') || null,
        postingDate: new Date(postingDate),
        endPostingDate: endPostingDate ? new Date(endPostingDate) : null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        description: jobDescription,
        requirements,
        status: status,
        userId: user.id,
        // company: company,
      }
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.error('Job creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const session : SessionType = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
   const user = await prisma.user.findUnique({
      where: { email: session.user.email! as string }, 
        });

   if (!user) {
     return NextResponse.json({ error: 'User not found' }, { status: 404 });
   }

   const jobs = await prisma.job.findMany({
      where: {
        userId: user.id,
      },
    });
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}