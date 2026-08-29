'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { appointmentService } from '../../services/appointmentService';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';

export default function PatientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchAppointments = async (patientId) => {
    try {
      const response = await appointmentService.getAppointments({ patientId });
      if (response.success) {
        setAppointments(response.data);
      }
    } catch (err) {
      setError('Unable to load appointments.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('opd_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role === 'patient') {
        setUser(parsedUser);
        fetchAppointments(parsedUser.id);
      } else {
        router.push('/doctor');
      }
    } else {
      router.push('/login');
    }
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAppointments(user.id);
  };

  const upcomingAppointments = appointments.filter(
    (appt) => appt.status === 'Upcoming'
  );
  const completedAppointments = appointments.filter(
    (appt) => appt.status === 'Completed'
  );
  const cancelledAppointments = appointments.filter(
    (appt) => appt.status === 'Cancelled'
  );

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 md:p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome, {user?.name}!
            </h1>
            <p className="text-blue-100">
              Manage your appointments and find the right doctor for you.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-white text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 disabled:opacity-50"
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Upcoming</p>
          <p className="text-3xl font-bold text-gray-900">{upcomingAppointments.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Completed</p>
          <p className="text-3xl font-bold text-gray-900">{completedAppointments.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Cancelled</p>
          <p className="text-3xl font-bold text-gray-900">{cancelledAppointments.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => router.push('/patient/doctors')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow text-left"
        >
          <h3 className="font-semibold text-gray-900">Book Appointment</h3>
          <p className="text-sm text-gray-600">Find and book a doctor</p>
        </button>

        <button
          onClick={() => router.push('/patient/history')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow text-left"
        >
          <h3 className="font-semibold text-gray-900">View History</h3>
          <p className="text-sm text-gray-600">See your past appointments</p>
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          All Appointments
        </h2>
        {appointments.length === 0 ? (
          <EmptyState
            title="No Appointments"
            message="You don't have any appointments yet."
            actionLabel="Book Appointment"
            onAction={() => router.push('/patient/doctors')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((appt) => (
              <div key={appt.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600">Appointment ID</p>
                    <p className="font-semibold text-gray-900">{appt.id}</p>
                  </div>
                  <StatusBadge status={appt.status} />
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-gray-900 font-medium">{appt.doctorName}</p>
                  <p className="text-sm text-gray-600">{appt.department}</p>
                  <p className="text-sm text-gray-600">{appt.date} | {appt.time}</p>
                  {appt.queuePosition && (
                    <p className="text-sm text-gray-600">Queue Position: #{appt.queuePosition}</p>
                  )}
                  {appt.symptoms && (
                    <p className="text-sm text-gray-600">Symptoms: {appt.symptoms}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
