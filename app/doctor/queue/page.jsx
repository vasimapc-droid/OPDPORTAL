'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { appointmentService } from '../../../services/appointmentService';
import Loading from '../../../components/Loading';
import EmptyState from '../../../components/EmptyState';
import StatusBadge from '../../../components/StatusBadge';
import StatsCard from '../../../components/StatsCard';

export default function DoctorQueue() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [consultationNotes, setConsultationNotes] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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
      const response = await appointmentService.getAppointments({ doctorId });
      if (response.success) {
        setAppointments(response.data);
      }
    } catch (err) {
      setError('Unable to load queue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appointmentId, newStatus) => {
    setUpdateLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await appointmentService.updateAppointmentStatus(
        appointmentId,
        newStatus,
        consultationNotes
      );

      if (response.success) {
        setSuccessMessage(`Appointment ${newStatus.toLowerCase()} successfully!`);
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === appointmentId ? { ...appt, status: newStatus, consultationNotes } : appt
          )
        );
        setSelectedAppointment(null);
        setConsultationNotes('');
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update appointment.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const waitingPatients = appointments.filter((appt) => appt.status === 'Upcoming');
  const completedPatients = appointments.filter((appt) => appt.status === 'Completed');
  const cancelledPatients = appointments.filter((appt) => appt.status === 'Cancelled');

  if (loading) {
    return <Loading message="Loading patient queue..." />;
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
        <StatsCard title="Waiting" value={waitingPatients.length} icon="?" color="warning" />
        <StatsCard title="Completed" value={completedPatients.length} icon="?" color="success" />
        <StatsCard title="Cancelled" value={cancelledPatients.length} icon="?" color="danger" />
      </div>

      {appointments.length === 0 ? (
        <EmptyState
          title="No Patients in Queue"
          message="There are no appointments at the moment."
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
                      {appt.consultationNotes && (
                        <p className="text-xs text-green-600 mt-1">Notes: {appt.consultationNotes}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{appt.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{appt.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={appt.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {appt.status === 'Upcoming' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedAppointment(appt);
                              setConsultationNotes('');
                            }}
                            className="text-xs px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700"
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

      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Complete Consultation - {selectedAppointment.patientName}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consultation Notes
              </label>
              <textarea
                value={consultationNotes}
                onChange={(e) => setConsultationNotes(e.target.value)}
                placeholder="Enter consultation notes..."
                className="input-field"
                rows="4"
                maxLength={300}
              />
              <p className="text-xs text-gray-500 mt-1">{consultationNotes.length}/300 characters</p>
            </div>
            
            <div className="flex gap-3">
              <button onClick={() => setSelectedAppointment(null)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button 
                onClick={() => updateStatus(selectedAppointment.id, 'Completed')} 
                disabled={updateLoading} 
                className="btn-primary flex-1"
              >
                {updateLoading ? 'Completing...' : 'Complete Consultation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
