import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { EmployeeForm } from '@/components/admin/EmployeeForm';
import type { CreateEmployeeData } from '@/types/employee';

export function AdminPanel() {
  const handleAddEmployee = async (data: CreateEmployeeData) => {
    try {
      const { error } = await supabase
        .from('employees')
        .insert([{
          email: data.email,
          full_name: data.fullName,
          role: data.role,
          password: data.password
        }])
        .select()
        .single();

      if (error) throw error;
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