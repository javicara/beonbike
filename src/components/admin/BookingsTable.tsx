"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Booking {
  id: string;
  bikeType: string;
  startDate: Date;
  endDate: Date;
  weeks: number;
  fullName: string;
  documentId: string;
  address: string;
  email: string;
  phone: string | null;
  notes: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface BookingsTableProps {
  initialBookings: Booking[];
}

const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendientes" },
  { value: "confirmed", label: "Confirmadas" },
  { value: "cancelled", label: "Canceladas" },
];

export default function BookingsTable({ initialBookings }: BookingsTableProps) {
  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredBookings = bookings.filter((booking) => {
    const matchesFilter = filter === "all" || booking.status === filter;
    const matchesSearch =
      search === "" ||
      booking.fullName.toLowerCase().includes(search.toLowerCase()) ||
      booking.email.toLowerCase().includes(search.toLowerCase()) ||
      booking.documentId.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmada";
      case "cancelled":
        return "Cancelada";
      default:
        return "Pendiente";
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre, email o documento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="flex gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filter === option.value
                  ? "bg-orange-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Fechas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Detalles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-slate-400"
                  >
                    No se encontraron reservas
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <>
                    <tr
                      key={booking.id}
                      className="hover:bg-slate-700/30 cursor-pointer"
                      onClick={() =>
                        setExpandedId(
                          expandedId === booking.id ? null : booking.id
                        )
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-white font-medium">
                            {booking.fullName}
                          </p>
                          <p className="text-slate-400 text-sm">
                            {booking.documentId}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-slate-300 text-sm">
                            {booking.email}
                          </p>
                          <p className="text-slate-400 text-sm">
                            {booking.phone || "-"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                        <div>
                          <p>
                            {format(new Date(booking.startDate), "dd MMM yyyy", {
                              locale: es,
                            })}
                          </p>
                          <p className="text-slate-400 text-sm">
                            hasta{" "}
                            {format(new Date(booking.endDate), "dd MMM yyyy", {
                              locale: es,
                            })}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-white">{booking.weeks} semanas</p>
                          <p className="text-orange-500 font-medium">
                            ${booking.weeks * 70} AUD
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {getStatusLabel(booking.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className="flex gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {booking.status !== "confirmed" && (
                            <button
                              onClick={() => updateStatus(booking.id, "confirmed")}
                              disabled={updating === booking.id}
                              className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50"
                              title="Confirmar"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </button>
                          )}
                          {booking.status !== "cancelled" && (
                            <button
                              onClick={() => updateStatus(booking.id, "cancelled")}
                              disabled={updating === booking.id}
                              className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
                              title="Cancelar"
                            >
                              <svg
                                className="w-4 h-4"
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
                          )}
                          {booking.status !== "pending" && (
                            <button
                              onClick={() => updateStatus(booking.id, "pending")}
                              disabled={updating === booking.id}
                              className="p-2 bg-amber-500/10 text-amber-500 rounded-lg hover:bg-amber-500/20 transition-colors disabled:opacity-50"
                              title="Marcar como pendiente"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedId === booking.id && (
                      <tr className="bg-slate-700/20">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-slate-400">Dirección</p>
                              <p className="text-white">{booking.address}</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Tipo de Bici</p>
                              <p className="text-white capitalize">
                                {booking.bikeType}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-400">Fecha de Reserva</p>
                              <p className="text-white">
                                {format(
                                  new Date(booking.createdAt),
                                  "dd MMM yyyy HH:mm",
                                  { locale: es }
                                )}
                              </p>
                            </div>
                            {booking.notes && (
                              <div className="md:col-span-3">
                                <p className="text-slate-400">Notas</p>
                                <p className="text-white">{booking.notes}</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="flex justify-between items-center text-sm text-slate-400">
        <p>
          Mostrando {filteredBookings.length} de {bookings.length} reservas
        </p>
        <p>
          Total estimado:{" "}
          <span className="text-orange-500 font-medium">
            $
            {filteredBookings
              .filter((b) => b.status === "confirmed")
              .reduce((acc, b) => acc + b.weeks * 70, 0)}{" "}
            AUD
          </span>{" "}
          (confirmadas)
        </p>
      </div>
    </div>
  );
}
