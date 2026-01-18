import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { format, startOfWeek, endOfWeek, differenceInWeeks } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

async function getStats() {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const [
    totalBookings,
    pendingBookings,
    confirmedBookings,
    recentBookings,
    bikes,
    weeklyPayments,
    allPayments,
    bondsPaid,
  ] = await Promise.all([
    prisma.rentalBooking.count(),
    prisma.rentalBooking.count({ where: { status: "pending" } }),
    prisma.rentalBooking.count({ where: { status: "confirmed" } }),
    prisma.rentalBooking.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        bike: true,
        payments: true,
      },
    }),
    prisma.bike.findMany({
      where: { type: 'rental' },
    }),
    // Payments this week
    prisma.payment.aggregate({
      where: {
        date: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
      _sum: { amount: true },
    }),
    // All payments total
    prisma.payment.aggregate({
      _sum: { amount: true },
    }),
    // Bond held (paid but not returned)
    prisma.rentalBooking.aggregate({
      where: {
        status: 'confirmed',
        bondStatus: 'paid',
      },
      _sum: { bondAmount: true },
    }),
  ]);

  // Calculate total debt across all confirmed bookings
  const confirmedWithPayments = await prisma.rentalBooking.findMany({
    where: { status: 'confirmed' },
    include: { payments: true },
  });

  // Get default price
  const priceSettings = await prisma.settings.findUnique({
    where: { key: 'backpacker_weekly' },
  });
  const defaultPrice = priceSettings?.value ? parseInt(priceSettings.value) : 70;

  let totalDebt = 0;
  confirmedWithPayments.forEach((booking) => {
    const startDate = new Date(booking.startDate);
    if (now < startDate) return; // Hasn't started yet

    const weeksElapsed = Math.min(
      Math.ceil(differenceInWeeks(now, startDate)) + 1,
      booking.weeks
    );
    const pricePerWeek = booking.agreedPrice || defaultPrice;
    const totalDue = weeksElapsed * pricePerWeek;
    const totalPaid = booking.payments.reduce((sum, p) => sum + p.amount, 0);
    const debt = Math.max(0, totalDue - totalPaid);
    totalDebt += debt;
  });

  const availableBikes = bikes.filter((b) => b.status === 'available').length;
  const rentedBikes = bikes.filter((b) => b.status === 'rented').length;

  return {
    totalBookings,
    pendingBookings,
    confirmedBookings,
    recentBookings,
    weeklyRevenue: weeklyPayments._sum.amount || 0,
    totalRevenue: allPayments._sum.amount || 0,
    totalDebt,
    bondHeld: bondsPaid._sum.bondAmount || 0,
    availableBikes,
    rentedBikes,
    totalBikes: bikes.length,
    defaultPrice,
  };
}

export default async function AdminDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin/login");
  }

  const stats = await getStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">
          Bienvenido de vuelta, {session.user.name}
        </p>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Revenue Esta Semana</p>
              <p className="text-3xl font-bold text-green-500 mt-1">
                ${stats.weeklyRevenue}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Deuda Pendiente</p>
              <p className="text-3xl font-bold text-red-400 mt-1">
                ${stats.totalDebt}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Bond en Hold</p>
              <p className="text-3xl font-bold text-blue-400 mt-1">
                ${stats.bondHeld}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Revenue Total</p>
              <p className="text-3xl font-bold text-orange-500 mt-1">
                ${stats.totalRevenue}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bikes & Bookings Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Bicis Disponibles</p>
              <p className="text-3xl font-bold text-green-500 mt-1">
                {stats.availableBikes}/{stats.totalBikes}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Bicis Alquiladas</p>
              <p className="text-3xl font-bold text-blue-500 mt-1">
                {stats.rentedBikes}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Pendientes</p>
              <p className="text-3xl font-bold text-amber-500 mt-1">
                {stats.pendingBookings}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Reservas</p>
              <p className="text-3xl font-bold text-white mt-1">
                {stats.totalBookings}
              </p>
            </div>
            <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-slate-800 rounded-xl border border-slate-700">
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            Reservas Recientes
          </h2>
          <Link href="/admin/bookings" className="text-orange-500 hover:text-orange-400 text-sm font-medium">
            Ver todas
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Bici
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Fechas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Pagado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {stats.recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    No hay reservas todavía
                  </td>
                </tr>
              ) : (
                stats.recentBookings.map((booking) => {
                  const totalPaid = booking.payments.reduce((s, p) => s + p.amount, 0);
                  const totalExpected = booking.weeks * (booking.agreedPrice || stats.defaultPrice);
                  return (
                    <tr key={booking.id} className="hover:bg-slate-700/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-white font-medium">{booking.fullName}</p>
                        <p className="text-slate-400 text-sm">{booking.email}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                        {booking.bike?.name || 'Sin asignar'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                        {format(new Date(booking.startDate), "dd MMM", { locale: es })} - {format(new Date(booking.endDate), "dd MMM", { locale: es })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={totalPaid >= totalExpected ? 'text-green-500' : 'text-amber-500'}>
                          ${totalPaid}
                        </span>
                        <span className="text-slate-500">/${totalExpected}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.status === "confirmed"
                            ? "bg-green-500/10 text-green-500"
                            : booking.status === "cancelled"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-amber-500/10 text-amber-500"
                        }`}>
                          {booking.status === "confirmed" ? "Confirmada" : booking.status === "cancelled" ? "Cancelada" : "Pendiente"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
