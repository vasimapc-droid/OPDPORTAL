 import { NextResponse } from 'next/server';
import { doctors } from '../../../../data/doctors';
import { availability } from '../../../../data/availability';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const doctor = doctors.find((d) => d.id === id);

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: 'Doctor not found', data: null },
        { status: 404 }
      );
    }

    const doctorAvailability = availability.filter((av) => av.doctorId === id);

    return NextResponse.json({
      success: true,
      message: 'Doctor fetched successfully',
      data: { ...doctor, availability: doctorAvailability },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch doctor', data: null },
      { status: 500 }
    );
  }
}