import * as z from 'zod';

export const employeeSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .max(100, 'Full name must be less than 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters'),
  role: z.enum(['Doctor', 'Nurse', 'Administrator'], {
    required_error: 'Role is required',
  })
});

// Shared employee code validation for login
export const employeeCodeSchema = employeeSchema.shape.employee_code;