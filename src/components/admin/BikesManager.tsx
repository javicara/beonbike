'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Rental {
  id: string;
  fullName: string;
  startDate: Date | string;
  endDate: Date | string;
}

interface Bike {
  id: string;
  name: string;
  type: string;
  status: string;
  salePrice: number | null;
  notes: string | null;
  createdAt: Date | string;
  rentals: Rental[];
}

interface BikesManagerProps {
  initialBikes: Bike[];
}

const statusLabels: Record<string, string> = {
  available: 'Disponible',
  rented: 'Alquilada',
  sold: 'Vendida',
  maintenance: 'Mantenimiento',
};

const statusColors: Record<string, string> = {
  available: 'bg-green-500/10 text-green-500',
  rented: 'bg-blue-500/10 text-blue-500',
  sold: 'bg-purple-500/10 text-purple-500',
  maintenance: 'bg-yellow-500/10 text-yellow-500',
};

const typeLabels: Record<string, string> = {
  rental: 'Alquiler',
  sale: 'Venta',
};

export default function BikesManager({ initialBikes }: BikesManagerProps) {
  const [bikes, setBikes] = useState<Bike[]>(initialBikes);
  const [showForm, setShowForm] = useState(false);
  const [editingBike, setEditingBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'rental',
    status: 'available',
    salePrice: '',
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'rental',
      status: 'available',
      salePrice: '',
      notes: '',
    });
    setEditingBike(null);
    setShowForm(false);
  };

  const handleEdit = (bike: Bike) => {
    setFormData({
      name: bike.name,
      type: bike.type,
      status: bike.status,
      salePrice: bike.salePrice?.toString() || '',
      notes: bike.notes || '',
    });
    setEditingBike(bike);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingBike
        ? `/api/admin/bikes/${editingBike.id}`
        : '/api/admin/bikes';
      const method = editingBike ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedBike = await response.json();
        if (editingBike) {
          setBikes(bikes.map((b) => (b.id === updatedBike.id ? { ...b, ...updatedBike } : b)));
        } else {
          setBikes([{ ...updatedBike, rentals: [] }, ...bikes]);
        }
        resetForm();
      }
    } catch (error) {
      console.error('Error saving bike:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bike: Bike) => {
    if (!confirm(`¿Eliminar "${bike.name}"?`)) return;

    try {
      const response = await fetch(`/api/admin/bikes/${bike.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBikes(bikes.filter((b) => b.id !== bike.id));
      } else {
        const data = await response.json();
        alert(data.error || 'Error al eliminar');
      }
    } catch (error) {
      console.error('Error deleting bike:', error);
    }
  };

  const availableBikes = bikes.filter((b) => b.status === 'available');
  const rentedBikes = bikes.filter((b) => b.status === 'rented');
  const otherBikes = bikes.filter((b) => !['available', 'rented'].includes(b.status));

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Total</p>
          <p className="text-2xl font-bold text-white">{bikes.length}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Disponibles</p>
          <p className="text-2xl font-bold text-green-500">{availableBikes.length}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Alquiladas</p>
          <p className="text-2xl font-bold text-blue-500">{rentedBikes.length}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Otros</p>
          <p className="text-2xl font-bold text-slate-400">{otherBikes.length}</p>
        </div>
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar Bici
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md my-2 sm:my-8">
            <div className="p-4 sm:p-6 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                {editingBike ? 'Editar Bici' : 'Nueva Bici'}
              </h2>
              <button onClick={resetForm} className="text-slate-400 hover:text-white p-1 -mr-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-white font-medium mb-2 text-sm sm:text-base">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ej: Scott 750w"
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-white font-medium mb-2 text-sm sm:text-base">Tipo</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="rental">Alquiler</option>
                    <option value="sale">Venta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white font-medium mb-2 text-sm sm:text-base">Estado</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="available">Disponible</option>
                    <option value="rented">Alquilada</option>
                    <option value="maintenance">Mantenimiento</option>
                    <option value="sold">Vendida</option>
                  </select>
                </div>
              </div>
              {formData.type === 'sale' && (
                <div>
                  <label className="block text-white font-medium mb-2 text-sm sm:text-base">Precio de Venta (AUD)</label>
                  <input
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              )}
              <div>
                <label className="block text-white font-medium mb-2 text-sm sm:text-base">Notas</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Notas internas..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors active:scale-[0.98]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-colors disabled:opacity-50 active:scale-[0.98]"
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bikes List */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-700">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Inventario</h2>
        </div>
        <div className="divide-y divide-slate-700">
          {bikes.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-slate-400">No hay bicis registradas</p>
              <p className="text-slate-500 text-sm mt-1">Agrega tu primera bici para comenzar</p>
            </div>
          ) : (
            bikes.map((bike) => (
              <div key={bike.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-white font-semibold text-base sm:text-lg">{bike.name}</h3>
                    <span className={`px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${statusColors[bike.status]}`}>
                      {statusLabels[bike.status]}
                    </span>
                    <span className="px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                      {typeLabels[bike.type]}
                    </span>
                  </div>
                  {bike.notes && (
                    <p className="text-slate-400 text-sm mt-1 truncate">{bike.notes}</p>
                  )}
                  {bike.rentals.length > 0 && (
                    <div className="mt-2">
                      <p className="text-blue-400 text-sm">
                        Alquilada a: {bike.rentals[0].fullName}
                      </p>
                      <p className="text-slate-500 text-xs">
                        {format(new Date(bike.rentals[0].startDate), 'dd MMM', { locale: es })} - {format(new Date(bike.rentals[0].endDate), 'dd MMM yyyy', { locale: es })}
                      </p>
                    </div>
                  )}
                  {bike.type === 'sale' && bike.salePrice && (
                    <p className="text-green-400 text-sm mt-1">${bike.salePrice} AUD</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(bike)}
                    className="flex-1 sm:flex-none px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm active:scale-[0.98]"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(bike)}
                    className="flex-1 sm:flex-none px-3 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors text-sm active:scale-[0.98]"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
