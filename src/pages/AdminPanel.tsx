import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmployeeForm } from '@/components/admin/EmployeeForm';
import type { CreateEmployeeData } from '@/types/employee';
import { createEmployee } from '@/lib/api/employees';
import { toast } from 'sonner';

export function AdminPanel() {
  const handleAddEmployee = async (data: CreateEmployeeData) => {
    try {
      await createEmployee(data);
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