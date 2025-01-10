import { supabase } from '@/lib/supabase';
import type { Employee } from '@/types/employee';
import { employeeCodeSchema } from '@/lib/validations/employee';

export async function loginWithEmployeeCode(employeeCode: string): Promise<Employee> {
  try {
    // Validate and normalize the employee code
    const normalizedCode = employeeCodeSchema.parse(employeeCode);
    
    // Try exact match first
    const { data: employee, error } = await supabase
      .from('employees')
      .select('*')
      .eq('employee_code', normalizedCode)
      .single();

    if (!error && employee) {
      return employee;
    }

    // Try case-insensitive match as fallback
    const { data: fallbackEmployee, error: fallbackError } = await supabase
      .from('employees')
      .select('*')
      .ilike('employee_code', normalizedCode)
      .single();

    if (fallbackError || !fallbackEmployee) {
      throw new Error('Invalid employee code');
    }

    return fallbackEmployee;
  } catch (error) {
    console.error('Employee verification error:', {
      error,
      code: employeeCode
    });
    throw new Error('Invalid employee code');
  }
}