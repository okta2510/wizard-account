export interface Department {
  id: number;
  name: string;
}

export type Departments = Department[]

export interface Location {
  id: number;
  name: string;
}

export interface BasicInfo {
  id?: number;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
  role: string;
}

export interface Details {
  id?: number;
  employee_id: string;
  email: string;
  photo?: string;
  employment_type: string;
  office_location: string;
  notes: string;
  user_role: string;
}

export interface Employee extends BasicInfo {
  photo?: string;
  employment_type?: string;
  office_location?: string;
  notes?: string;
  user_role?: string;
}

export type Role = 'admin' | 'ops';
