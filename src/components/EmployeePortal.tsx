import React, { useState } from 'react';
import { useEmployeeStore } from '../store/employeeStore';
import { format } from 'date-fns';
import { Clock, Calendar } from 'lucide-react';

export default function EmployeePortal() {
  const [employeeId, setEmployeeId] = useState('');
  const [leaveRequest, setLeaveRequest] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  const {
    employees,
    timeRecords,
    leaveRequests,
    addTimeRecord,
    updateTimeRecord,
    submitLeaveRequest
  } = useEmployeeStore();

  const handleCheckIn = () => {
    if (!employeeId) return;
    addTimeRecord({
      employeeId,
      date: format(new Date(), 'yyyy-MM-dd'),
      checkIn: format(new Date(), 'HH:mm:ss'),
      checkOut: null
    });
  };

  const handleCheckOut = () => {
    if (!employeeId) return;
    const lastRecord = [...timeRecords]
      .reverse()
      .find(r => r.employeeId === employeeId && !r.checkOut);
    if (lastRecord) {
      updateTimeRecord(lastRecord.id, format(new Date(), 'HH:mm:ss'));
    }
  };

  const handleLeaveRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) return;
    submitLeaveRequest({
      employeeId,
      ...leaveRequest
    });
    setLeaveRequest({ startDate: '', endDate: '', reason: '' });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Employee Attendance</h2>
          <div className="mb-4">
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} - {emp.position}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleCheckIn}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              <Clock className="inline-block mr-2 h-5 w-5" />
              Check In
            </button>
            <button
              onClick={handleCheckOut}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            >
              <Clock className="inline-block mr-2 h-5 w-5" />
              Check Out
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Submit Leave Request</h2>
          <form onSubmit={handleLeaveRequest}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="date"
                value={leaveRequest.startDate}
                onChange={(e) => setLeaveRequest({ ...leaveRequest, startDate: e.target.value })}
                className="px-3 py-2 border rounded"
                required
              />
              <input
                type="date"
                value={leaveRequest.endDate}
                onChange={(e) => setLeaveRequest({ ...leaveRequest, endDate: e.target.value })}
                className="px-3 py-2 border rounded"
                required
              />
              <textarea
                value={leaveRequest.reason}
                onChange={(e) => setLeaveRequest({ ...leaveRequest, reason: e.target.value })}
                placeholder="Reason for leave"
                className="md:col-span-2 px-3 py-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              <Calendar className="inline-block mr-2 h-5 w-5" />
              Submit Leave Request
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Your Records</h2>
          {employeeId && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Time Records</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left">Date</th>
                        <th className="px-6 py-3 text-left">Check In</th>
                        <th className="px-6 py-3 text-left">Check Out</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timeRecords
                        .filter(record => record.employeeId === employeeId)
                        .map(record => (
                          <tr key={record.id} className="border-t">
                            <td className="px-6 py-4">{record.date}</td>
                            <td className="px-6 py-4">{record.checkIn}</td>
                            <td className="px-6 py-4">{record.checkOut || 'Not checked out'}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Leave Requests</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left">Start Date</th>
                        <th className="px-6 py-3 text-left">End Date</th>
                        <th className="px-6 py-3 text-left">Reason</th>
                        <th className="px-6 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveRequests
                        .filter(request => request.employeeId === employeeId)
                        .map(request => (
                          <tr key={request.id} className="border-t">
                            <td className="px-6 py-4">{request.startDate}</td>
                            <td className="px-6 py-4">{request.endDate}</td>
                            <td className="px-6 py-4">{request.reason}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-sm ${
                                request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {request.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}