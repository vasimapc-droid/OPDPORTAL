'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { appointmentService } from '../../../services/appointmentService';
import Loading from '../../../components/Loading';
import EmptyState from '../../../components/EmptyState';
import StatusBadge from '../../../components/StatusBadge';

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
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message);
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
    return <Loading message="Loading patient queue..." />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Patient Queue</h1>
        <p className="text-gray-600 mt-1">Manage your patient appointments</p>
      </motion.div>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-4"
        >
          <p className="text-green-700">{successMessage}</p>
        </motion.div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl p-4 text-white shadow-lg">
          <p className="text-xs font-medium opacity-90">Waiting</p>
          <p className="text-3xl font-bold">{waitingPatients.length}</p>
        </div>
        <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl p-4 text-white shadow-lg">
          <p className="text-xs font-medium opacity-90">Completed</p>
          <p className="text-3xl font-bold">{completedPatients.length}</p>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-rose-500 rounded-xl p-4 text-white shadow-lg">
          <p className="text-xs font-medium opacity-90">Cancelled</p>
          <p className="text-3xl font-bold">{cancelledPatients.length}</p>
        </div>
      </motion.div>

      {appointments.length === 0 ? (
        <EmptyState title="No Patients in Queue" message="There are no appointments at the moment." />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-teal-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-teal-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase">Appointment ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appt, index) => (
                  <tr key={appt.id} className="hover:bg-teal-50 transition-colors">
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
                            className="text-xs px-3 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
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
        </motion.div>
      )}

      <AnimatePresence>
        {selectedAppointment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
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
                  {updateLoading ? 'Completing...' : 'Complete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
