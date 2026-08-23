import React from 'react';
import StatusBadge from './StatusBadge';

export default function AppointmentCard({ appointment, onStatusUpdate }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600">Appointment ID</p>
          <p className="font-semibold text-gray-900">{appointment.id}</p>
        </div>
        <StatusBadge status={appointment.status} />
      </div>
      
      <div className="mt-4 space-y-2">
        <p className="text-gray-900 font-medium">{appointment.doctorName}</p>
        <p className="text-sm text-gray-600">{appointment.department}</p>
        <p className="text-sm text-gray-600">
          📅 {appointment.date} | 🕐 {appointment.time}
        </p>
        {appointment.queuePosition && (
          <p className="text-sm text-gray-600">
            Queue Position: #{appointment.queuePosition}
          </p>
        )}
        {appointment.symptoms && (
          <p className="text-sm text-gray-600">
            Symptoms: {appointment.symptoms}
          </p>
        )}
      </div>
      
      {onStatusUpdate && appointment.status === 'Upcoming' && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onStatusUpdate(appointment.id, 'Completed')}
            className="btn-primary flex-1"
          >
            Complete
          </button>
          <button
            onClick={() => onStatusUpdate(appointment.id, 'Cancelled')}
            className="btn-danger flex-1"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}