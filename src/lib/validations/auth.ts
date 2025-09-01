import {z} from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1,"Email is required").email("Invalid email address"),
  password: z.string().min(8,"Password must be at least 8 characters long"),
  rememberMe: z.boolean().default(false)
});

export type loginSchemaType = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1,'Email is required').email("Invalid email address"),
  company: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, 'Confirm Password is required'),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
  acceptMarketing: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type registerSchemaType = z.infer<typeof registerSchema>;