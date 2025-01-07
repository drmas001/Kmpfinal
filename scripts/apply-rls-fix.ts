import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';

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

async function applyRLSFix() {
  try {
    console.log('\nApplying RLS fix...');
    
    // Read the SQL file
    const sqlPath = resolve(__dirname, '../supabase/migrations/20240106_fix_rls.sql');
    const sql = readFileSync(sqlPath, 'utf8');

    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql });

    if (error) {
      console.error('\nError applying RLS fix:', error);
      return;
    }

    console.log('\nRLS fix applied successfully');

  } catch (error) {
    console.error('\nUnexpected error:', error);
  }
}

applyRLSFix(); 