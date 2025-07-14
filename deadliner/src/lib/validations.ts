import * as z from 'zod';

export const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

export const verificationSchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 characters'),
});

export const taskSchema = z.object({
  name: z.string().min(1, 'Task name is required'),
  deadline: z.string().refine((val: string) => {
    const date = new Date(val);
    return date > new Date();
  }, 'Deadline must be in the future'),
});

export type AuthSchema = z.infer<typeof authSchema>;
export type VerificationSchema = z.infer<typeof verificationSchema>;
export type TaskSchema = z.infer<typeof taskSchema>; 