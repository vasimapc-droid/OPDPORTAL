'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doctorService } from '../../../services/doctorService';
import { appointmentService } from '../../../services/appointmentService';
import Loading from '../../../components/Loading';
import StatusBadge from '../../../components/StatusBadge';
import EmptyState from '../../../components/EmptyState';

export default function DoctorsPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
      const response = await doctorService.getDoctors();
      if (response.success) {
        setDoctors(response.data);
        setFilteredDoctors(response.data);
        const depts = [...new Set(response.data.map((d) => d.department))];
        setDepartments(['All Departments', ...depts]);
      }
    } catch (err) {
      setError('Unable to load doctors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getNext30Days = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
    }
    return dates;
  };

  const getSlotStatus = (doctor) => {
    const slots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
    const available = slots.length;
    if (available >= 4) return { status: 'Available', color: 'green' };
    if (available >= 2) return { status: 'Few Slots', color: 'yellow' };
    return { status: 'Fully Booked', color: 'red' };
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterAndSort(query, selectedDepartment, sortBy);
  };

  const handleDepartmentChange = (e) => {
    const dept = e.target.value;
    setSelectedDepartment(dept);
    filterAndSort(searchQuery, dept, sortBy);
  };

  const handleSortChange = (e) => {
    const sort = e.target.value;
    setSortBy(sort);
    filterAndSort(searchQuery, selectedDepartment, sort);
  };

  const filterAndSort = (query, dept, sort) => {
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
    if (sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'experience') {
      filtered.sort((a, b) => b.experience - a.experience);
    } else if (sort === 'fee') {
      filtered.sort((a, b) => a.consultationFee - b.consultationFee);
    }
    setFilteredDoctors(filtered);
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      setBookingError('Please select a doctor, date, and time slot.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (selectedDate < today) {
      setBookingError('Cannot book an appointment for a past date.');
      return;
    }

    setBookingLoading(true);
    setBookingError('');

    const storedUser = JSON.parse(localStorage.getItem('opd_user'));

    try {
      const response = await appointmentService.bookAppointment({
        patientId: storedUser.id,
        patientName: storedUser.name,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        department: selectedDoctor.department,
        date: selectedDate,
        time: selectedSlot,
        symptoms: symptoms,
      });

      if (response.success) {
        setBookingSuccess(response.data);
        setSelectedDoctor(null);
        setSelectedDate('');
        setSelectedSlot('');
        setSymptoms('');
      } else {
        setBookingError(response.message);
      }
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to book appointment.');
    } finally {
      setBookingLoading(false);
    }
  };

  const dates = getNext30Days();
  const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'];

  if (loading) {
    return <Loading message="Loading doctors..." />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Find Doctors</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {bookingSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Appointment Confirmed!</h3>
          <p className="text-green-700">Appointment ID: {bookingSuccess.id}</p>
          <p className="text-green-700">Queue Position: #{bookingSuccess.queuePosition}</p>
          {bookingSuccess.queuePosition && (
            <p className="text-green-700 mt-2">
              Estimated wait: {bookingSuccess.queuePosition * 15} minutes
            </p>
          )}
          <div className="flex gap-3 mt-4">
            <button onClick={() => router.push('/patient/appointments')} className="btn-primary">
              View My Appointments
            </button>
            <button onClick={() => setBookingSuccess(null)} className="btn-secondary">
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
        <select value={selectedDepartment} onChange={handleDepartmentChange} className="input-field md:w-48">
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        <select value={sortBy} onChange={handleSortChange} className="input-field md:w-48">
          <option value="rating">Sort by Rating</option>
          <option value="experience">Sort by Experience</option>
          <option value="fee">Sort by Fee</option>
        </select>
      </div>

      {filteredDoctors.length === 0 ? (
        <EmptyState 
          title="No Doctors Found" 
          message="Try adjusting your search or filters." 
          icon="?????"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => {
            const slotStatus = getSlotStatus(doctor);
            return (
              <div key={doctor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                    {doctor.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.specialization}</p>
                    <p className="text-sm text-gray-500">{doctor.department}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm text-yellow-600">? {doctor.rating}</span>
                      <span className="text-sm text-gray-600">{doctor.experience} yrs</span>
                      <span className="text-sm text-gray-600">?{doctor.consultationFee}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <StatusBadge status={slotStatus.status} />
                </div>
                <button
                  onClick={() => setSelectedDoctor(doctor)}
                  className="btn-primary w-full mt-4"
                >
                  Book Appointment
                </button>
              </div>
            );
          })}
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
              <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="input-field">
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
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">{symptoms.length}/200 characters</p>
            </div>
            
            {bookingError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-700">{bookingError}</p>
              </div>
            )}
            
            <div className="flex gap-3">
              <button onClick={() => setSelectedDoctor(null)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button onClick={handleBookAppointment} disabled={bookingLoading} className="btn-primary flex-1">
                {bookingLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
