"use client";

import { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isWithinInterval,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";

interface Booking {
  id: string;
  fullName: string;
  startDate: Date;
  endDate: Date;
  status: string;
  weeks: number;
}

interface AvailabilityCalendarProps {
  bookings: Booking[];
}

export default function AvailabilityCalendar({
  bookings,
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const getBookingsForDay = (date: Date) => {
    return bookings.filter((booking) =>
      isWithinInterval(date, {
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      })
    );
  };

  const getBookingColor = (status: string, index: number) => {
    const colors = [
      "bg-orange-500",
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-teal-500",
    ];
    if (status === "pending") {
      return "bg-amber-500/50 border border-amber-500";
    }
    return colors[index % colors.length];
  };

  const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2 className="text-xl font-semibold text-white capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: es })}
          </h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-slate-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const dayBookings = getBookingsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday =
              format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

            return (
              <div
                key={day.toISOString()}
                className={`min-h-24 p-1 rounded-lg border ${
                  isCurrentMonth
                    ? "bg-slate-700/30 border-slate-700"
                    : "bg-slate-800/50 border-slate-700/50"
                } ${isToday ? "ring-2 ring-orange-500" : ""}`}
              >
                <div
                  className={`text-sm font-medium mb-1 ${
                    isCurrentMonth ? "text-white" : "text-slate-500"
                  } ${isToday ? "text-orange-500" : ""}`}
                >
                  {format(day, "d")}
                </div>
                <div className="space-y-1">
                  {dayBookings.slice(0, 2).map((booking, index) => (
                    <button
                      key={booking.id}
                      onClick={() => setSelectedBooking(booking)}
                      className={`w-full text-left text-xs px-1.5 py-0.5 rounded truncate text-white ${getBookingColor(
                        booking.status,
                        index
                      )}`}
                    >
                      {booking.fullName.split(" ")[0]}
                    </button>
                  ))}
                  {dayBookings.length > 2 && (
                    <div className="text-xs text-slate-400 px-1">
                      +{dayBookings.length - 2} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Leyenda</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-slate-300 text-sm">Confirmada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500/50 border border-amber-500 rounded"></div>
            <span className="text-slate-300 text-sm">Pendiente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 ring-2 ring-orange-500 rounded"></div>
            <span className="text-slate-300 text-sm">Hoy</span>
          </div>
        </div>
      </div>

      {/* Active Bookings List */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Reservas Activas
        </h3>
        <div className="space-y-3">
          {bookings.length === 0 ? (
            <p className="text-slate-400">No hay reservas activas</p>
          ) : (
            bookings.map((booking, index) => (
              <div
                key={booking.id}
                className={`flex items-center gap-4 p-3 rounded-lg border border-slate-700 hover:bg-slate-700/30 cursor-pointer transition-colors ${
                  selectedBooking?.id === booking.id ? "bg-slate-700/50" : ""
                }`}
                onClick={() => setSelectedBooking(booking)}
              >
                <div
                  className={`w-3 h-3 rounded-full ${getBookingColor(
                    booking.status,
                    index
                  )}`}
                ></div>
                <div className="flex-1">
                  <p className="text-white font-medium">{booking.fullName}</p>
                  <p className="text-slate-400 text-sm">
                    {format(new Date(booking.startDate), "dd MMM", {
                      locale: es,
                    })}{" "}
                    -{" "}
                    {format(new Date(booking.endDate), "dd MMM yyyy", {
                      locale: es,
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-orange-500 font-medium">
                    {booking.weeks} sem
                  </p>
                  <span
                    className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                      booking.status === "confirmed"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-amber-500/10 text-amber-500"
                    }`}
                  >
                    {booking.status === "confirmed" ? "Confirmada" : "Pendiente"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">
                Detalles de Reserva
              </h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 hover:bg-slate-700 rounded transition-colors"
              >
                <svg
                  className="w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm">Cliente</p>
                <p className="text-white font-medium">
                  {selectedBooking.fullName}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Inicio</p>
                  <p className="text-white">
                    {format(new Date(selectedBooking.startDate), "dd MMM yyyy", {
                      locale: es,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Fin</p>
                  <p className="text-white">
                    {format(new Date(selectedBooking.endDate), "dd MMM yyyy", {
                      locale: es,
                    })}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Duración</p>
                  <p className="text-white">{selectedBooking.weeks} semanas</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Total</p>
                  <p className="text-orange-500 font-medium">
                    ${selectedBooking.weeks * 70} AUD
                  </p>
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Estado</p>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    selectedBooking.status === "confirmed"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-amber-500/10 text-amber-500"
                  }`}
                >
                  {selectedBooking.status === "confirmed"
                    ? "Confirmada"
                    : "Pendiente"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
