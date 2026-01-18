import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// PATCH - Update interest registration status
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
    const { status, notes } = body;

    const updateData: { status?: string; notes?: string } = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const interest = await prisma.interestRegistration.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(interest);
  } catch (error) {
    console.error('Error updating interest registration:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la registracion' },
      { status: 500 }
    );
  }
}

// DELETE - Remove interest registration
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

    await prisma.interestRegistration.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting interest registration:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la registracion' },
      { status: 500 }
    );
  }
}
