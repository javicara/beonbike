'use client'

import * as React from 'react'
import { useState } from 'react'
import { format, addWeeks, differenceInWeeks, startOfWeek, addDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon, Loader2, CheckCircle2 } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface BookingFormData {
  fullName: string
  documentId: string
  address: string
  email: string
  startDate: Date | undefined
  endDate: Date | undefined
}

const MINIMUM_WEEKS = 2
const PRICE_PER_WEEK = 70

export function BackpackerBookingForm() {
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    documentId: '',
    address: '',
    email: '',
    startDate: undefined,
    endDate: undefined,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calcular semanas seleccionadas
  const weeksSelected = formData.startDate && formData.endDate
    ? Math.max(differenceInWeeks(formData.endDate, formData.startDate), 0)
    : 0

  const totalPrice = weeksSelected * PRICE_PER_WEEK

  // Handler para fecha de inicio - siempre empieza un lunes
  const handleStartDateSelect = (date: Date | undefined) => {
    if (!date) return

    // Ajustar al lunes de esa semana
    const monday = startOfWeek(date, { weekStartsOn: 1 })

    // Calcular fecha fin mínima (2 semanas)
    const minEndDate = addWeeks(monday, MINIMUM_WEEKS)

    setFormData(prev => ({
      ...prev,
      startDate: monday,
      endDate: minEndDate,
    }))
  }

  // Handler para fecha de fin - siempre termina un domingo
  const handleEndDateSelect = (date: Date | undefined) => {
    if (!date || !formData.startDate) return

    // Calcular semanas desde el inicio
    const weeksFromStart = Math.max(
      differenceInWeeks(date, formData.startDate),
      MINIMUM_WEEKS
    )

    // La fecha de fin es el domingo de esa semana
    const endDate = addDays(addWeeks(formData.startDate, weeksFromStart), -1)

    setFormData(prev => ({
      ...prev,
      endDate: addWeeks(formData.startDate!, weeksFromStart),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validaciones
    if (!formData.fullName || !formData.documentId || !formData.address || !formData.email) {
      setError('Por favor completa todos los campos')
      return
    }

    if (!formData.startDate || !formData.endDate) {
      setError('Por favor selecciona las fechas de renta')
      return
    }

    if (weeksSelected < MINIMUM_WEEKS) {
      setError(`El minimo de renta es ${MINIMUM_WEEKS} semanas`)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          weeks: weeksSelected,
          bikeType: 'backpacker',
        }),
      })

      if (!response.ok) {
        throw new Error('Error al enviar la reserva')
      }

      setIsSuccess(true)
    } catch {
      setError('Hubo un error al procesar tu reserva. Intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-800 mb-2">Reserva Recibida!</h3>
        <p className="text-green-700 mb-4">
          Te contactaremos por WhatsApp o email para confirmar tu reserva y coordinar la entrega.
        </p>
        <p className="text-sm text-green-600">
          {weeksSelected} semanas - ${totalPrice} AUD
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nombre Completo */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-sm font-bold text-slate-700">
          Nombre Completo
        </Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Juan Perez"
          value={formData.fullName}
          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
          className="h-12 text-base border-slate-200 focus:border-orange-500 focus:ring-orange-500"
          required
        />
      </div>

      {/* DNI / Pasaporte */}
      <div className="space-y-2">
        <Label htmlFor="documentId" className="text-sm font-bold text-slate-700">
          DNI / Pasaporte
        </Label>
        <Input
          id="documentId"
          type="text"
          placeholder="12345678 o AA123456"
          value={formData.documentId}
          onChange={(e) => setFormData(prev => ({ ...prev, documentId: e.target.value }))}
          className="h-12 text-base border-slate-200 focus:border-orange-500 focus:ring-orange-500"
          required
        />
      </div>

      {/* Domicilio */}
      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-bold text-slate-700">
          Domicilio en Sunshine Coast
        </Label>
        <Input
          id="address"
          type="text"
          placeholder="123 Ocean St, Mooloolaba"
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          className="h-12 text-base border-slate-200 focus:border-orange-500 focus:ring-orange-500"
          required
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-bold text-slate-700">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="h-12 text-base border-slate-200 focus:border-orange-500 focus:ring-orange-500"
          required
        />
      </div>

      {/* Date Pickers */}
      <div className="grid grid-cols-2 gap-4">
        {/* Fecha Inicio */}
        <div className="space-y-2">
          <Label className="text-sm font-bold text-slate-700">Desde</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  'w-full h-12 justify-start text-left font-normal border-slate-200',
                  !formData.startDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate ? (
                  format(formData.startDate, 'dd MMM', { locale: es })
                ) : (
                  <span>Elegir</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={handleStartDateSelect}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Fecha Fin */}
        <div className="space-y-2">
          <Label className="text-sm font-bold text-slate-700">Hasta</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  'w-full h-12 justify-start text-left font-normal border-slate-200',
                  !formData.endDate && 'text-muted-foreground'
                )}
                disabled={!formData.startDate}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.endDate ? (
                  format(formData.endDate, 'dd MMM', { locale: es })
                ) : (
                  <span>Elegir</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.endDate}
                onSelect={handleEndDateSelect}
                disabled={(date) =>
                  !formData.startDate ||
                  date < addWeeks(formData.startDate, MINIMUM_WEEKS)
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Resumen de semanas */}
      {weeksSelected > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-orange-800">
                {weeksSelected} {weeksSelected === 1 ? 'semana' : 'semanas'} seleccionadas
              </p>
              <p className="text-xs text-orange-600">
                {formData.startDate && format(formData.startDate, 'dd MMM', { locale: es })} - {formData.endDate && format(formData.endDate, 'dd MMM yyyy', { locale: es })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-orange-600">${totalPrice}</p>
              <p className="text-xs text-orange-500">AUD</p>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || weeksSelected < MINIMUM_WEEKS}
        className="w-full h-14 text-lg font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-lg shadow-orange-200"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Enviando...
          </>
        ) : (
          'Reservar Ahora'
        )}
      </Button>

      <p className="text-xs text-center text-slate-400">
        Bond de 2 semanas requerido al momento de la entrega
      </p>
    </form>
  )
}
