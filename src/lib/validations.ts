import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1,'Email is required').email("Invalid email address"),
  company: z.string().optional(),
  password: z.string().nonempty('Password is required').min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().nonempty('Confirm Password is required'),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
  acceptMarketing: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerSchema>;


/////////////////////////////////////////////////// JOB APPLY FORM SCHEMA
// Personal Info Schema
export const personalInfoSchema = z.object({
  jobId: z.string().uuid(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1,"email is required").email("Please enter a valid email address"),
  phone: z
  .string()
  .min(1, "Phone number is required")
  .transform((val) => val.replace(/\s+/g, '')) // Remove all whitespace
  .refine(
    (val) => /^(\+212|0)([5-7]\d{8})$/.test(val),
    { message: "Please enter a valid Moroccan phone number" }
  ),
  city: z.string().min(1, "City is required")
});

// Education & Experience Schema
export const educationExperienceSchema = z.object({
  educationLevel: z.enum(["HIGH_SCHOOL", "ASSOCIATE", "MASTER", "PHD","BACHELOR","OTHER"]),
  experience: z.enum(["ZERO", "ONE_TWO", "THREE_FIVE", "SIX_TEN", "TEN_PLUS"])
});

// Skills & Portfolio Schema
export const skillsPortfolioSchema = z.object({
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  linkedin: z.string().url("Please enter a valid LinkedIn URL").or(z.literal('')),
  portfolio: z.string().url("Please enter a valid URL").or(z.literal('')),
  resume: z.instanceof(File, { message: "Resume is required" })
});

// Motivation Schema
export const motivationSchema = z.object({
  motivation: z.string().min(50, "Please provide at least 50 characters explaining your interest"),
  availability: z.string().min(1, "Availability is required"),
  terms: z.boolean().refine(val => val === true, "You must accept the terms")
});

export const jobApplicationSchema = z.object({
  jobId: z.string().uuid(),
  // Personal Info
  firstName: personalInfoSchema.shape.firstName,
  lastName: personalInfoSchema.shape.lastName,
  email: personalInfoSchema.shape.email,
  phone: personalInfoSchema.shape.phone,
  city: personalInfoSchema.shape.city,

  // Education & Experience
  educationLevel: educationExperienceSchema.shape.educationLevel,
  experience: educationExperienceSchema.shape.experience,
  fieldOfStudy: z.string().optional(),
  graduationYear: z.string().optional(),
  institution: z.string().optional(),

  // Skills & Portfolio
  skills: skillsPortfolioSchema.shape.skills,
  linkedin: skillsPortfolioSchema.shape.linkedin,
  portfolio: skillsPortfolioSchema.shape.portfolio,
  resume: skillsPortfolioSchema.shape.resume,

  // Motivation
  motivation: motivationSchema.shape.motivation,
  availability: motivationSchema.shape.availability,
  terms: motivationSchema.shape.terms
});

export type JobApplicationFormType = z.infer<typeof jobApplicationSchema>;
