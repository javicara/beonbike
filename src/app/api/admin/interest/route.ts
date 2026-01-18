import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET all interest registrations
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const interests = await prisma.interestRegistration.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(interests);
  } catch (error) {
    console.error('Error fetching interest registrations:', error);
    return NextResponse.json(
      { error: 'Error al obtener las registraciones' },
      { status: 500 }
    );
  }
}
