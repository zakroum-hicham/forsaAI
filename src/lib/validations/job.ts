import { z } from 'zod'

export const JobCreateSchema = z.object({
  jobTitle: z.string().min(3, "Job title must be at least 3 characters"),
  jobType: z.enum(['INTERNSHIP', 'FULL_TIME', 'PART_TIME', 'CONTRACT']),
  location: z.string().optional(),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  postingDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid posting date"
  }),
  endPostingDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
    message: "Invalid end posting date"
  }),
  startDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
    message: "Invalid start date"
  }),
  endDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
    message: "Invalid end date"
  }),
  jobDescription: z.string().min(50, "Description must be at least 50 characters"),
  requirements: z.string().min(50, "Requirements must be at least 50 characters"),
  status: z.enum(['DRAFT', 'ACTIVE'])
})