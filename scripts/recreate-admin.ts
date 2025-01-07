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

async function recreateAdmin() {
  try {
    // 1. Delete existing admin user if exists
    console.log('\nChecking for existing admin...');
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) throw listError;
    
    const existingAdmin = users.find(u => u.email?.toLowerCase() === 'dr.mas@me.com');
    if (existingAdmin) {
      console.log('\nDeleting existing admin user...');
      const { error: deleteError } = await supabase.auth.admin.deleteUser(existingAdmin.id);
      if (deleteError) throw deleteError;
    }

    // 2. Delete employee record
    console.log('\nCleaning up employee records...');
    const { error: deleteEmpError } = await supabase
      .from('employees')
      .delete()
      .eq('email', 'dr.mas@me.com');

    if (deleteEmpError) throw deleteEmpError;

    // 3. Create new admin user
    console.log('\nCreating new admin user...');
    const { data: auth, error: createError } = await supabase.auth.admin.createUser({
      email: 'dr.mas@me.com',
      password: 'Drmas001',
      email_confirm: true,
    });

    if (createError) throw createError;
    if (!auth.user) throw new Error('Failed to create auth user');

    // 4. Create employee record
    console.log('\nCreating employee record...');
    const { data: employee, error: empError } = await supabase
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

    if (empError) {
      // Cleanup if employee creation fails
      await supabase.auth.admin.deleteUser(auth.user.id);
      throw empError;
    }

    console.log('\nAdmin account recreated successfully:', {
      id: employee.id,
      email: employee.email,
      role: employee.role
    });

    // 5. Test login
    console.log('\nTesting login...');
    const testClient = createClient(supabaseUrl, process.env.VITE_SUPABASE_ANON_KEY!);
    
    const { data: signInData, error: signInError } = await testClient.auth.signInWithPassword({
      email: 'dr.mas@me.com',
      password: 'Drmas001'
    });

    if (signInError) throw signInError;

    console.log('\nLogin test successful:', {
      user: signInData.user?.email,
      session: signInData.session ? 'Created' : 'Not Created'
    });

  } catch (error) {
    console.error('\nError:', error);
  }
}

recreateAdmin(); 