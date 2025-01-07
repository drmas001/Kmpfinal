import { supabase, supabaseAdmin } from '@/lib/supabase';
import type { Employee } from '@/types/employee';

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

// Helper function to transform database employee data to match the Employee type
function transformEmployeeData(data: any): Employee {
  return {
    id: data.id,
    fullName: data.full_name,
    email: data.email,
    role: data.role,
    createdAt: data.created_at,
    lastActive: data.last_active,
  };
}