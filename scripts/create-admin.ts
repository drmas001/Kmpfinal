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

async function createFirstAdmin() {
  try {
    // Check if any admin exists
    const { data: existingAdmins, error: checkError } = await supabase
      .from('employees')
      .select('id')
      .eq('role', 'Administrator')
      .limit(1);

    if (checkError) throw checkError;

    if (existingAdmins && existingAdmins.length > 0) {
      console.error('An administrator account already exists');
      return;
    }

    // Create auth user with admin privileges
    const { data: auth, error: createUserError } = await supabase.auth.admin.createUser({
      email: 'Dr.mas@me.com',
      password: 'Drmas001',
      email_confirm: true,
    });

    if (createUserError) throw createUserError;
    if (!auth.user) throw new Error('Failed to create auth user');

    // Create the employee record
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .insert([
        {
          id: auth.user.id,
          full_name: 'Dr. Mas',
          email: 'Dr.mas@me.com',
          role: 'Administrator',
        },
      ])
      .select()
      .single();

    if (employeeError) {
      // If employee creation fails, we should clean up the auth user
      await supabase.auth.admin.deleteUser(auth.user.id);
      throw employeeError;
    }

    console.log('Admin account created successfully:', employee);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createFirstAdmin(); 