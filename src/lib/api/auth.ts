import { supabase } from '@/lib/supabase';
import type { Employee } from '@/types/employee';
import type { Database } from '@/types/supabase';
import { employeeCodeSchema } from '@/lib/validations/employee';

type EmployeeRow = Database['public']['Tables']['employees']['Row'] & {
  email: string;
};

export async function loginWithEmployeeCode(employeeCode: string): Promise<Employee> {
  try {
    // Validate and normalize the employee code
    const normalizedCode = employeeCodeSchema.parse(employeeCode);
    
    // Try exact match first
    const { data: employee, error } = await supabase
      .from('employees')
      .select('id, full_name, role, created_at, employee_code, email')
      .eq('employee_code', normalizedCode as any)
      .single() as unknown as { data: EmployeeRow | null, error: any };

    if (!error && employee) {
      return {
        id: employee.id,
        fullName: employee.full_name,
        role: employee.role,
        createdAt: employee.created_at,
        employee_code: employee.employee_code,
        email: employee.email
      };
    }

    // Try case-insensitive match as fallback
    const { data: fallbackEmployee, error: fallbackError } = await supabase
      .from('employees')
      .select('id, full_name, role, created_at, employee_code, email')
      .ilike('employee_code', normalizedCode as any)
      .single() as unknown as { data: EmployeeRow | null, error: any };

    if (fallbackError || !fallbackEmployee) {
      throw new Error('Invalid employee code');
    }

    return {
      id: fallbackEmployee.id,
      fullName: fallbackEmployee.full_name,
      role: fallbackEmployee.role,
      createdAt: fallbackEmployee.created_at,
      employee_code: fallbackEmployee.employee_code,
      email: fallbackEmployee.email
    };
  } catch (error) {
    console.error('Employee verification error:', {
      error,
      code: employeeCode
    });
    throw new Error('Invalid employee code');
  }
}