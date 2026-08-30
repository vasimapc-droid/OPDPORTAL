'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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
      if (response.success) {
        setAppointments(response.data);
      }
    } catch (err) {
      setError('Unable to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const filteredAppointments = filter === 'All' 
    ? appointments 
    : appointments.filter((appt) => appt.status === filter);

  const stats = [
    { label: 'Total', value: appointments.length, color: 'from-teal-500 to-emerald-500' },
    { label: 'Upcoming', value: appointments.filter(a => a.status === 'Upcoming').length, color: 'from-blue-500 to-cyan-500' },
    { label: 'Completed', value: appointments.filter(a => a.status === 'Completed').length, color: 'from-green-500 to-emerald-500' },
    { label: 'Cancelled', value: appointments.filter(a => a.status === 'Cancelled').length, color: 'from-red-500 to-rose-500' },
  ];

  if (loading) {
    return <Loading message="Loading appointments..." />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600 mt-1">Track and manage all your OPD appointments</p>
        </div>
        <button onClick={loadAppointments} className="btn-secondary">
          Refresh
        </button>
      </motion.div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, i) => (
          <div key={i} className={`bg-gradient-to-r ${stat.color} rounded-xl p-4 text-white shadow-lg`}>
            <p className="text-xs font-medium opacity-90">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex gap-2 flex-wrap"
      >
        {['All', 'Upcoming', 'Completed', 'Cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              filter === status
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-teal-300 hover:text-teal-600'
            }`}
          >
            {status}
          </button>
        ))}
      </motion.div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <EmptyState
          title="No Appointments Found"
          message="You don't have any appointments in this category."
          actionLabel="Book Appointment"
          onAction={() => router.push('/patient/doctors')}
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="space-y-4"
        >
          {filteredAppointments.map((appt) => (
            <motion.div
              key={appt.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
              onClick={() => setSelectedAppointment(appt)}
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Doctor Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center text-xl font-bold text-teal-600">
                      {appt.doctorName?.charAt(0) || 'D'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{appt.doctorName}</p>
                      <p className="text-sm text-gray-500">{appt.department}</p>
                      <p className="text-xs text-gray-400 mt-1">ID: {appt.id}</p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{appt.date}</p>
                      <p className="text-sm text-gray-500">{appt.time}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={appt.status} />
                    {appt.queuePosition && (
                      <span className="text-xs text-teal-600 font-medium">
                        Queue: #{appt.queuePosition}
                      </span>
                    )}
                  </div>
                </div>

                {/* Symptoms */}
                {appt.symptoms && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Symptoms:</p>
                    <p className="text-sm text-gray-700">{appt.symptoms}</p>
                  </div>
                )}

                {/* Consultation Notes */}
                {appt.consultationNotes && (
                  <div className="mt-4 pt-4 border-t border-green-100 bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-green-600 font-medium mb-1">Doctor's Notes:</p>
                    <p className="text-sm text-green-700">{appt.consultationNotes}</p>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedAppointment(appt); }}
                  className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                >
                  View Details
                </button>
                {appt.status === 'Upcoming' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); router.push('/patient/doctors'); }}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Book Another
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Appointment Details Modal */}
      <AnimatePresence>
        {selectedAppointment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={() => setSelectedAppointment(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-900">Appointment Details</h3>
                <button onClick={() => setSelectedAppointment(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Appointment ID</p>
                    <p className="font-semibold text-gray-900">{selectedAppointment.id}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Status</p>
                    <StatusBadge status={selectedAppointment.status} />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Doctor</p>
                    <p className="font-semibold text-gray-900">{selectedAppointment.doctorName}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="font-semibold text-gray-900">{selectedAppointment.department}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-semibold text-gray-900">{selectedAppointment.date}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="font-semibold text-gray-900">{selectedAppointment.time}</p>
                  </div>
                </div>

                {selectedAppointment.queuePosition && (
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-teal-700">Queue Position: #{selectedAppointment.queuePosition}</p>
                    <p className="text-xs text-teal-600 mt-1">Estimated wait: {selectedAppointment.queuePosition * 15} minutes</p>
                  </div>
                )}

                {selectedAppointment.symptoms && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Symptoms</p>
                    <p className="text-sm text-gray-700">{selectedAppointment.symptoms}</p>
                  </div>
                )}

                {selectedAppointment.consultationNotes && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-xs text-green-600 font-medium mb-1">Doctor's Notes</p>
                    <p className="text-sm text-green-700">{selectedAppointment.consultationNotes}</p>
                  </div>
                )}

                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="btn-primary w-full"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
