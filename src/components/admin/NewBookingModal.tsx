'use client';

import { useState, useCallback } from 'react';
import type { Booking, Bike } from './BookingsTable';

interface NewBookingModalProps {
  bikes: Bike[];
  defaultPrice: number;
  onClose: () => void;
  onCreate: (booking: Booking) => void;
}

export default function NewBookingModal({
  bikes,
  defaultPrice,
  onClose,
  onCreate,
}: NewBookingModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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

  const handleChange = useCallback((field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const created = await response.json();
        onCreate(created);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    } finally {
      setLoading(false);
    }
  }, [formData, onCreate]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-2 sm:p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-lg my-2 sm:my-8">
        <div className="p-4 sm:p-6 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Nueva Reserva</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-white font-medium mb-2 text-sm sm:text-base">Nombre Completo *</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white min-h-[44px]"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white min-h-[44px]"
                required
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">Telefono</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white min-h-[44px]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">Fecha Inicio *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm min-h-[44px]"
                required
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">Fecha Fin *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm min-h-[44px]"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">Sem *</label>
              <input
                type="number"
                min="1"
                value={formData.weeks}
                onChange={(e) => handleChange('weeks', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm min-h-[44px]"
                required
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">$/Sem</label>
              <input
                type="number"
                value={formData.agreedPrice}
                onChange={(e) => handleChange('agreedPrice', e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">Bond</label>
              <input
                type="number"
                value={formData.bondAmount}
                onChange={(e) => handleChange('bondAmount', e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm min-h-[44px]"
              />
            </div>
          </div>
          <div>
            <label className="block text-white font-medium mb-2 text-sm sm:text-base">Bici</label>
            <select
              value={formData.bikeId}
              onChange={(e) => handleChange('bikeId', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white min-h-[44px]"
            >
              <option value="">Sin asignar</option>
              {bikes.map((bike) => (
                <option key={bike.id} value={bike.id}>{bike.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-700 text-white rounded-lg active:scale-[0.98] min-h-[44px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium active:scale-[0.98] disabled:opacity-50 min-h-[44px]"
            >
              {loading ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
