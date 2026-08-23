import { NextResponse } from 'next/server';
import { updateAppointment } from '../../../../services/dataStore';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['Completed', 'Cancelled'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status', data: null },
        { status: 400 }
      );
    }

    const updates = { status };
    if (status === 'Cancelled') {
      updates.queuePosition = null;
    }

    const updated = updateAppointment(id, updates);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Appointment not found', data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Appointment ${status.toLowerCase()} successfully`,
      data: updated,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update', data: null },
      { status: 500 }
    );
  }
}