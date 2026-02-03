'use client';

import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { format, differenceInWeeks, addWeeks } from 'date-fns';
import { es } from 'date-fns/locale';

// Lazy load modals for better initial load performance
const BookingDetailModal = lazy(() => import('./BookingDetailModal'));
const NewBookingModal = lazy(() => import('./NewBookingModal'));

interface Payment {
  id: string;
  amount: number;
  date: Date | string;
  type: string;
  method: string;
  notes: string | null;
}

interface Bike {
  id: string;
  name: string;
  status: string;
}

interface Booking {
  id: string;
  bikeType: string;
  startDate: Date | string;
  endDate: Date | string;
  weeks: number;
  fullName: string;
  documentId: string;
  address: string;
  email: string;
  phone: string | null;
  hasWhatsapp: boolean;
  notes: string | null;
  status: string;
  bikeId: string | null;
  bike: Bike | null;
  agreedPrice: number | null;
  contractStatus: string;
  bondAmount: number;
  bondStatus: string;
  createdBy: string;
  createdAt: Date | string;
  payments: Payment[];
}

interface BookingsTableProps {
  initialBookings: Booking[];
  bikes: Bike[];
  defaultPrice: number;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'confirmed', label: 'Confirmadas' },
  { value: 'cancelled', label: 'Canceladas' },
] as const;

const ITEMS_PER_PAGE = 20;

// Utility function for debt calculation - memoize-friendly
function calculateDebt(booking: Booking, defaultPrice: number): number {
  if (booking.status !== 'confirmed') return 0;

  const now = new Date();
  const startDate = new Date(booking.startDate);

  if (now < startDate) return 0;

  const weeksElapsed = Math.min(
    Math.ceil(differenceInWeeks(now, startDate)) + 1,
    booking.weeks
  );

  const pricePerWeek = booking.agreedPrice || defaultPrice;
  const totalDue = weeksElapsed * pricePerWeek;
  const totalPaid = booking.payments.reduce((sum, p) => sum + p.amount, 0);

  return Math.max(0, totalDue - totalPaid);
}

