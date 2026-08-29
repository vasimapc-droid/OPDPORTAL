'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { appointmentService } from '../../../services/appointmentService';
import Loading from '../../../components/Loading';
import EmptyState from '../../../components/EmptyState';
import StatusBadge from '../../../components/StatusBadge';

export default function PatientHistory() {
  const router = useRouter();
  const pathname = usePathname();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchAppointments = useCallback(async (patientId) => {
    setLoading(true);
    try {
      const response = await appointmentService.getAppointments({ patientId });
      if (response.success) {
        setAppointments(response.data);
      }
    } catch (err) {
      setError('Unable to load history.');
    } finally {
      setLoading(false);
    }
  }, []);

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
  }, [fetchAppointments, refreshKey, pathname]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const pastAppointments = appointments.filter(
    (appt) => appt.status === 'Completed' || appt.status === 'Cancelled'
  );

  const filteredAppointments = filter === 'All'
    ? pastAppointments
    : pastAppointments.filter((appt) => appt.status === filter);

  if (loading) {
    return <Loading message="Loading history..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Booking History</h1>
        <button onClick={handleRefresh} className="btn-secondary">
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

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
        <EmptyState
          title="No History"
          message="No past appointments found. Complete or cancel appointments to see them here."
          icon="??"
        />
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
                      <StatusBadge status={appt.status} />
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
