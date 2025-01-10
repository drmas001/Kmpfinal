import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { EmployeeForm } from '@/components/admin/EmployeeForm';

interface Employee {
  id: number;
  email: string;
  full_name: string;
  employee_code: string;
  role: string;
}

export function AdminPanel() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const handleAddEmployee = async (data: {
    email: string;
    full_name: string;
    employee_code: string;
    role: string;
  }) => {
    try {
      const { data: newEmployee, error } = await supabase
        .from('employees')
        .insert([{
          email: data.email,
          full_name: data.full_name,
          employee_code: data.employee_code,
          role: data.role
        }])
        .select()
        .single();

      if (error) throw error;

      setEmployees(prev => [...prev, newEmployee]);
      toast.success('Employee added successfully');
    } catch (error: any) {
      console.error('Error creating employee:', error);
      toast.error(error.message || 'Failed to create employee');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Employee</CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeeForm onSubmit={handleAddEmployee} />
        </CardContent>
      </Card>
    </div>
  );
}