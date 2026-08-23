// services/dataStore.js
// Global in-memory store

let appointments = [
  {
    id: 'OPD-1001',
    patientId: 'PAT001',
    patientName: 'Patient User',
    doctorId: 'DOC001',
    doctorName: 'Dr. Priya Sharma',
    department: 'Cardiology',
    date: '2026-08-24',
    time: '10:00 AM',
    status: 'Upcoming',
    queuePosition: 1,
    symptoms: 'Regular heart checkup',
    createdAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'OPD-1002',
    patientId: 'PAT002',
    patientName: 'Arun Kumar',
    doctorId: 'DOC001',
    doctorName: 'Dr. Priya Sharma',
    department: 'Cardiology',
    date: '2026-08-24',
    time: '10:30 AM',
    status: 'Upcoming',
    queuePosition: 2,
    symptoms: 'Chest pain',
    createdAt: '2026-08-20T11:00:00Z',
  },
  {
    id: 'OPD-1003',
    patientId: 'PAT003',
    patientName: 'Rahul Singh',
    doctorId: 'DOC001',
    doctorName: 'Dr. Priya Sharma',
    department: 'Cardiology',
    date: '2026-08-24',
    time: '11:00 AM',
    status: 'Completed',
    queuePosition: 3,
    symptoms: 'High blood pressure',
    createdAt: '2026-08-19T09:00:00Z',
  },
];

let availability = [
  {
    id: 'AVL001',
    doctorId: 'DOC001',
    doctorName: 'Dr. Priya Sharma',
    date: '2026-08-24',
    slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'],
  },
  {
    id: 'AVL002',
    doctorId: 'DOC001',
    doctorName: 'Dr. Priya Sharma',
    date: '2026-08-25',
    slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
  },
  {
    id: 'AVL003',
    doctorId: 'DOC002',
    doctorName: 'Dr. Rajesh Kumar',
    date: '2026-08-24',
    slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'],
  },
  {
    id: 'AVL004',
    doctorId: 'DOC002',
    doctorName: 'Dr. Rajesh Kumar',
    date: '2026-08-25',
    slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
  },
  {
    id: 'AVL005',
    doctorId: 'DOC003',
    doctorName: 'Dr. Anjali Mehta',
    date: '2026-08-24',
    slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'],
  },
  {
    id: 'AVL006',
    doctorId: 'DOC003',
    doctorName: 'Dr. Anjali Mehta',
    date: '2026-08-25',
    slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
  },
  {
    id: 'AVL007',
    doctorId: 'DOC004',
    doctorName: 'Dr. Suresh Patel',
    date: '2026-08-24',
    slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'],
  },
  {
    id: 'AVL008',
    doctorId: 'DOC004',
    doctorName: 'Dr. Suresh Patel',
    date: '2026-08-25',
    slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
  },
  {
    id: 'AVL009',
    doctorId: 'DOC005',
    doctorName: 'Dr. Kavita Reddy',
    date: '2026-08-24',
    slots: ['09:00 AM', '09:30 AM', '10:00 AM'],
  },
  {
    id: 'AVL010',
    doctorId: 'DOC005',
    doctorName: 'Dr. Kavita Reddy',
    date: '2026-08-25',
    slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM'],
  },
  {
    id: 'AVL011',
    doctorId: 'DOC006',
    doctorName: 'Dr. Amit Verma',
    date: '2026-08-24',
    slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
  },
  {
    id: 'AVL012',
    doctorId: 'DOC006',
    doctorName: 'Dr. Amit Verma',
    date: '2026-08-25',
    slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
  },
];

export function getAppointments() {
  return appointments;
}

export function addAppointment(appointment) {
  appointments.push(appointment);
  return appointment;
}

export function updateAppointment(id, updates) {
  const index = appointments.findIndex((a) => a.id === id);
  if (index !== -1) {
    appointments[index] = { ...appointments[index], ...updates };
    return appointments[index];
  }
  return null;
}

export function getAvailability() {
  return availability;
}

export function addAvailability(newAvailability) {
  const existing = availability.find(
    (av) => av.doctorId === newAvailability.doctorId && av.date === newAvailability.date
  );
  
  if (existing) {
    existing.slots = [...new Set([...existing.slots, ...newAvailability.slots])].sort();
  } else {
    availability.push(newAvailability);
  }
  
  return availability;
}

export function removeSlotFromAvailability(doctorId, date, slot) {
  const existing = availability.find(
    (av) => av.doctorId === doctorId && av.date === date
  );
  
  if (existing) {
    existing.slots = existing.slots.filter((s) => s !== slot);
  }
  return availability;
}
