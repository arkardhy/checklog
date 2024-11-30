import React, { useState } from 'react';
import { useEmployeeStore } from '../store/employeeStore';
import { format } from 'date-fns';
import { Users, Clock, Calendar, FileText } from 'lucide-react';
import { calculateTotalHours } from '../utils/timeCalculations';

export default function AdminDashboard() {
  const [newEmployee, setNewEmployee] = useState({ name: '', position: '', hourlyRate: 0 });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { employees, addEmployee, timeRecords, leaveRequests, updateLeaveRequest } = useEmployeeStore();

  const calculatePay = (employeeId: string, hours: number) => {
    const employee = employees.find(e => e.id === employeeId);
    return hours * (employee?.hourlyRate || 0);
  };

  const getEmployeeStats = (employeeId: string) => {
    const employeeRecords = timeRecords.filter(r => r.employeeId === employeeId);
    const dailyHours = calculateTotalHours(employeeRecords, 'day');
    const monthlyHours = calculateTotalHours(employeeRecords, 'month');
    const yearlyHours = calculateTotalHours(employeeRecords, 'year');
    
    return {
      dailyHours,
      monthlyHours,
      yearlyHours,
      dailyPay: calculatePay(employeeId, dailyHours),
      monthlyPay: calculatePay(employeeId, monthlyHours),
      yearlyPay: calculatePay(employeeId, yearlyHours),
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-bold">Employees</h2>
            </div>
            <p className="text-3xl font-bold">{employees.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Clock className="h-6 w-6 text-green-600 mr-2" />
              <h2 className="text-xl font-bold">Active Today</h2>
            </div>
            <p className="text-3xl font-bold">
              {timeRecords.filter(r => r.date === format(new Date(), 'yyyy-MM-dd')).length}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Calendar className="h-6 w-6 text-purple-600 mr-2" />
              <h2 className="text-xl font-bold">Monthly Hours</h2>
            </div>
            <p className="text-3xl font-bold">
              {calculateTotalHours(timeRecords, 'month').toFixed(1)}h
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 text-orange-600 mr-2" />
              <h2 className="text-xl font-bold">Pending Leaves</h2>
            </div>
            <p className="text-3xl font-bold">
              {leaveRequests.filter(r => r.status === 'pending').length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Add New Employee</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            addEmployee(newEmployee);
            setNewEmployee({ name: '', position: '', hourlyRate: 0 });
          }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              className="px-3 py-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Position"
              value={newEmployee.position}
              onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
              className="px-3 py-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Hourly Rate (IDR)"
              value={newEmployee.hourlyRate}
              onChange={(e) => setNewEmployee({ ...newEmployee, hourlyRate: Number(e.target.value) })}
              className="px-3 py-2 border rounded"
              required
            />
            <button
              type="submit"
              className="md:col-span-3 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Add Employee
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Time Summary</h2>
            <div className="mb-4">
              <input
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="px-3 py-2 border rounded"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left">Employee</th>
                    <th className="px-4 py-3 text-left">Daily</th>
                    <th className="px-4 py-3 text-left">Monthly</th>
                    <th className="px-4 py-3 text-left">Yearly</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => {
                    const stats = getEmployeeStats(employee.id);
                    return (
                      <tr key={employee.id} className="border-t">
                        <td className="px-4 py-3">{employee.name}</td>
                        <td className="px-4 py-3">
                          {stats.dailyHours.toFixed(1)}h
                          <br />
                          <span className="text-sm text-gray-500">
                            IDR {stats.dailyPay.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {stats.monthlyHours.toFixed(1)}h
                          <br />
                          <span className="text-sm text-gray-500">
                            IDR {stats.monthlyPay.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {stats.yearlyHours.toFixed(1)}h
                          <br />
                          <span className="text-sm text-gray-500">
                            IDR {stats.yearlyPay.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Leave Requests</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left">Employee</th>
                    <th className="px-4 py-3 text-left">Period</th>
                    <th className="px-4 py-3 text-left">Reason</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((request) => {
                    const employee = employees.find(e => e.id === request.employeeId);
                    return (
                      <tr key={request.id} className="border-t">
                        <td className="px-4 py-3">{employee?.name}</td>
                        <td className="px-4 py-3">
                          {format(new Date(request.startDate), 'dd MMM')} -
                          {format(new Date(request.endDate), 'dd MMM')}
                        </td>
                        <td className="px-4 py-3">{request.reason}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-sm ${
                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {request.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateLeaveRequest(request.id, 'approved')}
                                className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => updateLeaveRequest(request.id, 'rejected')}
                                className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}