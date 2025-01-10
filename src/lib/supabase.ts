import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Default session length (24 hours)
const DEFAULT_SESSION_LENGTH = 60 * 60 * 24;
// Extended session length (7 days)
const EXTENDED_SESSION_LENGTH = 60 * 60 * 24 * 7;

// Log timezone information for debugging
console.log('Client timezone:', {
  name: Intl.DateTimeFormat().resolvedOptions().timeZone,
  offset: new Date().getTimezoneOffset(),
  current: new Date().toISOString()
});

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'supabase.auth.token',
    flowType: 'pkce',
    debug: true,
    cookieOptions: {
      name: 'sb-auth-token',
      lifetime: EXTENDED_SESSION_LENGTH,
      domain: window.location.hostname,
      sameSite: 'Lax',
      path: '/',
      secure: window.location.protocol === 'https:'
    }
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'kidney-match-pro'
    }
  }
});

// Add helper functions for session management
export const clearAllSessionData = async () => {
  console.log('Clearing all session data');
  try {
    // First sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error during sign out:', error);
    }
    // Then clear storage
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.removeItem('employee');
    sessionStorage.removeItem('auth_redirect');
  } catch (error) {
    console.error('Error clearing session data:', error);
  }
};

export const getSessionWithDebug = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    console.log('Session state:', {
      exists: !!session,
      user: session?.user?.email,
      expires: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
      error: error?.message
    });
    return { session, error };
  } catch (error) {
    console.error('Error getting session:', error);
    return { session: null, error };
  }
};

// Helper to set session expiry
export const setSessionExpiry = async (rememberMe: boolean) => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      console.error('Error getting session for expiry update:', error);
      return;
    }

    // Update session cookie expiry
    document.cookie = `sb-auth-token=${session.access_token}; max-age=${
      rememberMe ? EXTENDED_SESSION_LENGTH : DEFAULT_SESSION_LENGTH
    }; path=/; domain=${window.location.hostname}; samesite=Lax${
      window.location.protocol === 'https:' ? '; secure' : ''
    }`;
  } catch (error) {
    console.error('Error setting session expiry:', error);
  }
};