import React from 'react';

const statusStyles = {
  Upcoming: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
  Waiting: 'bg-yellow-100 text-yellow-800',
  Available: 'bg-green-100 text-green-800',
  'Few Slots': 'bg-yellow-100 text-yellow-800',
  'Fully Booked': 'bg-red-100 text-red-800',
};

export default function StatusBadge({ status }) {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-800';
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {status}
    </span>
  );
}
