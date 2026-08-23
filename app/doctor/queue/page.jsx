'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../services/api';

export default function DoctorQueue() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('opd_user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(storedUser);
    if (user.role !== 'doctor') {
      router.push('/patient');
      return;
    }
    fetchQueue(user.id);
  }, []);

  const fetchQueue = async (doctorId) => {
    try {
      const response = await api.get('/appointments', {
        params: { doctorId },
      });
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (err) {
      setError('Unable to load queue.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appointmentId, newStatus) => {
    setUpdateLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await api.patch('/appointments/' + appointmentId, {
        status: newStatus,
      });

      if (response.data.success) {
        setSuccessMessage(`Appointment ${newStatus.toLowerCase()} successfully!`);
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === appointmentId ? { ...appt, status: newStatus } : appt
          )
        );
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const waitingPatients = appointments.filter((appt) => appt.status === 'Upcoming');
  const completedPatients = appointments.filter((appt) => appt.status === 'Completed');
  const cancelledPatients = appointments.filter((appt) => appt.status === 'Cancelled');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Patient Queue</h1>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Waiting</p>
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

      {appointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-600">No patients in queue.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Appointment ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appt, index) => (
                  <tr key={appt.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900">{appt.patientName}</p>
                      {appt.symptoms && (
                        <p className="text-xs text-gray-500 mt-1">{appt.symptoms}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{appt.id}</td>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      {appt.status === 'Upcoming' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateStatus(appt.id, 'Completed')}
                            disabled={updateLoading}
                            className="text-xs px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => updateStatus(appt.id, 'Cancelled')}
                            disabled={updateLoading}
                            className="text-xs px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
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
