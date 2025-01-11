import { supabase, supabaseAdmin } from '@/lib/supabase';
import type { Employee, CreateEmployeeData, EmployeeRole } from '@/types/employee';
import type { Database } from '@/types/supabase';

type DbEmployee = Database['public']['Tables']['employees']['Row'];
type DbEmployeeInsert = Database['public']['Tables']['employees']['Insert'];

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
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
  if (authError) throw authError;

  // Then delete the employee record
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function createEmployee(employeeData: CreateEmployeeData) {
  try {
    // First create the auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: employeeData.email,
      password: employeeData.password,
      email_confirm: true
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create auth user');

    // Then create the employee record
    const newEmployee: DbEmployeeInsert = {
      id: authData.user.id,
      full_name: employeeData.fullName,
      email: employeeData.email,
      role: employeeData.role,
      employee_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      password_hash: '' // This is handled by Supabase Auth
    };

    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .insert([newEmployee])
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
function transformEmployeeData(data: DbEmployee): Employee {
  return {
    id: data.id,
    fullName: data.full_name,
    email: data.email,
    role: data.role as EmployeeRole,
    createdAt: data.created_at,
    lastActive: data.updated_at || undefined,
    employee_code: data.employee_code
  };
}