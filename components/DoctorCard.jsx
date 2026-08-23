import React from 'react';
import StatusBadge from './StatusBadge';

export default function DoctorCard({ doctor, onSelect, isSelected }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-all ${
      isSelected ? 'border-blue-500' : 'border-gray-200 hover:border-blue-300'
    }`}>
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
          👨‍⚕️
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
          <p className="text-sm text-gray-600">{doctor.specialization}</p>
          <p className="text-sm text-gray-500">{doctor.department}</p>
          
          <div className="mt-3 flex items-center gap-4">
            <span className="text-sm text-gray-600">
              ⭐ {doctor.rating} Rating
            </span>
            <span className="text-sm text-gray-600">
              💼 {doctor.experience} Years
            </span>
          </div>
          
          <div className="mt-3">
            <StatusBadge status="Available" />
          </div>
        </div>
      </div>
      
      <button
        onClick={() => onSelect(doctor)}
        className="mt-4 w-full btn-primary"
      >
        Book Appointment
      </button>
    </div>
  );
}