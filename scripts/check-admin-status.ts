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

async function checkAdminStatus() {
  try {
    // Check auth users
    console.log('\nChecking Auth Users...');
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) throw authError;
    
    const adminUser = users.find(u => u.email?.toLowerCase() === 'dr.mas@me.com');
    console.log('\nAuth User Status:', adminUser ? {
      id: adminUser.id,
      email: adminUser.email,
      emailConfirmed: adminUser.email_confirmed_at,
      lastSignIn: adminUser.last_sign_in_at,
      createdAt: adminUser.created_at
    } : 'Not found');

    // Check employees table
    console.log('\nChecking Employees Table...');
    const { data: employees, error: dbError } = await supabase
      .from('employees')
      .select('*')
      .eq('email', 'dr.mas@me.com');

    if (dbError) throw dbError;
    
    console.log('\nEmployee Record:', employees?.length ? employees[0] : 'Not found');

    // Check if IDs match
    if (adminUser && employees?.length) {
      console.log('\nID Match Check:');
      console.log('Auth User ID:', adminUser.id);
      console.log('Employee ID:', employees[0].id);
      console.log('IDs Match:', adminUser.id === employees[0].id);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkAdminStatus(); 