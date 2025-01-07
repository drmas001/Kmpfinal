import { supabase, supabaseAdmin } from '@/lib/supabase';
import type { Employee } from '@/types/employee';

export async function signUpWithEmail(email: string, password: string, fullName: string, role: 'Doctor' | 'Nurse' | 'Administrator'): Promise<Employee> {
  // First, create the auth user with admin client
  const { data: auth, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    console.error('Auth creation error:', authError);
    throw new Error(`Failed to create user: ${authError.message}`);
  }

  if (!auth.user) {
    console.error('No user returned from auth creation');
    throw new Error('Failed to create auth user');
  }

  // Then create the employee record
  const { data: employee, error: employeeError } = await supabase
    .from('employees')
    .insert([{
      id: auth.user.id,
      full_name: fullName,
      email,
      role,
    }])
    .select()
    .single();

  if (employeeError) {
    console.error('Employee creation error:', employeeError);
    // If employee creation fails, we should clean up the auth user
    await supabaseAdmin.auth.admin.deleteUser(auth.user.id);
    throw new Error(`Failed to create employee record: ${employeeError.message}`);
  }

  if (!employee) {
    console.error('No employee record returned after creation');
    await supabaseAdmin.auth.admin.deleteUser(auth.user.id);
    throw new Error('Failed to create employee record');
  }

  return employee;
}

export async function signInWithEmail(email: string, password: string): Promise<Employee> {
  console.log('Attempting to sign in with email:', email);
  
  try {
    // Sign in with Supabase Auth
    const { data: { user, session }, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('Auth sign in error:', authError);
      throw new Error(`Invalid login credentials: ${authError.message}`);
    }

    if (!user || !session) {
      console.error('No user or session returned from sign in');
      throw new Error('Authentication failed: No user or session returned');
    }

    console.log('Auth successful, fetching employee data for user:', user.id);

    // Get the employee record
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('*')
      .eq('id', user.id)
      .single();

    if (employeeError) {
      console.error('Employee fetch error:', employeeError);
      await supabase.auth.signOut();
      throw new Error(`Failed to fetch employee data: ${employeeError.message}`);
    }

    if (!employee) {
      console.error('No employee record found for user:', user.id);
      await supabase.auth.signOut();
      throw new Error('Employee record not found');
    }

    console.log('Successfully retrieved employee data:', {
      id: employee.id,
      email: employee.email,
      role: employee.role
    });

    return employee;
  } catch (error) {
    // Ensure we're always throwing an Error object
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred during sign in');
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw new Error(`Failed to sign out: ${error.message}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred during sign out');
  }
}

export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      console.error('Password reset error:', error);
      throw new Error(`Failed to reset password: ${error.message}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred during password reset');
  }
}

export async function updatePassword(password: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });
    if (error) {
      console.error('Password update error:', error);
      throw new Error(`Failed to update password: ${error.message}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred during password update');
  }
}