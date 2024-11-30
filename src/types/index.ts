export interface Employee {
  id: string;
  name: string;
  position: string;
  hourlyRate: number;
}

export interface TimeRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'employee';
  employeeId?: string;
}

export interface TimeStats {
  daily: number;
  monthly: number;
  yearly: number;
}