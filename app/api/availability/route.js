import { NextResponse } from 'next/server';
import { availability } from '../../../data/availability';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    const date = searchParams.get('date');

    let filteredAvailability = [...availability];

    if (doctorId) {
      filteredAvailability = filteredAvailability.filter(
        (av) => av.doctorId === doctorId
      );
    }

    if (date) {
      filteredAvailability = filteredAvailability.filter(
        (av) => av.date === date
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Availability fetched successfully',
      data: filteredAvailability,
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch availability',
        data: null,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { doctorId, doctorName, date, slots } = body;

    if (!doctorId || !date || !slots || slots.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
          data: null,
        },
        { status: 400 }
      );
    }

    const existingAvailability = availability.find(
      (av) => av.doctorId === doctorId && av.date === date
    );

    if (existingAvailability) {
      const newSlots = slots.filter(
        (slot) => !existingAvailability.slots.includes(slot)
      );
      existingAvailability.slots = [...existingAvailability.slots, ...newSlots].sort();
      
      return NextResponse.json({
        success: true,
        message: 'Availability updated successfully',
        data: existingAvailability,
      });
    }

    const newAvailability = {
      id: `AVL${String(availability.length + 1).padStart(3, '0')}`,
      doctorId,
      doctorName: doctorName || 'Unknown Doctor',
      date,
      slots: slots.sort(),
    };

    availability.push(newAvailability);

    return NextResponse.json(
      {
        success: true,
        message: 'Availability added successfully',
        data: newAvailability,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding availability:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to add availability',
        data: null,
      },
      { status: 500 }
    );
  }
}
