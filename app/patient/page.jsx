'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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

  const upcomingAppointments = appointments.filter((appt) => appt.status === 'Upcoming');
  const completedAppointments = appointments.filter((appt) => appt.status === 'Completed');
  const cancelledAppointments = appointments.filter((appt) => appt.status === 'Cancelled');

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl p-6 md:p-8 text-white shadow-lg shadow-teal-500/20"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
            <p className="text-teal-100">Manage your appointments and find the right doctor for you.</p>
          </div>
          <button 
            onClick={handleRefresh} 
            disabled={refreshing} 
            className="bg-white text-teal-700 px-4 py-2 rounded-lg font-medium hover:bg-teal-50 disabled:opacity-50"
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </motion.div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div className="bg-white rounded-xl shadow-sm border border-teal-100 p-6">
          <p className="text-sm text-gray-600 mb-1">Upcoming</p>
          <p className="text-3xl font-bold text-teal-600">{upcomingAppointments.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-teal-100 p-6">
          <p className="text-sm text-gray-600 mb-1">Completed</p>
          <p className="text-3xl font-bold text-emerald-600">{completedAppointments.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-teal-100 p-6">
          <p className="text-sm text-gray-600 mb-1">Cancelled</p>
          <p className="text-3xl font-bold text-red-600">{cancelledAppointments.length}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <button 
          onClick={() => router.push('/patient/doctors')} 
          className="bg-white rounded-xl shadow-sm border border-teal-100 p-6 hover:shadow-lg hover:border-teal-300 transition-all duration-300 text-left"
        >
          <h3 className="font-semibold text-gray-900">Book Appointment</h3>
          <p className="text-sm text-gray-600">Find and book a doctor</p>
        </button>
        <button 
          onClick={() => router.push('/patient/history')} 
          className="bg-white rounded-xl shadow-sm border border-teal-100 p-6 hover:shadow-lg hover:border-teal-300 transition-all duration-300 text-left"
        >
          <h3 className="font-semibold text-gray-900">View History</h3>
          <p className="text-sm text-gray-600">See your past appointments</p>
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">All Appointments</h2>
        {appointments.length === 0 ? (
          <EmptyState 
            title="No Appointments" 
            message="You don't have any appointments yet." 
            actionLabel="Book Appointment" 
            onAction={() => router.push('/patient/doctors')} 
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((appt, index) => (
              <motion.div
                key={appt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-teal-100 p-6 hover:shadow-md transition-shadow duration-300"
              >
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
                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-teal-700">Queue Position: #{appt.queuePosition}</p>
                      <p className="text-xs text-teal-600">Estimated wait: {appt.queuePosition * 15} minutes</p>
                    </div>
                  )}
                  {appt.symptoms && (
                    <p className="text-sm text-gray-600">Symptoms: {appt.symptoms}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
