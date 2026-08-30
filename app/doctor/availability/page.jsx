'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { availabilityService } from '../../../services/availabilityService';
import Loading from '../../../components/Loading';

export default function DoctorAvailability() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const allTimeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'];

  const getNext14Days = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
    }
    return dates;
  };

  const dates = getNext14Days();

  useEffect(() => {
    const storedUser = localStorage.getItem('opd_user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'doctor') {
      router.push('/patient');
      return;
    }
    setUser(parsedUser);
    setSelectedDate(dates[0]);
    fetchAvailability(parsedUser.id, dates[0]);
  }, []);

  const fetchAvailability = async (doctorId, date) => {
    setLoading(true);
    try {
      const response = await availabilityService.getAvailability(doctorId, date);
      if (response.success && response.data.length > 0) {
        setSlots(response.data[0].slots);
      } else {
        setSlots([]);
      }
    } catch (err) {
      setError('Unable to load availability.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSuccessMessage('');
    setError('');
    fetchAvailability(user.id, date);
  };

  const addSlot = async (slot) => {
    if (slots.includes(slot)) {
      setError('This slot already exists.');
      return;
    }

    setSuccessMessage('');
    setError('');

    try {
      const response = await availabilityService.addAvailability({
        doctorId: user.id,
        doctorName: user.name,
        date: selectedDate,
        slots: [slot],
      });

      if (response.success) {
        setSlots([...slots, slot].sort());
        setSuccessMessage(`Slot ${slot} added successfully!`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to add slot.');
    }
  };

  const removeSlot = (slot) => {
    setSlots(slots.filter((s) => s !== slot));
    setSuccessMessage(`Slot ${slot} removed successfully!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (loading) {
    return <Loading message="Loading availability..." />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manage Availability</h1>
        <p className="text-gray-600 mt-1">Set your daily appointment slots</p>
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
        className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6"
      >
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Date
        </label>
        <div className="flex gap-2 flex-wrap">
          {dates.map((date) => (
            <button
              key={date}
              onClick={() => handleDateChange(date)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedDate === date
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-500/30'
                  : 'bg-white text-gray-700 border border-teal-200 hover:border-teal-400 hover:text-teal-600'
              }`}
            >
              {date}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Available Slots for {selectedDate}
        </h2>

        {slots.length === 0 ? (
          <p className="text-gray-600 mb-4">No slots added yet. Add slots below.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
            {slots.map((slot) => (
              <div
                key={slot}
                className="flex items-center justify-between bg-teal-50 border border-teal-200 rounded-lg px-3 py-2"
              >
                <span className="text-sm font-medium text-teal-700">{slot}</span>
                <button
                  onClick={() => removeSlot(slot)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <h3 className="text-md font-semibold text-gray-900 mb-3">
          Add New Slot
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {allTimeSlots.map((slot) => (
            <button
              key={slot}
              onClick={() => addSlot(slot)}
              disabled={slots.includes(slot)}
              className={`px-3 py-2 rounded-lg border text-sm transition-all duration-300 ${
                slots.includes(slot)
                  ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                  : 'border-teal-300 bg-teal-50 text-teal-700 hover:bg-teal-100 hover:border-teal-400'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
