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

async function deleteAuthUser() {
  try {
    // List all users
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) throw listError;
    
    // Find and delete user with our email
    const targetEmail = 'dr.mas@me.com';
    const user = users.find(u => u.email?.toLowerCase() === targetEmail.toLowerCase());
    
    if (user) {
      console.log('Found user:', user);
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
      if (deleteError) throw deleteError;
      console.log('Successfully deleted auth user');
    } else {
      console.log('No user found with email:', targetEmail);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

deleteAuthUser(); 