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

  useEffect(() => {
    // Check if we have an active session
    const checkSession = async () => {
      try {
        setIsLoading(true);
        
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get the employee data
          const { data: employeeData, error } = await supabase
            .from('employees')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) throw error;
          
          setEmployee(employeeData);
        }
      } catch (error) {
        console.error('Session check error:', error);
        setEmployee(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial session check
    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: employeeData, error } = await supabase
          .from('employees')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!error) {
          setEmployee(employeeData);
        }
      } else if (event === 'SIGNED_OUT') {
        setEmployee(null);
        navigate('/');
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const login = (employee: Employee) => {
    setEmployee(employee);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setEmployee(null);
    navigate('/');
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