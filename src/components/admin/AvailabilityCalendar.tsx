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
  date: Date | string;
}

interface Booking {
  id: string;
  fullName: string;
  startDate: Date | string;
  endDate: Date | string;
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
  desiredStartDate: Date | string | null;
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
    <div className="space-y-4 sm:space-y-6">
      {/* Filters */}
      <div className="space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {[
            { value: 'all', label: 'Todas' },
            { value: 'confirmed', label: 'Confirmadas' },
            { value: 'pending', label: 'Pendientes' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value as typeof filter)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
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
          className="w-full sm:w-auto px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
        >
          <option value="all">Todas las bicis</option>
          {bikes.map((bike) => (
            <option key={bike.id} value={bike.id}>{bike.name}</option>
          ))}
        </select>
      </div>

      {/* Timeline View - Mobile: Simple list, Desktop: Gantt */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Vista por Bici</h3>

        {/* Mobile: Simple card view */}
        <div className="md:hidden space-y-3">
          {bikes.map((bike) => {
            const bikeBookings = bookings.filter((b) => b.bikeId === bike.id);
            const activeBooking = bikeBookings.find((b) => {
              const now = new Date();
              const end = new Date(b.endDate);
              return end >= now && b.status !== 'cancelled';
            });
            return (
              <div key={bike.id} className="bg-slate-700/50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getBikeColor(bike.name)}`}></div>
                    <span className="text-white font-medium text-sm">{bike.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${bike.status === 'available' ? 'bg-green-500/20 text-green-400' : bike.status === 'rented' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-600 text-slate-400'}`}>
                    {bike.status === 'available' ? 'Disponible' : bike.status === 'rented' ? 'Alquilada' : 'Mant.'}
                  </span>
                </div>
                {activeBooking && (
                  <Link href="/admin/bookings" className="mt-2 block text-sm">
                    <span className="text-slate-400">Cliente: </span>
                    <span className="text-white">{activeBooking.fullName}</span>
                    <span className="text-slate-500 block text-xs">
                      {format(new Date(activeBooking.startDate), 'dd MMM', { locale: es })} - {format(new Date(activeBooking.endDate), 'dd MMM', { locale: es })}
                    </span>
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop: Gantt table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[700px]">
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
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-3 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors active:scale-95"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-base sm:text-xl font-semibold text-white capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors active:scale-95"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
          {weekDays.map((day, i) => (
            <div key={day} className="text-center text-xs sm:text-sm font-medium text-slate-400 py-1 sm:py-2">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.charAt(0)}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
          {days.map((day) => {
            const dayBookings = getBookingsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

            return (
              <div
                key={day.toISOString()}
                className={`min-h-12 sm:min-h-20 p-0.5 sm:p-1 rounded sm:rounded-lg border ${
                  isCurrentMonth ? 'bg-slate-700/30 border-slate-700' : 'bg-slate-800/50 border-slate-700/50'
                } ${isToday ? 'ring-2 ring-orange-500' : ''}`}
              >
                <div className={`text-xs sm:text-sm font-medium mb-0.5 sm:mb-1 ${isCurrentMonth ? 'text-white' : 'text-slate-500'} ${isToday ? 'text-orange-500' : ''}`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-0.5">
                  {/* Mobile: just show dots, Desktop: show names */}
                  <div className="hidden sm:block space-y-0.5">
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
                  {/* Mobile: compact dots */}
                  <div className="sm:hidden flex flex-wrap gap-0.5 justify-center">
                    {dayBookings.slice(0, 4).map((booking) => (
                      <div
                        key={booking.id}
                        className={`w-1.5 h-1.5 rounded-full ${
                          booking.status === 'confirmed'
                            ? getBikeColor(booking.bike?.name)
                            : 'bg-amber-500'
                        }`}
                        title={`${booking.fullName}`}
                      />
                    ))}
                    {dayBookings.length > 4 && (
                      <span className="text-[8px] text-slate-400">+{dayBookings.length - 4}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Leyenda</h3>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          {bikes.map((bike) => (
            <div key={bike.id} className="flex items-center gap-2">
              <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded ${getBikeColor(bike.name)}`}></div>
              <span className="text-slate-300 text-xs sm:text-sm">{bike.name}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-amber-500/50 rounded"></div>
            <span className="text-slate-300 text-xs sm:text-sm">Pendiente</span>
          </div>
        </div>
      </div>

      {/* Active Bookings */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
          Reservas Activas ({filteredBookings.length})
        </h3>
        <div className="space-y-2 sm:space-y-3">
          {filteredBookings.length === 0 ? (
            <p className="text-slate-400 text-sm">No hay reservas</p>
          ) : (
            filteredBookings.map((booking) => (
              <Link
                key={booking.id}
                href="/admin/bookings"
                className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 rounded-lg border border-slate-700 hover:bg-slate-700/30 active:bg-slate-700/50 transition-colors"
              >
                <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 sm:mt-0 ${getBikeColor(booking.bike?.name)}`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm sm:text-base truncate">{booking.fullName}</p>
                  <p className="text-slate-400 text-xs sm:text-sm truncate">
                    {booking.bike?.name || 'Sin bici'} • {format(new Date(booking.startDate), 'dd MMM', { locale: es })} - {format(new Date(booking.endDate), 'dd MMM', { locale: es })}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-orange-500 font-medium text-sm">{booking.weeks} sem</p>
                  <div className="flex gap-1 justify-end">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {booking.status === 'confirmed' ? 'Conf' : 'Pend'}
                    </span>
                    {booking.bondStatus === 'paid' && (
                      <span className="hidden sm:inline px-2 py-0.5 text-xs font-medium rounded-full bg-blue-500/10 text-blue-400">Bond</span>
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
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
            Lista de Interesados ({interested.length})
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {interested.map((person) => (
              <div
                key={person.id}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-lg border border-slate-700"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-3 h-3 rounded-full bg-purple-500 flex-shrink-0"></div>
                  <div className="min-w-0">
                    <p className="text-white font-medium text-sm truncate">{person.fullName}</p>
                    <p className="text-slate-400 text-xs sm:text-sm truncate">{person.email}</p>
                  </div>
                </div>
                {person.desiredStartDate && (
                  <div className="text-left sm:text-right text-xs sm:text-sm ml-6 sm:ml-0">
                    <p className="text-slate-300">
                      Desde: {format(new Date(person.desiredStartDate), 'dd MMM', { locale: es })}
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