// Helper components for better rendering
const StatusBadge = ({ status }: { status: string }) => {
  const colors = {
    confirmed: 'bg-green-500/10 text-green-500 border-green-500/20',
    cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  };
  const labels = {
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
    pending: 'Pendiente',
  };
  const color = colors[status as keyof typeof colors] || colors.pending;
  const label = labels[status as keyof typeof labels] || 'Pendiente';

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${color}`}>
      {label}
    </span>
  );
};

const BondStatusBadge = ({ status }: { status: string }) => {
  const labels = { paid: 'Pagado', returned: 'Devuelto', not_paid: 'No pagado' };
  const colors = { paid: 'text-green-500', returned: 'text-blue-500', not_paid: 'text-amber-500' };
  const label = labels[status as keyof typeof labels] || 'No pagado';
  const color = colors[status as keyof typeof colors] || colors.not_paid;

  return <span className={`font-medium ${color}`}>{label}</span>;
};

// Loading spinner for modals
const ModalLoader = () => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-slate-800 rounded-xl p-6">
      <svg className="w-8 h-8 animate-spin text-orange-500" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
);

export default function BookingsTable({ initialBookings, bikes, defaultPrice }: BookingsTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Auto-select booking from URL query param
  useEffect(() => {
    const selectedId = searchParams.get('selected');
    if (selectedId && !selectedBookingId) {
      setSelectedBookingId(selectedId);
    }
  }, [searchParams, selectedBookingId]);

  // Get selected booking from ID
  const selectedBooking = useMemo(() => {
    if (!selectedBookingId) return null;
    return bookings.find((b) => b.id === selectedBookingId) || null;
  }, [selectedBookingId, bookings]);

  // Memoized filtered bookings
  const filteredBookings = useMemo(() => {
    const searchLower = search.toLowerCase();
    return bookings.filter((booking) => {
      const matchesFilter = filter === 'all' || booking.status === filter;
      const matchesSearch =
        search === '' ||
        booking.fullName.toLowerCase().includes(searchLower) ||
        booking.email.toLowerCase().includes(searchLower) ||
        (booking.bike?.name || '').toLowerCase().includes(searchLower);
      return matchesFilter && matchesSearch;
    });
  }, [bookings, filter, search]);

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBookings.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBookings, currentPage]);

  // Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

  // Memoized summary calculations
  const summary = useMemo(() => {
    const confirmedBookings = filteredBookings.filter((b) => b.status === 'confirmed');
    const totalPaid = confirmedBookings.reduce(
      (acc, b) => acc + b.payments.reduce((s, p) => s + p.amount, 0),
      0
    );
    const totalDebt = confirmedBookings.reduce(
      (acc, b) => acc + calculateDebt(b, defaultPrice),
      0
    );
    return { totalPaid, totalDebt };
  }, [filteredBookings, defaultPrice]);

  // Handlers with useCallback
  const handleSelectBooking = useCallback((booking: Booking | null) => {
    setSelectedBookingId(booking?.id || null);
    if (booking) {
      router.replace(`/admin/bookings?selected=${booking.id}`, { scroll: false });
    } else {
      router.replace('/admin/bookings', { scroll: false });
    }
  }, [router]);

  const handleBookingUpdate = useCallback((updated: Booking) => {
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  }, []);

  const handleBookingCreate = useCallback((created: Booking) => {
    setBookings((prev) => [created, ...prev]);
    setShowNewForm(false);
  }, []);

  const availableBikes = useMemo(() =>
    bikes.filter((b) => b.status === 'available' || b.id === selectedBooking?.bikeId),
    [bikes, selectedBooking?.bikeId]
  );

  return (
    <div className="space-y-4">
      {/* Filters and Actions */}
      <div className="space-y-3">
        {/* Search and New button */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            onClick={() => setShowNewForm(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-colors flex items-center gap-2 flex-shrink-0 min-h-[44px] min-w-[44px]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Nueva Reserva</span>
          </button>
        </div>

        {/* Status filters - horizontal scroll on mobile with larger touch targets */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide snap-x">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 snap-start min-h-[44px] ${
                filter === option.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 active:bg-slate-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="divide-y divide-slate-700">
          {paginatedBookings.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-400">No se encontraron reservas</p>
            </div>
          ) : (
            paginatedBookings.map((booking) => {
              const debt = calculateDebt(booking, defaultPrice);
              const pricePerWeek = booking.agreedPrice || defaultPrice;

              return (
                <button
                  key={booking.id}
                  onClick={() => handleSelectBooking(booking)}
                  className="w-full text-left p-4 hover:bg-slate-700/30 active:bg-slate-700/50 cursor-pointer flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 transition-colors min-h-[72px]"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-semibold truncate">{booking.fullName}</h3>
                      <StatusBadge status={booking.status} />
                      {booking.contractStatus === 'signed' && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-500/10 text-purple-400">
                          Contrato
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 mt-1 text-sm text-slate-400 flex-wrap">
                      <span className="truncate max-w-[120px] sm:max-w-none">{booking.bike?.name || 'Sin bici'}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="text-xs sm:text-sm">
                        {format(new Date(booking.startDate), 'dd MMM', { locale: es })} - {format(new Date(booking.endDate), 'dd MMM', { locale: es })}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">{booking.weeks} sem × ${pricePerWeek}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 text-sm">
                    <div className="text-left sm:text-right">
                      <p className="text-xs sm:text-sm">
                        Bond: <BondStatusBadge status={booking.bondStatus} />
                      </p>
                      {debt > 0 && booking.status === 'confirmed' && (
                        <p className="text-red-400 text-xs sm:text-sm">Debe: ${debt}</p>
                      )}
                    </div>
                    <svg className="w-5 h-5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2.5 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-slate-400 text-sm px-3">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2.5 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="flex flex-wrap justify-between items-center gap-4 text-sm text-slate-400">
        <p>Mostrando {paginatedBookings.length} de {filteredBookings.length} reservas</p>
        <div className="flex gap-4 sm:gap-6">
          <p>
            Total pagado:{' '}
            <span className="text-green-500 font-medium">${summary.totalPaid} AUD</span>
          </p>
          <p>
            Deuda total:{' '}
            <span className="text-red-400 font-medium">${summary.totalDebt} AUD</span>
          </p>
        </div>
      </div>

      {/* Lazy loaded modals */}
      {selectedBooking && (
        <Suspense fallback={<ModalLoader />}>
          <BookingDetailModal
            booking={selectedBooking}
            bikes={availableBikes}
            defaultPrice={defaultPrice}
            onClose={() => handleSelectBooking(null)}
            onUpdate={handleBookingUpdate}
          />
        </Suspense>
      )}

      {showNewForm && (
        <Suspense fallback={<ModalLoader />}>
          <NewBookingModal
            bikes={bikes.filter((b) => b.status === 'available')}
            defaultPrice={defaultPrice}
            onClose={() => setShowNewForm(false)}
            onCreate={handleBookingCreate}
          />
        </Suspense>
      )}
    </div>
  );
}

// Export types for modal components
export type { Booking, Bike, Payment };
