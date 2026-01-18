import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET all payments (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: Record<string, unknown> = {};
    if (bookingId) where.bookingId = bookingId;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) (where.date as Record<string, unknown>).gte = new Date(startDate);
      if (endDate) (where.date as Record<string, unknown>).lte = new Date(endDate);
    }

    const payments = await prisma.payment.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        booking: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Error al obtener los pagos' },
      { status: 500 }
    );
  }
}

// POST create new payment
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { bookingId, amount, date, type, method, notes } = body;

    if (!bookingId || !amount) {
      return NextResponse.json(
        { error: 'Reserva y monto son requeridos' },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.create({
      data: {
        bookingId,
        amount: parseFloat(amount),
        date: date ? new Date(date) : new Date(),
        type: type || 'weekly',
        method: method || 'cash',
        notes: notes || null,
      },
      include: {
        booking: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Error al crear el pago' },
      { status: 500 }
    );
  }
}
