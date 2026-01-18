import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import AvailabilityCalendar from "@/components/admin/AvailabilityCalendar";

async function getBookings() {
  return prisma.rentalBooking.findMany({
    where: {
      status: {
        in: ["pending", "confirmed"],
      },
    },
    orderBy: { startDate: "asc" },
    include: {
      bike: true,
      payments: true,
    },
  });
}

async function getBikes() {
  return prisma.bike.findMany({
    where: { type: 'rental' },
    orderBy: { name: 'asc' },
  });
}

async function getInterested() {
  return prisma.interestRegistration.findMany({
    where: { status: 'pending' },
    orderBy: { createdAt: 'desc' },
  });
}

export default async function AvailabilityPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin/login");
  }

  const [bookings, bikes, interested] = await Promise.all([
    getBookings(),
    getBikes(),
    getInterested(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Calendario</h1>
        <p className="text-slate-400 mt-1">
          Visualiza reservas por bici y disponibilidad
        </p>
      </div>

      <AvailabilityCalendar
        bookings={bookings}
        bikes={bikes}
        interested={interested}
      />
    </div>
  );
}
