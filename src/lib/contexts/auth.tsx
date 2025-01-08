import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { Employee } from '@/types/employee';

interface AuthContextType {
  employee: Employee | null;
  isLoading: boolean;
  login: (employee: Employee) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch employee data
  const fetchEmployeeData = async (userId: string) => {
    try {
      const { data: employeeData, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return employeeData;
    } catch (error) {
      console.error('Error fetching employee data:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Check if we have an active session
    const checkSession = async () => {
      try {
        setIsLoading(true);
        
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (session?.user) {
          // Verify session expiry
          const now = new Date().getTime();
          const expiresAt = session.expires_at ? new Date(session.expires_at).getTime() : 0;
          
          if (now >= expiresAt) {
            console.log('Session expired, logging out');
            await supabase.auth.signOut();
            if (mounted) {
              setEmployee(null);
            }
            return;
          }

          // Get the employee data
          const employeeData = await fetchEmployeeData(session.user.id);
          
          if (mounted) {
            if (employeeData) {
              console.log('Setting employee data:', employeeData);
              setEmployee(employeeData);
            } else {
              // If no employee data found, sign out
              console.log('No employee data found, signing out');
              await supabase.auth.signOut();
              setEmployee(null);
            }
          }
        } else {
          if (mounted) {
            setEmployee(null);
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        // On error, clear the session and employee data
        await supabase.auth.signOut();
        if (mounted) {
          setEmployee(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Initial session check
    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        const employeeData = await fetchEmployeeData(session.user.id);
        
        if (mounted) {
          if (employeeData) {
            console.log('Setting employee data after sign in:', employeeData);
            setEmployee(employeeData);
          } else {
            // If no employee data found, sign out
            console.log('No employee data found after sign in, signing out');
            await supabase.auth.signOut();
            setEmployee(null);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        if (mounted) {
          setEmployee(null);
          navigate('/login', { replace: true });
        }
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed');
        // Refresh employee data when token is refreshed
        if (session?.user) {
          const employeeData = await fetchEmployeeData(session.user.id);
          if (mounted && employeeData) {
            console.log('Setting employee data after token refresh:', employeeData);
            setEmployee(employeeData);
          }
        }
      }
    });

    // Cleanup subscription and prevent memory leaks
    return () => {
      console.log('Cleaning up auth provider');
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const login = (employee: Employee) => {
    console.log('Login called with employee:', employee);
    setEmployee(employee);
  };

  const logout = async () => {
    try {
      console.log('Logging out');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setEmployee(null);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Force clear the state even if the API call fails
      setEmployee(null);
      navigate('/login', { replace: true });
    }
  };

  return (
    <AuthContext.Provider value={{ employee, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}