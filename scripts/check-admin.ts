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

async function checkAdmin() {
  try {
    // Check admin in employees table
    const { data: employees, error: employeeError } = await supabase
      .from('employees')
      .select('*')
      .eq('role', 'Administrator');

    if (employeeError) throw employeeError;
    
    console.log('Existing admin accounts:', employees);

    // Check auth user
    if (employees && employees.length > 0) {
      for (const employee of employees) {
        const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(employee.id);
        if (authError) {
          console.error(`Auth error for employee ${employee.id}:`, authError);
        } else {
          console.log('Auth user:', authUser);
        }
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkAdmin(); 