import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  try {
    console.log('\nAttempting to sign in...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'dr.mas@me.com',
      password: 'Drmas001'
    });

    if (authError) {
      console.error('\nAuth Error:', authError);
      return;
    }

    console.log('\nAuth Success:', {
      user: {
        id: authData.user?.id,
        email: authData.user?.email,
        lastSignIn: authData.user?.last_sign_in_at
      },
      session: authData.session ? 'Created' : 'Not Created'
    });

    // Try to fetch employee data
    console.log('\nFetching employee data...');
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('*')
      .eq('id', authData.user?.id)
      .single();

    if (employeeError) {
      console.error('\nEmployee Fetch Error:', employeeError);
      return;
    }

    console.log('\nEmployee Data:', employee);

  } catch (error) {
    console.error('\nUnexpected Error:', error);
  } finally {
    // Sign out after test
    await supabase.auth.signOut();
  }
}

testLogin(); 