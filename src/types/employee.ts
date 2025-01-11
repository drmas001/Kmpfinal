export type EmployeeRole = 'Doctor' | 'Nurse' | 'Administrator';

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  role: EmployeeRole;
  createdAt: string | null;
  lastActive?: string;
  employee_code: string;
}

export interface CreateEmployeeData {
  fullName: string;
  email: string;
  password: string;
  role: EmployeeRole;
}