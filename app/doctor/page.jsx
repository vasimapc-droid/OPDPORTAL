'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { appointmentService } from '../../services/appointmentService';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';
import StatsCard from '../../components/StatsCard';

export default function DoctorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('opd_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role === 'doctor') {
        setUser(parsedUser);
        fetchAppointments(parsedUser.id);
      } else {
        router.push('/patient');
      }
    } else {
      router.push('/login');
    }
  }, []);

  const fetchAppointments = async (doctorId) => {
    try {
      const response = await appointmentService.getAppointments({ doctorId });
      if (response.success) {
        setAppointments(response.data);
      }
    } catch (err) {
      setError('Unable to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(
    (appt) => appt.date === today || appt.date === '2026-08-24'
  );
  const waitingPatients = appointments.filter(
    (appt) => appt.status === 'Upcoming'
  );
  const completedPatients = appointments.filter(
    (appt) => appt.status === 'Completed'
  );
  const cancelledPatients = appointments.filter(
    (appt) => appt.status === 'Cancelled'
  );

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 md:p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome, {user?.name}!
        </h1>
        <p className="text-blue-100">
          Manage your patients and appointments efficiently.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Appointments" value={appointments.length} icon="??" color="primary" />
        <StatsCard title="Waiting Patients" value={waitingPatients.length} icon="?" color="warning" />
        <StatsCard title="Completed" value={completedPatients.length} icon="?" color="success" />
        <StatsCard title="Cancelled" value={cancelledPatients.length} icon="?" color="danger" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => router.push('/doctor/queue')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow text-left"
        >
          <h3 className="font-semibold text-gray-900">Patient Queue</h3>
          <p className="text-sm text-gray-600">View and manage patient queue</p>
        </button>

        <button
          onClick={() => router.push('/doctor/availability')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow text-left"
        >
          <h3 className="font-semibold text-gray-900">Availability</h3>
          <p className="text-sm text-gray-600">Manage your schedule</p>
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Patient Queue
        </h2>
        {appointments.length === 0 ? (
          <EmptyState
            title="No Appointments"
            message="No patients in your queue yet."
            icon="??"
          />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appt, index) => (
                    <tr key={appt.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appt.patientName}</td>
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
    </div>
  );
}
