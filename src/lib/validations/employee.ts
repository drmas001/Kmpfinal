import * as z from 'zod';

export const employeeSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .max(100, 'Full name must be less than 100 characters'),
  role: z.enum(['Doctor', 'Nurse', 'Administrator'], {
    required_error: 'Role is required',
  }),
  employeeCode: z
    .string()
    .min(4, 'Employee code must be at least 4 characters')
    .max(20, 'Employee code must be less than 20 characters')
    .regex(
      /^[A-Za-z0-9][-A-Za-z0-9]*[A-Za-z0-9]$/,
      'Employee code must start and end with a letter or number, and can contain hyphens in between'
    )
    .transform(code => code.trim()),
});

// Shared employee code validation for login
export const employeeCodeSchema = employeeSchema.shape.employeeCode;