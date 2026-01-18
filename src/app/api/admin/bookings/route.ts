import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET all bookings with relations
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const bookings = await prisma.rentalBooking.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        bike: true,
        payments: {
          orderBy: { date: 'desc' },
        },
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Error al obtener las reservas' },
      { status: 500 }
    );
  }
}

// POST create new booking from admin
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const {
      fullName,
      documentId,
      address,
      email,
      phone,
      hasWhatsapp,
      startDate,
      endDate,
      weeks,
      bikeId,
      agreedPrice,
      bondAmount,
      status,
      notes,
    } = body;

    if (!fullName || !email || !startDate || !endDate || !weeks) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const booking = await prisma.rentalBooking.create({
      data: {
        fullName,
        documentId: documentId || '',
        address: address || '',
        email,
        phone: phone || null,
        hasWhatsapp: hasWhatsapp || false,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        weeks: parseInt(weeks),
        bikeId: bikeId || null,
        agreedPrice: agreedPrice ? parseFloat(agreedPrice) : null,
        bondAmount: bondAmount ? parseFloat(bondAmount) : 140,
        bondStatus: 'not_paid',
        contractStatus: 'unsigned',
        status: status || 'pending',
        createdBy: 'admin',
        notes: notes || null,
      },
      include: {
        bike: true,
        payments: true,
      },
    });

    // If bike assigned and confirmed, update bike status
    if (bikeId && status === 'confirmed') {
      await prisma.bike.update({
        where: { id: bikeId },
        data: { status: 'rented' },
      });
    }

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Error al crear la reserva' },
      { status: 500 }
    );
  }
}
