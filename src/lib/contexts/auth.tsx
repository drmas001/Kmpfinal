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
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  employee: Employee | null;
  isLoading: boolean;
  login: (employee: Employee) => void;
  logout: () => Promise<void>;
  checkEmployeeData: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to verify employee data
  const checkEmployeeData = async () => {
    try {
      const storedEmployee = sessionStorage.getItem('employee');
      if (!storedEmployee) {
        return false;
      }

      const employee = JSON.parse(storedEmployee) as Employee;
      if (!employee?.id || !employee?.employee_code) {
        sessionStorage.removeItem('employee');
        setEmployee(null);
        return false;
      }

      // Verify employee still exists in database
      const { data: employeeData, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', employee.id as any)
        .single();

      if (error || !employeeData) {
        console.error('Employee verification failed:', error);
        sessionStorage.removeItem('employee');
        setEmployee(null);
        return false;
      }

      const transformedEmployee: Employee = {
        id: (employeeData as any).id,
        fullName: (employeeData as any).full_name,
        email: (employeeData as any).email,
        role: (employeeData as any).role,
        createdAt: (employeeData as any).created_at,
        employee_code: (employeeData as any).employee_code
      };

      setEmployee(transformedEmployee);
      return true;
    } catch (error) {
      console.error('Error checking employee data:', error);
      sessionStorage.removeItem('employee');
      setEmployee(null);
      return false;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        // Check Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session?.user) {
          // Verify employee data if session exists
          await checkEmployeeData();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid session data
        setUser(null);
        setEmployee(null);
        sessionStorage.removeItem('employee');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        // Clear employee data when Supabase session ends
        setEmployee(null);
        sessionStorage.removeItem('employee');
      } else {
        // Verify employee data on session change
        await checkEmployeeData();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = (employee: Employee) => {
    setEmployee(employee);
    sessionStorage.setItem('employee', JSON.stringify(employee));
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear all auth-related storage
      setUser(null);
      setEmployee(null);
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('employee');
      sessionStorage.removeItem('auth_redirect');

      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    user,
    employee,
    isLoading,
    login,
    logout,
    checkEmployeeData
  };

  return (
    <AuthContext.Provider value={value}>
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