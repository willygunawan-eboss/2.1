export type ModuleId = 'dashboard' | 'crm' | 'sales' | 'purchase' | 'inventory' | 'asset' | 'project' | 'field_service' | 'helpdesk' | 'finance' | 'invoicing' | 'hr' | 'bi' | 'dms' | 'kb' | 'settings';

export type HRTab = 'overview' | 'directory' | 'attendance' | 'payroll' | 'leave';

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  joinDate: string;
  email: string;
  avatar?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Late' | 'Absent' | 'Half Day';
  workHours: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  status: 'Paid' | 'Processing' | 'Pending';
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'Income' | 'Expense';
  amount: number;
  status: 'Completed' | 'Pending';
}

export interface SalesOrder {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface ProductionOrder {
  id: string;
  product: string;
  quantity: number;
  startDate: string;
  endDate: string;
  status: 'Planned' | 'In Progress' | 'Completed';
  progress: number;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  dueDate: string;
  budget: number;
  status: 'Active' | 'Completed' | 'Delayed';
  progress: number;
}

export interface StatCard {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface Task {
  id: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  status: 'Pending' | 'Approved' | 'Completed';
  type: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
}
