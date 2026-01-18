import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET all bikes
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const bikes = await prisma.bike.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        rentals: {
          where: {
            status: 'confirmed',
            endDate: { gte: new Date() },
          },
          select: {
            id: true,
            fullName: true,
            startDate: true,
            endDate: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json(bikes);
  } catch (error) {
    console.error('Error fetching bikes:', error);
    return NextResponse.json(
      { error: 'Error al obtener las bicis' },
      { status: 500 }
    );
  }
}

// POST create new bike
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { name, type, status, salePrice, notes } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'El nombre es requerido' },
        { status: 400 }
      );
    }

    const bike = await prisma.bike.create({
      data: {
        name,
        type: type || 'rental',
        status: status || 'available',
        salePrice: salePrice ? parseFloat(salePrice) : null,
        notes: notes || null,
      },
    });

    return NextResponse.json(bike, { status: 201 });
  } catch (error) {
    console.error('Error creating bike:', error);
    return NextResponse.json(
      { error: 'Error al crear la bici' },
      { status: 500 }
    );
  }
}
