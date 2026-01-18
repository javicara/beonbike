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
  });
}

export default async function AvailabilityPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin/login");
  }

  const bookings = await getBookings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Disponibilidad</h1>
        <p className="text-slate-400 mt-1">
          Visualiza el calendario de reservas y disponibilidad
        </p>
      </div>

      <AvailabilityCalendar bookings={bookings} />
    </div>
  );
}
