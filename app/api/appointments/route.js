import { NextResponse } from 'next/server';
import { getAppointments, addAppointment, removeSlotFromAvailability } from '../../../services/dataStore';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const doctorId = searchParams.get('doctorId');
    const status = searchParams.get('status');
    const date = searchParams.get('date');

    let filteredAppointments = getAppointments();

    if (patientId) {
      filteredAppointments = filteredAppointments.filter(
        (appt) => appt.patientId === patientId
      );
    }

    if (doctorId) {
      filteredAppointments = filteredAppointments.filter(
        (appt) => appt.doctorId === doctorId
      );
    }

    if (status && status !== 'All') {
      filteredAppointments = filteredAppointments.filter(
        (appt) => appt.status === status
      );
    }

    if (date) {
      filteredAppointments = filteredAppointments.filter(
        (appt) => appt.date === date
      );
    }

    filteredAppointments.sort((a, b) => {
      if (a.date === b.date) {
        return a.time.localeCompare(b.time);
      }
      return a.date.localeCompare(b.date);
    });

    return NextResponse.json({
      success: true,
      message: 'Appointments fetched successfully',
      data: filteredAppointments,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch appointments', data: null },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { patientId, patientName, doctorId, doctorName, department, date, time, symptoms } = body;

    if (!patientId || !doctorId || !date || !time) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields', data: null },
        { status: 400 }
      );
    }

    const appointments = getAppointments();
    const isAlreadyBooked = appointments.some(
      (appt) =>
        appt.doctorId === doctorId &&
        appt.date === date &&
        appt.time === time &&
        appt.status !== 'Cancelled'
    );

    if (isAlreadyBooked) {
      return NextResponse.json(
        { success: false, message: 'Slot already booked', data: null },
        { status: 409 }
      );
    }

    const existingAppointments = appointments.filter(
      (appt) => appt.doctorId === doctorId && appt.date === date && appt.status === 'Upcoming'
    );
    const queuePosition = existingAppointments.length + 1;

    const newAppointment = {
      id: `OPD-${1000 + appointments.length + 1}`,
      patientId,
      patientName: patientName || 'Unknown Patient',
      doctorId,
      doctorName: doctorName || 'Unknown Doctor',
      department: department || 'General',
      date,
      time,
      status: 'Upcoming',
      queuePosition,
      symptoms: symptoms || '',
      createdAt: new Date().toISOString(),
    };

    addAppointment(newAppointment);
    removeSlotFromAvailability(doctorId, date, time);

    return NextResponse.json(
      { success: true, message: 'Appointment booked successfully', data: newAppointment },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to book appointment', data: null },
      { status: 500 }
    );
  }
}
