import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/contexts/auth';
import type { EmployeeRole } from '@/types/employee';
import { useEffect, useState } from 'react';

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles?: EmployeeRole[];
}

export function RequireAuth({ children, allowedRoles }: RequireAuthProps) {
  const { user, employee, isLoading, checkEmployeeData } = useAuth();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (user && !employee) {
        // Only verify employee data if we have a user but no employee
        await checkEmployeeData();
      }
      setIsVerifying(false);
    };

    verifyAuth();
  }, [user, employee, checkEmployeeData]);

  // Show loading state while checking auth
  if (isLoading || isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  // First check Supabase auth
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Then check employee auth
  if (!employee) {
    // Only store redirect if we're not already on the employee code page
    if (!location.pathname.includes('/employee-code')) {
      sessionStorage.setItem('auth_redirect', location.pathname);
    }
    return <Navigate to="/employee-code" state={{ from: location }} replace />;
  }

  // Finally check role-based access if specified
  if (allowedRoles && !allowedRoles.includes(employee.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}