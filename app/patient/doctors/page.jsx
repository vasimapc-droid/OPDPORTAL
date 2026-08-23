'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../services/api';

export default function DoctorsPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('opd_user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      if (response.data.success) {
        setDoctors(response.data.data);
        setFilteredDoctors(response.data.data);
        const depts = [...new Set(response.data.data.map((d) => d.department))];
        setDepartments(['All Departments', ...depts]);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterDoctors(query, selectedDepartment);
  };

  const handleDepartmentChange = (e) => {
    const dept = e.target.value;
    setSelectedDepartment(dept);
    filterDoctors(searchQuery, dept);
  };

  const filterDoctors = (query, dept) => {
    let filtered = [...doctors];
    if (query.trim() !== '') {
      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(query.toLowerCase()) ||
          doctor.specialization.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (dept !== 'All Departments') {
      filtered = filtered.filter((doctor) => doctor.department === dept);
    }
    setFilteredDoctors(filtered);
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      setBookingError('Please select a doctor, date, and time slot.');
      return;
    }

    setBookingLoading(true);
    setBookingError('');

    const storedUser = JSON.parse(localStorage.getItem('opd_user'));

    try {
      const response = await api.post('/appointments', {
        patientId: storedUser.id,
        patientName: storedUser.name,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        department: selectedDoctor.department,
        date: selectedDate,
        time: selectedSlot,
        symptoms: symptoms,
      });

      if (response.data.success) {
        setBookingSuccess(response.data.data);
        setSelectedDoctor(null);
        setSelectedDate('');
        setSelectedSlot('');
        setSymptoms('');
      } else {
        setBookingError(response.data.message);
      }
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to book appointment.');
    } finally {
      setBookingLoading(false);
    }
  };

  const dates = ['2026-08-24', '2026-08-25', '2026-08-26'];
  const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Find Doctors</h1>

      {bookingSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Appointment Confirmed!</h3>
          <p className="text-green-700">Appointment ID: {bookingSuccess.id}</p>
          <p className="text-green-700">Queue Position: #{bookingSuccess.queuePosition}</p>
          <div className="flex gap-3 mt-4">
            <button 
              onClick={() => router.push('/patient/appointments')}
              className="btn-primary"
            >
              View My Appointments
            </button>
            <button 
              onClick={() => router.push('/patient')}
              className="btn-secondary"
            >
              Go to Dashboard
            </button>
            <button 
              onClick={() => setBookingSuccess(null)} 
              className="btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search doctors by name..."
          value={searchQuery}
          onChange={handleSearch}
          className="input-field flex-1"
        />
        <select
          value={selectedDepartment}
          onChange={handleDepartmentChange}
          className="input-field md:w-64"
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-600">No doctors found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                  {doctor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-sm text-gray-600">{doctor.specialization}</p>
                  <p className="text-sm text-gray-500">{doctor.department}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Rating: {doctor.rating} | Experience: {doctor.experience} years
                  </p>
                  <p className="text-sm text-gray-600">
                    Fee: Rs. {doctor.consultationFee}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoctor(doctor)}
                className="btn-primary w-full mt-4"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Book with {selectedDoctor.name}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
              <select 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)} 
                className="input-field"
              >
                <option value="">Select a date</option>
                {dates.map((date) => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
            </div>
            
            {selectedDate && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Slot</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-3 py-2 rounded-lg border text-sm ${
                        selectedSlot === slot
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Symptoms (Optional)
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe your symptoms..."
                className="input-field"
                rows="3"
              />
            </div>
            
            {bookingError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-700">{bookingError}</p>
              </div>
            )}
            
            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedDoctor(null)} 
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button 
                onClick={handleBookAppointment} 
                disabled={bookingLoading} 
                className="btn-primary flex-1"
              >
                {bookingLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
