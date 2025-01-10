import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { getSessionWithDebug, clearAllSessionData } from '@/lib/supabase';
import { employeeCodeSchema } from '@/lib/validations/employee';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import * as z from 'zod';
import { loginWithEmployeeCode } from '@/lib/api/auth';

const formSchema = z.object({
  employeeCode: employeeCodeSchema,
});

type FormData = z.infer<typeof formSchema>;

export function EmployeeLoginPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeCode: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      console.log('Starting employee code verification');
      
      // Verify session is still valid
      const { session, error: sessionError } = await getSessionWithDebug();
      if (sessionError || !session) {
        console.error('Invalid session state:', { error: sessionError });
        toast.error('Your session has expired. Please log in again.');
        await clearAllSessionData();
        navigate('/login', { replace: true });
        return;
      }

      // Verify employee code
      const employeeCode = data.employeeCode.trim();
      console.log('Querying employee database for code:', employeeCode);

      try {
        const employee = await loginWithEmployeeCode(employeeCode);
        
        console.log('Employee verification successful:', {
          id: employee.id,
          code: employee.employee_code,
          name: employee.fullName,
          role: employee.role
        });

        // Store employee data
        sessionStorage.setItem('employee', JSON.stringify(employee));
        const storedEmployee = sessionStorage.getItem('employee');
        if (!storedEmployee) {
          console.error('Failed to store employee data');
          toast.error('Failed to save employee data. Please try again.');
          return;
        }

        toast.success(`Welcome back, ${employee.fullName}!`);
        
        // Check for stored redirect path
        const redirectPath = sessionStorage.getItem('auth_redirect') || '/dashboard';
        sessionStorage.removeItem('auth_redirect'); // Clean up
        navigate(redirectPath, { replace: true });
      } catch (error) {
        console.error('Employee verification error:', error);
        toast.error('Invalid employee code. Please check and try again.');
        form.reset();
      }
    } catch (error) {
      console.error('Employee verification error:', error);
      toast.error('An unexpected error occurred. Please try again or contact support.');
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Enter Employee Code
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Please enter your employee code to continue
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="employeeCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your employee code"
                        {...field}
                        disabled={isSubmitting}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Verifying...' : 'Continue'}
              </Button>
            </form>
          </Form>
        </div>

        <Button
          variant="ghost"
          className="w-full"
          onClick={async () => {
            await clearAllSessionData();
            navigate('/');
          }}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
} 