import { supabase, supabaseAdmin } from '@/lib/supabase';
import type { Employee, CreateEmployeeData } from '@/types/employee';

export async function getEmployees() {
  const { data: employees, error } = await supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return employees.map(transformEmployeeData);
}

export async function deleteEmployee(id: string) {
  // First, delete the auth user using admin client
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id as any);
  if (authError) throw authError;

  // Then delete the employee record
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id as any);

  if (error) throw error;
}

export async function createEmployee(data: CreateEmployeeData) {
  try {
    // First create the auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create auth user');

    // Then create the employee record
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .insert({
        id: authData.user.id,
        full_name: data.fullName,
        email: data.email,
        role: data.role,
        employee_code: data.employee_code
      } as any)
      .select()
      .single();

    if (employeeError) {
      // If employee creation fails, delete the auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw employeeError;
    }

    return transformEmployeeData(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
}

// Helper function to transform database employee data to match the Employee type
function transformEmployeeData(data: any): Employee {
  return {
    id: data.id,
    fullName: data.full_name,
    email: data.email,
    role: data.role,
    createdAt: data.created_at,
    lastActive: data.last_active,
    employee_code: data.employee_code
  };
}