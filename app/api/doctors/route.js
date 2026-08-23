import { NextResponse } from 'next/server';
import { doctors } from '../../../data/doctors';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const department = searchParams.get('department');

    let filteredDoctors = [...doctors];

    if (search && search.trim() !== '') {
      const searchLower = search.toLowerCase();
      filteredDoctors = filteredDoctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchLower) ||
          doctor.specialization.toLowerCase().includes(searchLower) ||
          doctor.department.toLowerCase().includes(searchLower)
      );
    }

    if (department && department !== 'All Departments') {
      filteredDoctors = filteredDoctors.filter(
        (doctor) => doctor.department === department
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Doctors fetched successfully',
      data: filteredDoctors,
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch doctors',
        data: null,
      },
      { status: 500 }
    );
  }
}
