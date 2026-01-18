import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import BookingsTable from "@/components/admin/BookingsTable";

async function getBookings() {
  return prisma.rentalBooking.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function BookingsPage() {
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
        <h1 className="text-3xl font-bold text-white">Reservas</h1>
        <p className="text-slate-400 mt-1">
          Gestiona todas las reservas de alquiler
        </p>
      </div>

      <BookingsTable initialBookings={bookings} />
    </div>
  );
}
