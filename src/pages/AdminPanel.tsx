import { useState, useEffect } from 'react';
import { EmployeeForm } from '@/components/admin/EmployeeForm';
import { EmployeeList } from '@/components/admin/EmployeeList';
import { EmployeeDeleteDialog } from '@/components/admin/EmployeeDeleteDialog';
import { signUpWithEmail } from '@/lib/api/auth';
import { deleteEmployee, getEmployees } from '@/lib/api/employees';
import type { CreateEmployeeData, Employee } from '@/types/employee';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function AdminPanel() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEmployee = async (data: CreateEmployeeData) => {
    try {
      const result = await signUpWithEmail(data.email, data.password, data.fullName, data.role);
      setEmployees(prev => [...prev, result]);
      toast.success('Employee account created successfully');
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create employee account');
    }
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedEmployee) return;

    try {
      await deleteEmployee(selectedEmployee.id);
      setEmployees(prev => prev.filter(emp => emp.id !== selectedEmployee.id));
      toast.success('Employee account deleted successfully');
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee account');
    } finally {
      setShowDeleteDialog(false);
      setSelectedEmployee(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-lg border bg-card p-6">
        <h1 className="text-2xl font-semibold mb-6">Employee Management</h1>
        
        <div className="space-y-8">
          <EmployeeForm onSubmit={handleAddEmployee} />
          <EmployeeList 
            employees={employees}
            onDelete={handleDeleteEmployee}
          />
        </div>
      </div>

      <EmployeeDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        employee={selectedEmployee}
      />
    </div>
  );
}