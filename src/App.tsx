import { Routes, Route, Navigate } from 'react-router-dom';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { Layout } from '@/components/layout/Layout';
import { LoginPage } from '@/pages/LoginPage';
import { LandingPage } from '@/pages/LandingPage';
import { LearnMore } from '@/pages/LearnMore';
import { Dashboard } from '@/pages/Dashboard';
import { DonorForm } from '@/pages/DonorForm';
import { DonorEditForm } from '@/pages/DonorEditForm';
import { DonorList } from '@/pages/DonorList';
import { RecipientForm } from '@/pages/RecipientForm';
import { RecipientEditForm } from '@/pages/RecipientEditForm';
import { RecipientList } from '@/pages/RecipientList';
import { MatchingSystem } from '@/pages/MatchingSystem';
import { Reports } from '@/pages/Reports';
import { AdminPanel } from '@/pages/AdminPanel';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/lib/contexts/auth';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes - Only Landing, Login, and Learn More */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/learn-more" element={<LearnMore />} />
        
        {/* Protected Routes - Require Authentication */}
        <Route element={<RequireAuth><Layout /></RequireAuth>}>
          {/* Dashboard - Main authenticated landing page */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Donor Management */}
          <Route path="/donors">
            <Route index element={<DonorList />} />
            <Route path="new" element={<DonorForm />} />
            <Route path="edit/:id" element={<DonorEditForm />} />
          </Route>
          
          {/* Recipient Management */}
          <Route path="/recipients">
            <Route index element={<RecipientList />} />
            <Route path="new" element={<RecipientForm />} />
            <Route path="edit/:id" element={<RecipientEditForm />} />
          </Route>
          
          {/* Other Protected Features */}
          <Route path="/matching" element={<MatchingSystem />} />
          <Route path="/reports" element={<Reports />} />
          
          {/* Admin Panel - Additional Role Check */}
          <Route path="/admin" element={
            <RequireAuth allowedRoles={['Administrator']}>
              <AdminPanel />
            </RequireAuth>
          } />
        </Route>

        {/* Catch-all - Redirect to login for unauthenticated users */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}