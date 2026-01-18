'use client';

import { useState, useMemo } from 'react';
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
  addWeeks,
} from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

interface Bike {
  id: string;
  name: string;
  status: string;
}

interface Payment {
  id: string;
  amount: number;
  date: string;
}

interface Booking {
  id: string;
  fullName: string;
  startDate: string;
  endDate: string;
  status: string;
  weeks: number;
  bike: Bike | null;
  bikeId: string | null;
  agreedPrice: number | null;
  bondStatus: string;
  contractStatus: string;
  payments: Payment[];
}

interface Interest {
  id: string;
  fullName: string;
  email: string;
  desiredStartDate: string | null;
  desiredWeeks: number | null;
  status: string;
}

interface AvailabilityCalendarProps {
  bookings: Booking[];
  bikes: Bike[];
  interested: Interest[];
}

const bikeColors: Record<string, string> = {
  'Scott 750w': 'bg-orange-500',
  'Giant 750w': 'bg-blue-500',
  'Polygon 500w': 'bg-purple-500',
  'Crane 500w': 'bg-teal-500',
};

export default function AvailabilityCalendar({
  bookings,
  bikes,
  interested,
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending'>('all');
  const [selectedBike, setSelectedBike] = useState<string | 'all'>('all');

  // Get 8 weeks starting from current week for timeline view
  const timelineWeeks = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 8 }, (_, i) => addWeeks(start, i));
  }, []);

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = filter === 'all' || booking.status === filter;
    const matchesBike = selectedBike === 'all' || booking.bikeId === selectedBike;
    return matchesStatus && matchesBike;
  });

  const getBookingsForDay = (date: Date) => {
    return filteredBookings.filter((booking) =>
      isWithinInterval(date, {
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      })
    );
  };

  const getBikeColor = (bikeName: string | undefined) => {
    if (!bikeName) return 'bg-slate-500';
    return bikeColors[bikeName] || 'bg-slate-500';
  };

  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'Todas' },
            { value: 'confirmed', label: 'Confirmadas' },
            { value: 'pending', label: 'Pendientes' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value as typeof filter)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === opt.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <select
          value={selectedBike}
          onChange={(e) => setSelectedBike(e.target.value)}
          className="px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
        >
          <option value="all">Todas las bicis</option>
          {bikes.map((bike) => (
            <option key={bike.id} value={bike.id}>{bike.name}</option>
          ))}
        </select>
      </div>

      {/* Timeline View (Gantt-style) */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Vista por Bici</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr>
                <th className="text-left text-sm text-slate-400 py-2 w-32">Bici</th>
                {timelineWeeks.map((week) => (
                  <th key={week.toISOString()} className="text-center text-xs text-slate-400 py-2">
                    {format(week, 'dd MMM', { locale: es })}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bikes.map((bike) => {
                const bikeBookings = bookings.filter((b) => b.bikeId === bike.id);
                return (
                  <tr key={bike.id} className="border-t border-slate-700">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getBikeColor(bike.name)}`}></div>
                        <span className="text-white text-sm font-medium">{bike.name}</span>
                      </div>
                      <span className={`text-xs ${bike.status === 'available' ? 'text-green-400' : bike.status === 'rented' ? 'text-blue-400' : 'text-slate-400'}`}>
                        {bike.status === 'available' ? 'Disponible' : bike.status === 'rented' ? 'Alquilada' : 'Mantenimiento'}
                      </span>
                    </td>
                    {timelineWeeks.map((week) => {
                      const weekEnd = addWeeks(week, 1);
                      const booking = bikeBookings.find((b) => {
                        const start = new Date(b.startDate);
                        const end = new Date(b.endDate);
                        return (start <= weekEnd && end >= week);
                      });

                      return (
                        <td key={week.toISOString()} className="py-3 px-1">
                          {booking ? (
                            <Link
                              href="/admin/bookings"
                              className={`block text-center text-xs py-1 rounded ${
                                booking.status === 'confirmed'
                                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                  : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                              }`}
                              title={`${booking.fullName} - ${booking.weeks} sem`}
                            >
                              {booking.fullName.split(' ')[0]}
                            </Link>
                          ) : (
                            <div className="text-center text-slate-600">-</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-semibold text-white capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-slate-400 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const dayBookings = getBookingsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

            return (
              <div
                key={day.toISOString()}
                className={`min-h-20 p-1 rounded-lg border ${
                  isCurrentMonth ? 'bg-slate-700/30 border-slate-700' : 'bg-slate-800/50 border-slate-700/50'
                } ${isToday ? 'ring-2 ring-orange-500' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${isCurrentMonth ? 'text-white' : 'text-slate-500'} ${isToday ? 'text-orange-500' : ''}`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-0.5">
                  {dayBookings.slice(0, 3).map((booking) => (
                    <div
                      key={booking.id}
                      className={`text-xs px-1 py-0.5 rounded truncate ${
                        booking.status === 'confirmed'
                          ? `${getBikeColor(booking.bike?.name)} text-white`
                          : 'bg-amber-500/50 text-amber-100'
                      }`}
                      title={`${booking.fullName} - ${booking.bike?.name || 'Sin bici'}`}
                    >
                      {booking.fullName.split(' ')[0]}
                    </div>
                  ))}
                  {dayBookings.length > 3 && (
                    <div className="text-xs text-slate-400 px-1">+{dayBookings.length - 3}</div>
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
          {bikes.map((bike) => (
            <div key={bike.id} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${getBikeColor(bike.name)}`}></div>
              <span className="text-slate-300 text-sm">{bike.name}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500/50 rounded"></div>
            <span className="text-slate-300 text-sm">Pendiente</span>
          </div>
        </div>
      </div>

      {/* Active Bookings */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Reservas Activas ({filteredBookings.length})
        </h3>
        <div className="space-y-3">
          {filteredBookings.length === 0 ? (
            <p className="text-slate-400">No hay reservas</p>
          ) : (
            filteredBookings.map((booking) => (
              <Link
                key={booking.id}
                href="/admin/bookings"
                className="flex items-center gap-4 p-3 rounded-lg border border-slate-700 hover:bg-slate-700/30 transition-colors"
              >
                <div className={`w-3 h-3 rounded-full ${getBikeColor(booking.bike?.name)}`}></div>
                <div className="flex-1">
                  <p className="text-white font-medium">{booking.fullName}</p>
                  <p className="text-slate-400 text-sm">
                    {booking.bike?.name || 'Sin bici'} • {format(new Date(booking.startDate), 'dd MMM', { locale: es })} - {format(new Date(booking.endDate), 'dd MMM', { locale: es })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-orange-500 font-medium">{booking.weeks} sem</p>
                  <div className="flex gap-1">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {booking.status === 'confirmed' ? 'Conf' : 'Pend'}
                    </span>
                    {booking.bondStatus === 'paid' && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-500/10 text-blue-400">Bond</span>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Interested List */}
      {interested.length > 0 && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Lista de Interesados ({interested.length})
          </h3>
          <div className="space-y-3">
            {interested.map((person) => (
              <div
                key={person.id}
                className="flex items-center gap-4 p-3 rounded-lg border border-slate-700"
              >
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <div className="flex-1">
                  <p className="text-white font-medium">{person.fullName}</p>
                  <p className="text-slate-400 text-sm">{person.email}</p>
                </div>
                {person.desiredStartDate && (
                  <div className="text-right text-sm">
                    <p className="text-slate-300">
                      Quiere desde: {format(new Date(person.desiredStartDate), 'dd MMM', { locale: es })}
                    </p>
                    {person.desiredWeeks && (
                      <p className="text-slate-400">{person.desiredWeeks} semanas</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
