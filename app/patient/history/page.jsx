'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../services/api';

export default function PatientHistory() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const storedUser = localStorage.getItem('opd_user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(storedUser);
    if (user.role !== 'patient') {
      router.push('/doctor');
      return;
    }
    fetchAppointments(user.id);
  }, []);

  const fetchAppointments = async (patientId) => {
    try {
      const response = await api.get('/appointments', {
        params: { patientId },
      });
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const completedAppointments = appointments.filter(
    (appt) => appt.status === 'Completed'
  );
  const cancelledAppointments = appointments.filter(
    (appt) => appt.status === 'Cancelled'
  );
  const pastAppointments = [...completedAppointments, ...cancelledAppointments];

  const filteredAppointments = filter === 'All'
    ? pastAppointments
    : pastAppointments.filter((appt) => appt.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Booking History</h1>

      <div className="flex gap-2 flex-wrap">
        {['All', 'Completed', 'Cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-600">No past appointments found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Appointment ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appt) => (
                  <tr key={appt.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appt.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{appt.doctorName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{appt.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{appt.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{appt.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        appt.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {appt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
