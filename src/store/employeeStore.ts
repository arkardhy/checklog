import { create } from 'zustand';
import { Employee, TimeRecord, LeaveRequest } from '../types';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storage';
import { sendDiscordNotification } from '../utils/discord';
import { calculateHours, formatDateTime } from '../utils/timeCalculations';

interface EmployeeState {
  employees: Employee[];
  timeRecords: TimeRecord[];
  leaveRequests: LeaveRequest[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  addTimeRecord: (record: Omit<TimeRecord, 'id'>) => void;
  updateTimeRecord: (id: string, checkOut: string) => void;
  submitLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'status'>) => void;
  updateLeaveRequest: (id: string, status: LeaveRequest['status']) => void;
  loadStoredData: () => void;
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: loadFromLocalStorage('employees') || [],
  timeRecords: loadFromLocalStorage('timeRecords') || [],
  leaveRequests: loadFromLocalStorage('leaveRequests') || [],
  
  loadStoredData: () => {
    const employees = loadFromLocalStorage('employees') || [];
    const timeRecords = loadFromLocalStorage('timeRecords') || [];
    const leaveRequests = loadFromLocalStorage('leaveRequests') || [];
    set({ employees, timeRecords, leaveRequests });
  },

  addEmployee: (employee) => set((state) => {
    const newEmployees = [...state.employees, { ...employee, id: crypto.randomUUID() }];
    saveToLocalStorage('employees', newEmployees);
    return { employees: newEmployees };
  }),
  
  addTimeRecord: (record) => set((state) => {
    const newRecord = { ...record, id: crypto.randomUUID() };
    const newRecords = [...state.timeRecords, newRecord];
    saveToLocalStorage('timeRecords', newRecords);
    
    const employee = state.employees.find(e => e.id === record.employeeId);
    const now = new Date();
    
    sendDiscordNotification(
      `🟢 **Check In**\n` +
      `**Employee:** ${employee?.name}\n` +
      `**Position:** ${employee?.position}\n` +
      `**Date:** ${formatDateTime(now)}\n` +
      `**Status:** Checked In`
    );
    
    return { timeRecords: newRecords };
  }),
  
  updateTimeRecord: (id, checkOut) => set((state) => {
    const newRecords = state.timeRecords.map(record =>
      record.id === id ? { ...record, checkOut } : record
    );
    saveToLocalStorage('timeRecords', newRecords);
    
    const record = state.timeRecords.find(r => r.id === id);
    const employee = state.employees.find(e => e.id === record?.employeeId);
    const now = new Date();
    
    if (record) {
      const hours = calculateHours(
        `${record.date} ${record.checkIn}`,
        `${record.date} ${checkOut}`
      );
      
      sendDiscordNotification(
        `🔴 **Check Out**\n` +
        `**Employee:** ${employee?.name}\n` +
        `**Position:** ${employee?.position}\n` +
        `**Date:** ${formatDateTime(now)}\n` +
        `**Hours Worked:** ${hours.toFixed(2)}\n` +
        `**Status:** Checked Out`
      );
    }
    
    return { timeRecords: newRecords };
  }),
  
  submitLeaveRequest: (request) => set((state) => {
    const newRequest = {
      ...request,
      id: crypto.randomUUID(),
      status: 'pending' as const
    };
    const newRequests = [...state.leaveRequests, newRequest];
    saveToLocalStorage('leaveRequests', newRequests);
    
    const employee = state.employees.find(e => e.id === request.employeeId);
    const now = new Date();
    
    sendDiscordNotification(
      `📝 **Leave Request**\n` +
      `**Employee:** ${employee?.name}\n` +
      `**Position:** ${employee?.position}\n` +
      `**Submitted:** ${formatDateTime(now)}\n` +
      `**Period:** ${request.startDate} to ${request.endDate}\n` +
      `**Reason:** ${request.reason}\n` +
      `**Status:** Pending Approval`
    );
    
    return { leaveRequests: newRequests };
  }),
  
  updateLeaveRequest: (id, status) => set((state) => {
    const newRequests = state.leaveRequests.map(request =>
      request.id === id ? { ...request, status } : request
    );
    saveToLocalStorage('leaveRequests', newRequests);
    return { leaveRequests: newRequests };
  }),
}));