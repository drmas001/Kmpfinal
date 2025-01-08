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
          const expiresAt = new Date(session.expires_at!).getTime();
          
          if (now >= expiresAt) {
            console.log('Session expired, logging out');
            await supabase.auth.signOut();
            setEmployee(null);
            return;
          }

          // Get the employee data
          const employeeData = await fetchEmployeeData(session.user.id);
          
          if (mounted && employeeData) {
            setEmployee(employeeData);
          } else {
            // If no employee data found, sign out
            await supabase.auth.signOut();
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
      if (event === 'SIGNED_IN' && session?.user) {
        const employeeData = await fetchEmployeeData(session.user.id);
        
        if (mounted) {
          if (employeeData) {
            setEmployee(employeeData);
          } else {
            // If no employee data found, sign out
            await supabase.auth.signOut();
            setEmployee(null);
            navigate('/login');
          }
        }
      } else if (event === 'SIGNED_OUT') {
        if (mounted) {
          setEmployee(null);
          navigate('/');
        }
      } else if (event === 'TOKEN_REFRESHED') {
        // Refresh employee data when token is refreshed
        if (session?.user) {
          const employeeData = await fetchEmployeeData(session.user.id);
          if (mounted && employeeData) {
            setEmployee(employeeData);
          }
        }
      }
    });

    // Cleanup subscription and prevent memory leaks
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const login = (employee: Employee) => {
    setEmployee(employee);
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setEmployee(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Force clear the state even if the API call fails
      setEmployee(null);
      navigate('/');
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