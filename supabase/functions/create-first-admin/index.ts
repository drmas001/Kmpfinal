// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if any admin exists
    const { data: existingAdmins, error: checkError } = await supabaseClient
      .from('employees')
      .select('id')
      .eq('role', 'Administrator')
      .limit(1);

    if (checkError) throw checkError;

    if (existingAdmins && existingAdmins.length > 0) {
      return new Response(
        JSON.stringify({ error: 'An administrator account already exists' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Create auth user
    const { data: auth, error: authError } = await supabaseClient.auth.admin.createUser({
      email: 'Dr.mas@me.com',
      password: 'Drmas001',
      email_confirm: true,
    });

    if (authError) throw authError;

    // Create employee record
    const { data: employee, error: employeeError } = await supabaseClient
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

    if (employeeError) throw employeeError;

    return new Response(
      JSON.stringify({ message: 'Admin account created successfully', employee }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-first-admin' \
    --header 'Authorization: Bearer ' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
