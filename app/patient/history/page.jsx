'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { appointmentService } from '../../../services/appointmentService';
import Loading from '../../../components/Loading';
import EmptyState from '../../../components/EmptyState';
import StatusBadge from '../../../components/StatusBadge';

export default function PatientHistory() {
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
      setError('Unable to load history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const pastAppointments = appointments.filter(
    (appt) => appt.status === 'Completed' || appt.status === 'Cancelled'
  );

  const filteredAppointments = filter === 'All'
    ? pastAppointments
    : pastAppointments.filter((appt) => appt.status === filter);

  const stats = [
    { label: 'Total Visits', value: pastAppointments.length, color: 'from-teal-500 to-emerald-500', icon: 'calendar' },
    { label: 'Completed', value: pastAppointments.filter(a => a.status === 'Completed').length, color: 'from-green-500 to-emerald-500', icon: 'check' },
    { label: 'Cancelled', value: pastAppointments.filter(a => a.status === 'Cancelled').length, color: 'from-red-500 to-rose-500', icon: 'x' },
  ];

  if (loading) {
    return <Loading message="Loading history..." />;
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Booking History</h1>
          <p className="text-gray-600 mt-1">Your past OPD consultations and appointments</p>
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

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
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
        {['All', 'Completed', 'Cancelled'].map((status) => (
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

      {/* History Cards */}
      {filteredAppointments.length === 0 ? (
        <EmptyState
          title="No History"
          message="No past appointments found. Your completed and cancelled appointments will appear here."
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
              className={`bg-white rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer ${
                appt.status === 'Completed' ? 'border-green-100' : 'border-red-100'
              }`}
              onClick={() => setSelectedAppointment(appt)}
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Doctor Info */}
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold ${
                      appt.status === 'Completed' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {appt.doctorName?.charAt(0) || 'D'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{appt.doctorName}</p>
                      <p className="text-sm text-gray-500">{appt.department}</p>
                      <p className="text-xs text-gray-400 mt-1">ID: {appt.id}</p>
                    </div>
                  </div>

                  {/* Date & Status */}
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{appt.date}</p>
                      <p className="text-sm text-gray-500">{appt.time}</p>
                    </div>
                    <StatusBadge status={appt.status} />
                  </div>
                </div>

                {/* Consultation Notes */}
                {appt.consultationNotes && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-xs text-green-600 font-medium mb-1">Doctor's Notes:</p>
                      <p className="text-sm text-green-700">{appt.consultationNotes}</p>
                    </div>
                  </div>
                )}

                {/* Symptoms */}
                {appt.symptoms && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Symptoms:</p>
                    <p className="text-sm text-gray-700">{appt.symptoms}</p>
                  </div>
                )}
              </div>

              <div className={`px-6 py-3 border-t flex justify-between items-center ${
                appt.status === 'Completed' ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <span className={`text-xs font-medium ${
                  appt.status === 'Completed' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {appt.status === 'Completed' ? 'Consultation Completed' : 'Appointment Cancelled'}
                </span>
                <button className="text-xs text-teal-600 hover:text-teal-700 font-medium">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Details Modal */}
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

                <button onClick={() => setSelectedAppointment(null)} className="btn-primary w-full">
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
