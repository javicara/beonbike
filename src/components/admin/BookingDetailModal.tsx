'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { format, differenceInWeeks, addWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Booking, Bike, Payment } from './BookingsTable';

interface BookingDetailModalProps {
  booking: Booking;
  bikes: Bike[];
  defaultPrice: number;
  onClose: () => void;
  onUpdate: (booking: Booking) => void;
}

const STATUS_LABELS = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
} as const;

export default function BookingDetailModal({
  booking,
  bikes,
  defaultPrice,
  onClose,
  onUpdate,
}: BookingDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editPrice, setEditPrice] = useState((booking.agreedPrice || defaultPrice).toString());
  const [editBond, setEditBond] = useState(booking.bondAmount.toString());
  const [newPayment, setNewPayment] = useState({
    amount: (booking.agreedPrice || defaultPrice).toString(),
    type: 'weekly',
    method: 'cash',
    notes: '',
  });

  // Sync local state when booking changes
  useEffect(() => {
    setEditPrice((booking.agreedPrice || defaultPrice).toString());
    setEditBond(booking.bondAmount.toString());
  }, [booking.id, booking.agreedPrice, booking.bondAmount, defaultPrice]);

  // Calculate debt
  const debt = useMemo(() => {
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
  }, [booking, defaultPrice]);

  const totalPaid = useMemo(
    () => booking.payments.reduce((s, p) => s + p.amount, 0),
    [booking.payments]
  );

  const updateBooking = useCallback(async (data: Record<string, unknown>) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updated = await response.json();
        onUpdate(updated);
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    } finally {
      setLoading(false);
    }
  }, [booking.id, onUpdate]);

  const addPayment = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          ...newPayment,
        }),
      });

      if (response.ok) {
        const payment = await response.json();
        onUpdate({
          ...booking,
          payments: [payment, ...booking.payments],
        });
        setShowPaymentForm(false);
        setNewPayment({
          amount: (booking.agreedPrice || defaultPrice).toString(),
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
  }, [booking, defaultPrice, newPayment, onUpdate]);

  const deletePayment = useCallback(async (paymentId: string) => {
    if (!confirm('Eliminar este pago?')) return;
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onUpdate({
          ...booking,
          payments: booking.payments.filter((p) => p.id !== paymentId),
        });
      }
    } catch (error) {
      console.error('Error deleting payment:', error);
    }
  }, [booking, onUpdate]);

  const handlePriceBlur = useCallback(() => {
    const newPrice = parseFloat(editPrice);
    if (!isNaN(newPrice) && newPrice !== booking.agreedPrice) {
      updateBooking({ agreedPrice: newPrice });
    }
  }, [editPrice, booking.agreedPrice, updateBooking]);

  const handleBondBlur = useCallback(() => {
    const newBond = parseFloat(editBond);
    if (!isNaN(newBond) && newBond !== booking.bondAmount) {
      updateBooking({ bondAmount: newBond });
    }
  }, [editBond, booking.bondAmount, updateBooking]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-2 sm:p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-2xl my-2 sm:my-8">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-700 flex justify-between items-start gap-3">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold text-white truncate">{booking.fullName}</h2>
            <p className="text-slate-400 text-xs sm:text-sm truncate">{booking.email}</p>
            <p className="text-slate-400 text-xs sm:text-sm">{booking.phone || 'Sin telefono'}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 -mr-2 flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Status & Actions */}
          <div className="flex flex-wrap gap-2">
            {(['pending', 'confirmed', 'cancelled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => updateBooking({ status })}
                disabled={loading}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                  booking.status === status
                    ? status === 'confirmed' ? 'bg-green-500 text-white'
                    : status === 'cancelled' ? 'bg-red-500 text-white'
                    : 'bg-amber-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600 active:bg-slate-500'
                }`}
              >
                {STATUS_LABELS[status]}
              </button>
            ))}
          </div>

          {/* Bike Assignment */}
          <div>
            <label className="block text-white font-medium mb-2">Bici Asignada</label>
            <select
              value={booking.bikeId || ''}
              onChange={(e) => updateBooking({ bikeId: e.target.value || null })}
              className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[44px]"
            >
              <option value="">Sin asignar</option>
              {bikes.map((bike) => (
                <option key={bike.id} value={bike.id}>{bike.name}</option>
              ))}
            </select>
          </div>

          {/* Price & Contract */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">Precio Semanal ($AUD)</label>
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                onBlur={handlePriceBlur}
                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">Contrato</label>
              <button
                onClick={() => updateBooking({
                  contractStatus: booking.contractStatus === 'signed' ? 'unsigned' : 'signed'
                })}
                className={`w-full px-4 py-2.5 rounded-lg font-medium transition-colors min-h-[44px] ${
                  booking.contractStatus === 'signed'
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {booking.contractStatus === 'signed' ? 'Firmado' : 'No firmado'}
              </button>
            </div>
          </div>

          {/* Bond */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">Bond ($AUD)</label>
              <input
                type="number"
                value={editBond}
                onChange={(e) => setEditBond(e.target.value)}
                onBlur={handleBondBlur}
                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">Estado del Bond</label>
              <select
                value={booking.bondStatus}
                onChange={(e) => updateBooking({ bondStatus: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[44px]"
              >
                <option value="not_paid">No pagado</option>
                <option value="paid">Pagado</option>
                <option value="returned">Devuelto</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-slate-700/50 rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <h3 className="text-white font-medium text-sm sm:text-base">Fechas del Alquiler</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const newEndDate = addWeeks(new Date(booking.endDate), 1);
                    updateBooking({
                      endDate: newEndDate.toISOString(),
                      weeks: booking.weeks + 1,
                    });
                  }}
                  disabled={loading}
                  className="flex-1 sm:flex-none px-3 py-2 bg-orange-500/20 text-orange-400 rounded-lg text-sm hover:bg-orange-500/30 transition-colors min-h-[40px]"
                >
                  +1 Sem
                </button>
                <button
                  onClick={() => {
                    const newEndDate = addWeeks(new Date(booking.endDate), 2);
                    updateBooking({
                      endDate: newEndDate.toISOString(),
                      weeks: booking.weeks + 2,
                    });
                  }}
                  disabled={loading}
                  className="flex-1 sm:flex-none px-3 py-2 bg-orange-500/20 text-orange-400 rounded-lg text-sm hover:bg-orange-500/30 transition-colors min-h-[40px]"
                >
                  +2 Sem
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div>
                <label className="block text-slate-400 text-xs sm:text-sm mb-1">Inicio</label>
                <input
                  type="date"
                  value={format(new Date(booking.startDate), 'yyyy-MM-dd')}
                  onChange={(e) => updateBooking({ startDate: new Date(e.target.value).toISOString() })}
                  className="w-full px-2 sm:px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[40px]"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-xs sm:text-sm mb-1">Fin</label>
                <input
                  type="date"
                  value={format(new Date(booking.endDate), 'yyyy-MM-dd')}
                  onChange={(e) => updateBooking({ endDate: new Date(e.target.value).toISOString() })}
                  className="w-full px-2 sm:px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[40px]"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-xs sm:text-sm mb-1">Sem</label>
                <input
                  type="number"
                  min="1"
                  value={booking.weeks}
                  onChange={(e) => {
                    const newWeeks = parseInt(e.target.value) || 1;
                    const newEndDate = addWeeks(new Date(booking.startDate), newWeeks);
                    updateBooking({
                      weeks: newWeeks,
                      endDate: newEndDate.toISOString(),
                    });
                  }}
                  className="w-full px-2 sm:px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[40px]"
                />
              </div>
            </div>
            <div className="text-xs sm:text-sm text-slate-400">
              Total: <span className="text-white font-medium">{booking.weeks} sem x ${editPrice || defaultPrice} = ${booking.weeks * (parseFloat(editPrice) || defaultPrice)} AUD</span>
            </div>
          </div>

          {/* Client Info */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div>
              <p className="text-slate-400">Direccion</p>
              <p className="text-white truncate">{booking.address || '-'}</p>
            </div>
            <div>
              <p className="text-slate-400">Documento</p>
              <p className="text-white">{booking.documentId || '-'}</p>
            </div>
            <div>
              <p className="text-slate-400">WhatsApp</p>
              <p className="text-white">{booking.hasWhatsapp ? 'Si' : 'No'}</p>
            </div>
            <div>
              <p className="text-slate-400">Creado por</p>
              <p className="text-white">{booking.createdBy === 'admin' ? 'Admin' : 'Formulario'}</p>
            </div>
          </div>

          {/* Debt Summary */}
          {booking.status === 'confirmed' && (
            <div className={`p-4 rounded-lg ${debt > 0 ? 'bg-red-500/10 border border-red-500/20' : 'bg-green-500/10 border border-green-500/20'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className={`font-medium ${debt > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {debt > 0 ? 'Deuda pendiente' : 'Al dia'}
                  </p>
                  <p className="text-sm text-slate-400">
                    Pagado: ${totalPaid} de ${booking.weeks * (booking.agreedPrice || defaultPrice)}
                  </p>
                </div>
                <p className={`text-2xl font-bold ${debt > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  ${debt}
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
                className="px-3 py-2 bg-green-500/10 text-green-500 rounded-lg text-sm hover:bg-green-500/20 transition-colors min-h-[40px]"
              >
                + Agregar Pago
              </button>
            </div>

            {showPaymentForm && (
              <div className="bg-slate-700 rounded-lg p-3 sm:p-4 mb-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <input
                    type="number"
                    placeholder="Monto"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                    className="px-3 py-2.5 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm min-h-[44px]"
                  />
                  <select
                    value={newPayment.type}
                    onChange={(e) => setNewPayment({ ...newPayment, type: e.target.value })}
                    className="px-3 py-2.5 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm min-h-[44px]"
                  >
                    <option value="weekly">Semanal</option>
                    <option value="advance">Adelanto</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
                <select
                  value={newPayment.method}
                  onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm min-h-[44px]"
                >
                  <option value="cash">Efectivo</option>
                  <option value="transfer">Transferencia</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPaymentForm(false)}
                    className="flex-1 px-3 py-2.5 bg-slate-600 text-white rounded-lg text-sm active:scale-[0.98] min-h-[44px]"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={addPayment}
                    disabled={loading}
                    className="flex-1 px-3 py-2.5 bg-green-500 text-white rounded-lg text-sm font-medium active:scale-[0.98] min-h-[44px]"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {booking.payments.length === 0 ? (
                <p className="text-slate-400 text-sm py-4 text-center">No hay pagos registrados</p>
              ) : (
                booking.payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between bg-slate-700 rounded-lg px-4 py-3">
                    <div>
                      <p className="text-white font-medium">${payment.amount}</p>
                      <p className="text-slate-400 text-xs">
                        {format(new Date(payment.date), 'dd MMM yyyy', { locale: es })} - {payment.type === 'weekly' ? 'Semanal' : payment.type === 'advance' ? 'Adelanto' : 'Otro'} - {payment.method === 'cash' ? 'Efectivo' : 'Transferencia'}
                      </p>
                    </div>
                    <button
                      onClick={() => deletePayment(payment.id)}
                      className="text-red-400 hover:text-red-300 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
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
  );
}
