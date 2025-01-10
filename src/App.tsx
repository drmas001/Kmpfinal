import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/lib/contexts/auth';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { Layout } from '@/components/layout/Layout';
import { EmailLoginPage } from '@/pages/EmailLoginPage';
import { EmployeeLoginPage } from '@/pages/EmployeeLoginPage';
import { Dashboard } from '@/pages/Dashboard';
import { AdminPanel } from '@/pages/AdminPanel';
import { LandingPage } from '@/pages/LandingPage';
import { LearnMore } from '@/pages/LearnMore';
import { DonorForm } from '@/pages/DonorForm';
import { DonorEditForm } from '@/pages/DonorEditForm';
import { DonorList } from '@/pages/DonorList';
import { RecipientForm } from '@/pages/RecipientForm';
import { RecipientEditForm } from '@/pages/RecipientEditForm';
import { RecipientList } from '@/pages/RecipientList';
import { MatchingSystem } from '@/pages/MatchingSystem';
import { Reports } from '@/pages/Reports';

// Public layout without auth requirements
function PublicLayout() {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster />
    </AuthProvider>
  );
}

// Protected layout for authenticated routes
function ProtectedLayout() {
  return (
    <AuthProvider>
      <RequireAuth>
        <Layout>
          <Outlet />
        </Layout>
      </RequireAuth>
      <Toaster />
    </AuthProvider>
  );
}

// Admin layout for admin-only routes
function AdminLayout() {
  return (
    <AuthProvider>
      <RequireAuth allowedRoles={['Administrator']}>
        <Layout>
          <Outlet />
        </Layout>
      </RequireAuth>
      <Toaster />
    </AuthProvider>
  );
}

const router = createBrowserRouter([
  {
    // Public routes that don't require auth
    element: <PublicLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/login',
        element: <EmailLoginPage />,
      },
      {
        path: '/learn-more',
        element: <LearnMore />,
      },
      {
        path: '/employee-code',
        element: <EmployeeLoginPage />
      },
    ],
  },
  {
    // Protected routes that require authentication
    element: <ProtectedLayout />,
    children: [
      {
        path: '/dashboard/*',
        element: <Dashboard />
      },
      {
        path: '/donors',
        children: [
          {
            index: true,
            element: <DonorList />
          },
          {
            path: 'new',
            element: <DonorForm />
          },
          {
            path: 'edit/:id',
            element: <DonorEditForm />
          }
        ]
      },
      {
        path: '/recipients',
        children: [
          {
            index: true,
            element: <RecipientList />
          },
          {
            path: 'new',
            element: <RecipientForm />
          },
          {
            path: 'edit/:id',
            element: <RecipientEditForm />
          }
        ]
      },
      {
        path: '/matching',
        element: <MatchingSystem />
      },
      {
        path: '/reports',
        element: <Reports />
      }
    ]
  },
  {
    // Admin routes that require admin role
    element: <AdminLayout />,
    children: [
      {
        path: '/admin/*',
        element: <AdminPanel />
      }
    ]
  }
], {
  future: {
    v7_relativeSplatPath: true
  }
});

export default function App() {
  return <RouterProvider router={router} />;
}