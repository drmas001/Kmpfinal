import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function cleanupAndCreateAdmin() {
  try {
    // Get existing admin users
    const { data: employees, error: fetchError } = await supabase
      .from('employees')
      .select('id')
      .eq('role', 'Administrator');

    if (fetchError) throw fetchError;

    // Delete auth users for existing admins
    if (employees) {
      for (const employee of employees) {
        await supabase.auth.admin.deleteUser(employee.id);
      }
    }

    // Delete existing admin records
    const { error: deleteError } = await supabase
      .from('employees')
      .delete()
      .eq('role', 'Administrator');

    if (deleteError) throw deleteError;
    console.log('Cleaned up existing admin records');

    // Create new auth user
    const { data: auth, error: createUserError } = await supabase.auth.admin.createUser({
      email: 'dr.mas@me.com',
      password: 'Drmas001',
      email_confirm: true,
    });

    if (createUserError) throw createUserError;
    if (!auth.user) throw new Error('Failed to create auth user');

    console.log('Created auth user:', auth.user);

    // Create employee record
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .insert([
        {
          id: auth.user.id,
          full_name: 'Dr. Mas',
          email: 'dr.mas@me.com',
          role: 'Administrator',
        },
      ])
      .select()
      .single();

    if (employeeError) {
      // If employee creation fails, clean up the auth user
      await supabase.auth.admin.deleteUser(auth.user.id);
      throw employeeError;
    }

    console.log('Created employee record:', employee);
    console.log('\nYou can now log in with:');
    console.log('Email: dr.mas@me.com');
    console.log('Password: Drmas001');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

cleanupAndCreateAdmin(); 