import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import BikesManager from '@/components/admin/BikesManager';

async function getBikes() {
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
        },
      },
    },
  });
  return bikes;
}

export default async function BikesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/admin/login');
  }

  const bikes = await getBikes();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Bicis</h1>
        <p className="text-slate-400 mt-1">
          Gestiona tu inventario de bicicletas
        </p>
      </div>

      <BikesManager initialBikes={bikes} />
    </div>
  );
}
