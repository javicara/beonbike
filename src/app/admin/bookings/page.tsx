import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import BookingsTable from "@/components/admin/BookingsTable";

async function getBookings() {
  return prisma.rentalBooking.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      bike: true,
      payments: {
        orderBy: { date: 'desc' },
      },
    },
  });
}

async function getBikes() {
  return prisma.bike.findMany({
    where: { type: 'rental' },
    orderBy: { name: 'asc' },
  });
}

async function getDefaultPrice() {
  const setting = await prisma.settings.findUnique({
    where: { key: 'backpacker_weekly' },
  });
  return setting?.value ? parseInt(setting.value) : 70;
}

export default async function BookingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin/login");
  }

  const [bookings, bikes, defaultPrice] = await Promise.all([
    getBookings(),
    getBikes(),
    getDefaultPrice(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Reservas</h1>
        <p className="text-slate-400 mt-1">
          Gestiona todas las reservas de alquiler
        </p>
      </div>

      <BookingsTable
        initialBookings={bookings}
        bikes={bikes}
        defaultPrice={defaultPrice}
      />
    </div>
  );
}
