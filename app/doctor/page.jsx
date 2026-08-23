'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../services/api';

export default function DoctorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const response = await api.get('/appointments', {
        params: { doctorId },
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
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Total Appointments</p>
          <p className="text-3xl font-bold text-gray-900">{appointments.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Waiting Patients</p>
          <p className="text-3xl font-bold text-yellow-600">{waitingPatients.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-600">{completedPatients.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Cancelled</p>
          <p className="text-3xl font-bold text-red-600">{cancelledPatients.length}</p>
        </div>
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600">No appointments found.</p>
          </div>
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
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appt.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
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
    </div>
  );
}
