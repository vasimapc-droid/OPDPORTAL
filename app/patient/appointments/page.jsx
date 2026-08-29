'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { appointmentService } from '../../../services/appointmentService';
import Loading from '../../../components/Loading';
import EmptyState from '../../../components/EmptyState';
import StatusBadge from '../../../components/StatusBadge';

export default function PatientAppointments() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [error, setError] = useState('');

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
      const response = await appointmentService.getAppointments({ patientId });
      if (response.success) {
        setAppointments(response.data);
      }
    } catch (err) {
      setError('Unable to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = filter === 'All' 
    ? appointments 
    : appointments.filter((appt) => appt.status === filter);

  if (loading) {
    return <Loading message="Loading appointments..." />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {['All', 'Upcoming', 'Completed', 'Cancelled'].map((status) => (
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
          title="No Appointments Found"
          message="You don't have any appointments in this category."
          icon="??"
          actionLabel="Book Appointment"
          onAction={() => router.push('/patient/doctors')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAppointments.map((appt) => (
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
                {appt.consultationNotes && (
                  <p className="text-sm text-green-600">Doctor's Notes: {appt.consultationNotes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
