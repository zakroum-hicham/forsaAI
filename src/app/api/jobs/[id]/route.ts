import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { JobCreateSchema } from '@/lib/validations/job'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
      status,
    } = validation.data

    const job = await prisma.job.update({
      where: { id: params.id },
      data: {
        title: jobTitle,
        type: jobType as any,
        location,
        salaryMin: salaryMin ? parseFloat(salaryMin) : null,
        salaryMax: salaryMax ? parseFloat(salaryMax) : null,
        postingDate: new Date(postingDate),
        endPostingDate: endPostingDate ? new Date(endPostingDate) : null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        description: jobDescription,
        requirements,
        status: status as any,
      },
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.error('Job update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  {  params }: {  params: { id: string } }
) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: params.id },
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    await prisma.job.delete({
      where: { id: params.id },
    })
    return NextResponse.json(
      { message: 'Job deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 })
  }
}
