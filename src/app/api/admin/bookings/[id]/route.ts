import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET single booking with payments
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const booking = await prisma.rentalBooking.findUnique({
      where: { id },
      include: {
        bike: true,
        payments: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Error al obtener la reserva" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      status,
      bikeId,
      agreedPrice,
      contractStatus,
      bondAmount,
      bondStatus,
      notes
    } = body;

    // Validate status if provided
    if (status && !["pending", "confirmed", "cancelled"].includes(status)) {
      return NextResponse.json(
        { error: "Estado inválido" },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (bikeId !== undefined) updateData.bikeId = bikeId || null;
    if (agreedPrice !== undefined) updateData.agreedPrice = agreedPrice ? parseFloat(agreedPrice) : null;
    if (contractStatus !== undefined) updateData.contractStatus = contractStatus;
    if (bondAmount !== undefined) updateData.bondAmount = parseFloat(bondAmount);
    if (bondStatus !== undefined) updateData.bondStatus = bondStatus;
    if (notes !== undefined) updateData.notes = notes;

    // If assigning a bike and confirming, update bike status
    if (bikeId && status === 'confirmed') {
      await prisma.bike.update({
        where: { id: bikeId },
        data: { status: 'rented' },
      });
    }

    // If cancelling and had a bike, free up the bike
    if (status === 'cancelled') {
      const existingBooking = await prisma.rentalBooking.findUnique({
        where: { id },
        select: { bikeId: true },
      });
      if (existingBooking?.bikeId) {
        await prisma.bike.update({
          where: { id: existingBooking.bikeId },
          data: { status: 'available' },
        });
      }
    }

    const booking = await prisma.rentalBooking.update({
      where: { id },
      data: updateData,
      include: {
        bike: true,
        payments: true,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Error al actualizar la reserva" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación y rol de admin
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.rentalBooking.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Error al eliminar la reserva" },
      { status: 500 }
    );
  }
}
