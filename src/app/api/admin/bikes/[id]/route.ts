import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET single bike
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const bike = await prisma.bike.findUnique({
      where: { id },
      include: {
        rentals: {
          orderBy: { startDate: 'desc' },
          include: {
            payments: true,
          },
        },
      },
    });

    if (!bike) {
      return NextResponse.json({ error: 'Bici no encontrada' }, { status: 404 });
    }

    return NextResponse.json(bike);
  } catch (error) {
    console.error('Error fetching bike:', error);
    return NextResponse.json(
      { error: 'Error al obtener la bici' },
      { status: 500 }
    );
  }
}

// PATCH update bike
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, type, status, salePrice, notes } = body;

    const bike = await prisma.bike.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(type !== undefined && { type }),
        ...(status !== undefined && { status }),
        ...(salePrice !== undefined && { salePrice: salePrice ? parseFloat(salePrice) : null }),
        ...(notes !== undefined && { notes }),
      },
    });

    return NextResponse.json(bike);
  } catch (error) {
    console.error('Error updating bike:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la bici' },
      { status: 500 }
    );
  }
}

// DELETE bike
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    // Check if bike has active rentals
    const activeRentals = await prisma.rentalBooking.count({
      where: {
        bikeId: id,
        status: 'confirmed',
        endDate: { gte: new Date() },
      },
    });

    if (activeRentals > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar una bici con alquileres activos' },
        { status: 400 }
      );
    }

    await prisma.bike.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bike:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la bici' },
      { status: 500 }
    );
  }
}
