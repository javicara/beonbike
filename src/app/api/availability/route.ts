import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET availability check for dates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate are required' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get all rental bikes
    const allBikes = await prisma.bike.findMany({
      where: {
        type: 'rental',
        status: { in: ['available', 'rented'] }, // exclude sold/maintenance
      },
    });

    // Get bookings that overlap with the requested dates
    const overlappingBookings = await prisma.rentalBooking.findMany({
      where: {
        status: { in: ['pending', 'confirmed'] },
        OR: [
          {
            // Booking starts before requested end AND ends after requested start
            startDate: { lte: end },
            endDate: { gte: start },
          },
        ],
      },
      select: {
        bikeId: true,
      },
    });

    // Get IDs of bikes that are booked during the requested period
    const bookedBikeIds = new Set(
      overlappingBookings
        .filter(b => b.bikeId)
        .map(b => b.bikeId as string)
    );

    // Calculate available bikes
    const availableBikes = allBikes.filter(bike => !bookedBikeIds.has(bike.id));

    return NextResponse.json({
      available: availableBikes.length > 0,
      availableCount: availableBikes.length,
      totalBikes: allBikes.length,
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json(
      { error: 'Error checking availability' },
      { status: 500 }
    );
  }
}
