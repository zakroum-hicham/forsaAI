import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import {registerSchema} from "@/lib/validations"
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = registerSchema.parse(body)

    const { firstName, lastName, email, password, company } = parsed

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        company: company || null
      }
    })

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
