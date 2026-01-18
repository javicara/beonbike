'use client';

import { useState } from 'react';
import { format, differenceInWeeks } from 'date-fns';
import { es } from 'date-fns/locale';

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

const statusOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'confirmed', label: 'Confirmadas' },
  { value: 'cancelled', label: 'Canceladas' },
];

export default function BookingsTable({ initialBookings, bikes, defaultPrice }: BookingsTableProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // New booking form state
  const [newBooking, setNewBooking] = useState({
    fullName: '',
    documentId: '',
    address: '',
    email: '',
    phone: '',
    hasWhatsapp: true,
    startDate: '',
    endDate: '',
    weeks: 2,
    bikeId: '',
    agreedPrice: defaultPrice.toString(),
    bondAmount: '140',
    status: 'confirmed',
    notes: '',
  });

  // Payment form state
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [newPayment, setNewPayment] = useState({
    amount: defaultPrice.toString(),
    type: 'weekly',
    method: 'cash',
    notes: '',
  });

  const filteredBookings = bookings.filter((booking) => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch =
      search === '' ||
      booking.fullName.toLowerCase().includes(search.toLowerCase()) ||
      booking.email.toLowerCase().includes(search.toLowerCase()) ||
      (booking.bike?.name || '').toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'cancelled': return 'Cancelada';
      default: return 'Pendiente';
    }
  };

  const getBondStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pagado';
      case 'returned': return 'Devuelto';
      default: return 'No pagado';
    }
  };

  const getBondStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-500';
      case 'returned': return 'text-blue-500';
      default: return 'text-amber-500';
    }
  };

  // Calculate debt for a booking
  const calculateDebt = (booking: Booking) => {
    if (booking.status !== 'confirmed') return 0;

    const now = new Date();
    const startDate = new Date(booking.startDate);

    // If rental hasn't started yet, no debt
    if (now < startDate) return 0;

    // Calculate weeks elapsed (capped at total weeks)
    const weeksElapsed = Math.min(
      Math.ceil(differenceInWeeks(now, startDate)) + 1,
      booking.weeks
    );

    const pricePerWeek = booking.agreedPrice || defaultPrice;
    const totalDue = weeksElapsed * pricePerWeek;
    const totalPaid = booking.payments.reduce((sum, p) => sum + p.amount, 0);

    return Math.max(0, totalDue - totalPaid);
  };

  const updateBooking = async (id: string, data: Record<string, unknown>) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updated = await response.json();
        setBookings(bookings.map((b) => (b.id === id ? updated : b)));
        if (selectedBooking?.id === id) {
          setSelectedBooking(updated);
        }
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking),
      });

      if (response.ok) {
        const created = await response.json();
        setBookings([created, ...bookings]);
        setShowNewForm(false);
        setNewBooking({
          fullName: '',
          documentId: '',
          address: '',
          email: '',
          phone: '',
          hasWhatsapp: true,
          startDate: '',
          endDate: '',
          weeks: 2,
          bikeId: '',
          agreedPrice: defaultPrice.toString(),
          bondAmount: '140',
          status: 'confirmed',
          notes: '',
        });
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPayment = async () => {
    if (!selectedBooking) return;
    setLoading(true);
    try {
      const response = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          ...newPayment,
        }),
      });

      if (response.ok) {
        const payment = await response.json();
        const updatedBooking = {
          ...selectedBooking,
          payments: [payment, ...selectedBooking.payments],
        };
        setSelectedBooking(updatedBooking);
        setBookings(bookings.map((b) => (b.id === selectedBooking.id ? updatedBooking : b)));
        setShowPaymentForm(false);
        setNewPayment({
          amount: (selectedBooking.agreedPrice || defaultPrice).toString(),
          type: 'weekly',
          method: 'cash',
          notes: '',
        });
      }
    } catch (error) {
      console.error('Error adding payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePayment = async (paymentId: string) => {
    if (!selectedBooking || !confirm('¿Eliminar este pago?')) return;
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedBooking = {
          ...selectedBooking,
          payments: selectedBooking.payments.filter((p) => p.id !== paymentId),
        };
        setSelectedBooking(updatedBooking);
        setBookings(bookings.map((b) => (b.id === selectedBooking.id ? updatedBooking : b)));
      }
    } catch (error) {
      console.error('Error deleting payment:', error);
    }
  };

  const availableBikes = bikes.filter(
    (b) => b.status === 'available' || b.id === selectedBooking?.bikeId
  );

  return (
    <div className="space-y-4">
      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre, email o bici..."
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
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowNewForm(true)}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Reserva
        </button>
      </div>

      {/* Bookings List */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="divide-y divide-slate-700">
          {filteredBookings.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-400">No se encontraron reservas</p>
            </div>
          ) : (
            filteredBookings.map((booking) => {
              const debt = calculateDebt(booking);
              const pricePerWeek = booking.agreedPrice || defaultPrice;

              return (
                <div
                  key={booking.id}
                  onClick={() => setSelectedBooking(booking)}
                  className="p-4 hover:bg-slate-700/30 cursor-pointer flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-semibold">{booking.fullName}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(booking.status)}`}>
                        {getStatusLabel(booking.status)}
                      </span>
                      {booking.contractStatus === 'signed' && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-500/10 text-purple-400">
                          Contrato firmado
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                      <span>{booking.bike?.name || 'Sin bici asignada'}</span>
                      <span>•</span>
                      <span>
                        {format(new Date(booking.startDate), 'dd MMM', { locale: es })} - {format(new Date(booking.endDate), 'dd MMM', { locale: es })}
                      </span>
                      <span>•</span>
                      <span>{booking.weeks} sem × ${pricePerWeek}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-right">
                      <p className={`font-medium ${getBondStatusColor(booking.bondStatus)}`}>
                        Bond: {getBondStatusLabel(booking.bondStatus)}
                      </p>
                      {debt > 0 && booking.status === 'confirmed' && (
                        <p className="text-red-400">Debe: ${debt}</p>
                      )}
                    </div>
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="flex flex-wrap justify-between items-center gap-4 text-sm text-slate-400">
        <p>Mostrando {filteredBookings.length} de {bookings.length} reservas</p>
        <div className="flex gap-6">
          <p>
            Total pagado:{' '}
            <span className="text-green-500 font-medium">
              ${filteredBookings.filter((b) => b.status === 'confirmed').reduce((acc, b) => acc + b.payments.reduce((s, p) => s + p.amount, 0), 0)} AUD
            </span>
          </p>
          <p>
            Deuda total:{' '}
            <span className="text-red-400 font-medium">
              ${filteredBookings.filter((b) => b.status === 'confirmed').reduce((acc, b) => acc + calculateDebt(b), 0)} AUD
            </span>
          </p>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-2xl my-8">
            <div className="p-6 border-b border-slate-700 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-white">{selectedBooking.fullName}</h2>
                <p className="text-slate-400 text-sm">{selectedBooking.email} • {selectedBooking.phone || 'Sin teléfono'}</p>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="text-slate-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status & Actions */}
              <div className="flex flex-wrap gap-2">
                {['pending', 'confirmed', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateBooking(selectedBooking.id, { status })}
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedBooking.status === status
                        ? status === 'confirmed' ? 'bg-green-500 text-white' : status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {getStatusLabel(status)}
                  </button>
                ))}
              </div>

              {/* Bike Assignment */}
              <div>
                <label className="block text-white font-medium mb-2">Bici Asignada</label>
                <select
                  value={selectedBooking.bikeId || ''}
                  onChange={(e) => updateBooking(selectedBooking.id, { bikeId: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Sin asignar</option>
                  {availableBikes.map((bike) => (
                    <option key={bike.id} value={bike.id}>{bike.name}</option>
                  ))}
                </select>
              </div>

              {/* Price & Contract */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Precio Semanal ($AUD)</label>
                  <input
                    type="number"
                    value={selectedBooking.agreedPrice || defaultPrice}
                    onChange={(e) => updateBooking(selectedBooking.id, { agreedPrice: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Contrato</label>
                  <button
                    onClick={() => updateBooking(selectedBooking.id, {
                      contractStatus: selectedBooking.contractStatus === 'signed' ? 'unsigned' : 'signed'
                    })}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedBooking.contractStatus === 'signed'
                        ? 'bg-purple-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {selectedBooking.contractStatus === 'signed' ? 'Firmado ✓' : 'No firmado'}
                  </button>
                </div>
              </div>

              {/* Bond */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Bond ($AUD)</label>
                  <input
                    type="number"
                    value={selectedBooking.bondAmount}
                    onChange={(e) => updateBooking(selectedBooking.id, { bondAmount: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Estado del Bond</label>
                  <select
                    value={selectedBooking.bondStatus}
                    onChange={(e) => updateBooking(selectedBooking.id, { bondStatus: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="not_paid">No pagado</option>
                    <option value="paid">Pagado</option>
                    <option value="returned">Devuelto</option>
                  </select>
                </div>
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Período</p>
                  <p className="text-white">
                    {format(new Date(selectedBooking.startDate), 'dd MMM yyyy', { locale: es })} - {format(new Date(selectedBooking.endDate), 'dd MMM yyyy', { locale: es })}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Semanas</p>
                  <p className="text-white">{selectedBooking.weeks} semanas</p>
                </div>
                <div>
                  <p className="text-slate-400">Dirección</p>
                  <p className="text-white">{selectedBooking.address || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-400">Documento</p>
                  <p className="text-white">{selectedBooking.documentId || '-'}</p>
                </div>
              </div>

              {/* Debt Summary */}
              {selectedBooking.status === 'confirmed' && (
                <div className={`p-4 rounded-lg ${calculateDebt(selectedBooking) > 0 ? 'bg-red-500/10 border border-red-500/20' : 'bg-green-500/10 border border-green-500/20'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className={`font-medium ${calculateDebt(selectedBooking) > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {calculateDebt(selectedBooking) > 0 ? 'Deuda pendiente' : 'Al día'}
                      </p>
                      <p className="text-sm text-slate-400">
                        Pagado: ${selectedBooking.payments.reduce((s, p) => s + p.amount, 0)} de ${selectedBooking.weeks * (selectedBooking.agreedPrice || defaultPrice)}
                      </p>
                    </div>
                    <p className={`text-2xl font-bold ${calculateDebt(selectedBooking) > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      ${calculateDebt(selectedBooking)}
                    </p>
                  </div>
                </div>
              )}

              {/* Payments */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-white font-medium">Pagos</h3>
                  <button
                    onClick={() => setShowPaymentForm(true)}
                    className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-sm hover:bg-green-500/20 transition-colors"
                  >
                    + Agregar Pago
                  </button>
                </div>

                {showPaymentForm && (
                  <div className="bg-slate-700 rounded-lg p-4 mb-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        placeholder="Monto"
                        value={newPayment.amount}
                        onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                        className="px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm"
                      />
                      <select
                        value={newPayment.type}
                        onChange={(e) => setNewPayment({ ...newPayment, type: e.target.value })}
                        className="px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm"
                      >
                        <option value="weekly">Semanal</option>
                        <option value="advance">Adelanto</option>
                        <option value="other">Otro</option>
                      </select>
                    </div>
                    <select
                      value={newPayment.method}
                      onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm"
                    >
                      <option value="cash">Efectivo</option>
                      <option value="transfer">Transferencia</option>
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowPaymentForm(false)}
                        className="flex-1 px-3 py-2 bg-slate-600 text-white rounded-lg text-sm"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={addPayment}
                        disabled={loading}
                        className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {selectedBooking.payments.length === 0 ? (
                    <p className="text-slate-400 text-sm py-4 text-center">No hay pagos registrados</p>
                  ) : (
                    selectedBooking.payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between bg-slate-700 rounded-lg px-4 py-3">
                        <div>
                          <p className="text-white font-medium">${payment.amount}</p>
                          <p className="text-slate-400 text-xs">
                            {format(new Date(payment.date), 'dd MMM yyyy', { locale: es })} • {payment.type === 'weekly' ? 'Semanal' : payment.type === 'advance' ? 'Adelanto' : 'Otro'} • {payment.method === 'cash' ? 'Efectivo' : 'Transferencia'}
                          </p>
                        </div>
                        <button
                          onClick={() => deletePayment(payment.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Booking Modal */}
      {showNewForm && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-lg my-8">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white">Nueva Reserva</h2>
            </div>
            <form onSubmit={createBooking} className="p-6 space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Nombre Completo *</label>
                <input
                  type="text"
                  value={newBooking.fullName}
                  onChange={(e) => setNewBooking({ ...newBooking, fullName: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    value={newBooking.email}
                    onChange={(e) => setNewBooking({ ...newBooking, email: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={newBooking.phone}
                    onChange={(e) => setNewBooking({ ...newBooking, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Fecha Inicio *</label>
                  <input
                    type="date"
                    value={newBooking.startDate}
                    onChange={(e) => setNewBooking({ ...newBooking, startDate: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Fecha Fin *</label>
                  <input
                    type="date"
                    value={newBooking.endDate}
                    onChange={(e) => setNewBooking({ ...newBooking, endDate: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Semanas *</label>
                  <input
                    type="number"
                    min="1"
                    value={newBooking.weeks}
                    onChange={(e) => setNewBooking({ ...newBooking, weeks: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Precio/Sem</label>
                  <input
                    type="number"
                    value={newBooking.agreedPrice}
                    onChange={(e) => setNewBooking({ ...newBooking, agreedPrice: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Bond</label>
                  <input
                    type="number"
                    value={newBooking.bondAmount}
                    onChange={(e) => setNewBooking({ ...newBooking, bondAmount: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Bici</label>
                <select
                  value={newBooking.bikeId}
                  onChange={(e) => setNewBooking({ ...newBooking, bikeId: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="">Sin asignar</option>
                  {bikes.filter((b) => b.status === 'available').map((bike) => (
                    <option key={bike.id} value={bike.id}>{bike.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewForm(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium"
                >
                  {loading ? 'Creando...' : 'Crear Reserva'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
