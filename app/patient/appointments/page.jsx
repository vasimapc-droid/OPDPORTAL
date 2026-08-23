'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../services/api';

export default function PatientAppointments() {
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

  const filteredAppointments = filter === 'All' 
    ? appointments 
    : appointments.filter((appt) => appt.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>

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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-600">No appointments found.</p>
          <button
            onClick={() => router.push('/patient/doctors')}
            className="btn-primary mt-4"
          >
            Book Appointment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAppointments.map((appt) => (
            <div key={appt.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">Appointment ID</p>
                  <p className="font-semibold text-gray-900">{appt.id}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  appt.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                  appt.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {appt.status}
                </span>
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
  );
}
