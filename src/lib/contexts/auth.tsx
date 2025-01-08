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

  // Function to fetch employee data with retry logic
  const fetchEmployeeData = async (userId: string) => {
    try {
      const { data: employeeData, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching employee data:', error);
        return null;
      }
      return employeeData;
    } catch (error) {
      console.error('Error fetching employee data:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;

    // Check if we have an active session
    const checkSession = async () => {
      try {
        if (!mounted) return;
        setIsLoading(true);
        
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (mounted) {
            setEmployee(null);
            setIsLoading(false);
          }
          return;
        }

        if (session?.user) {
          // Verify session expiry
          const now = new Date().getTime();
          const expiresAt = session.expires_at ? new Date(session.expires_at).getTime() : 0;
          
          if (now >= expiresAt) {
            console.log('Session expired, logging out');
            await supabase.auth.signOut();
            if (mounted) {
              setEmployee(null);
              setIsLoading(false);
            }
            return;
          }

          // Get the employee data
          const employeeData = await fetchEmployeeData(session.user.id);
          
          if (mounted) {
            if (employeeData) {
              setEmployee(employeeData);
            } else {
              await supabase.auth.signOut();
              setEmployee(null);
            }
            setIsLoading(false);
          }
        } else {
          if (mounted) {
            setEmployee(null);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        if (mounted) {
          setEmployee(null);
          setIsLoading(false);
        }
      }
    };

    // Initial session check
    checkSession();

    // Subscribe to auth changes
    const setupAuthSubscription = async () => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session?.user) {
          const employeeData = await fetchEmployeeData(session.user.id);
          
          if (mounted) {
            if (employeeData) {
              setEmployee(employeeData);
            } else {
              await supabase.auth.signOut();
              setEmployee(null);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          if (mounted) {
            setEmployee(null);
            navigate('/login', { replace: true });
          }
        } else if (event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            const employeeData = await fetchEmployeeData(session.user.id);
            if (mounted && employeeData) {
              setEmployee(employeeData);
            }
          }
        }
      });
      
      if (mounted) {
        authSubscription = subscription;
      }
    };

    setupAuthSubscription();

    // Cleanup subscription and prevent memory leaks
    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [navigate]);

  const login = (employee: Employee) => {
    setEmployee(employee);
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setEmployee(null);
      setIsLoading(false);
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