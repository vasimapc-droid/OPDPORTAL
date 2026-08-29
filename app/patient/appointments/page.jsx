'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { appointmentService } from '../../../services/appointmentService';

export default function PatientAppointments() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAppointments = async () => {
    const storedUser = localStorage.getItem('opd_user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(storedUser);
    setLoading(true);
    try {
      const response = await appointmentService.getAppointments({ patientId: user.id });
      console.log('Full response:', response);
      if (response.success) {
        console.log('Setting appointments:', response.data.length);
        setAppointments(response.data);
      }
    } catch (err) {
      console.error('Error loading:', err);
      setError('Unable to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
        <button onClick={loadAppointments} className="btn-secondary">
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <p className="text-gray-600">Total: {appointments.length} appointments</p>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-600">No appointments found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div key={appt.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="font-semibold text-gray-900">{appt.id}</p>
              <p className="text-gray-600">{appt.doctorName}</p>
              <p className="text-gray-600">{appt.department}</p>
              <p className="text-gray-600">{appt.date} | {appt.time}</p>
              <p className="text-gray-600">Status: {appt.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
