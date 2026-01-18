'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { format, addWeeks, differenceInWeeks, startOfWeek, addDays } from 'date-fns'
import { es, enUS } from 'date-fns/locale'
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
  phone: string
  hasWhatsapp: boolean
  startDate: Date | undefined
  endDate: Date | undefined
}

interface BackpackerBookingFormProps {
  lang?: 'es' | 'en'
}

const MINIMUM_WEEKS = 2

// Translations
const t = {
  es: {
    fullName: 'Nombre Completo',
    fullNamePlaceholder: 'Juan Perez',
    documentId: 'DNI / Pasaporte',
    documentIdPlaceholder: '12345678 o AA123456',
    address: 'Domicilio en Sunshine Coast',
    addressPlaceholder: '123 Ocean St, Mooloolaba',
    email: 'Email',
    emailPlaceholder: 'tu@email.com',
    phone: 'Telefono',
    phonePlaceholder: '0412 345 678',
    hasWhatsapp: 'Tengo WhatsApp en este numero',
    from: 'Desde',
    to: 'Hasta',
    choose: 'Elegir',
    weeksSelected: 'semanas seleccionadas',
    weekSelected: 'semana seleccionada',
    submitButton: 'Reservar Ahora',
    submitting: 'Enviando...',
    bondNote: 'Bond de 2 semanas requerido al momento de la entrega',
    successTitle: 'Reserva Recibida!',
    successMessage: 'Te contactaremos por WhatsApp o email para confirmar tu reserva y coordinar la entrega.',
    weeks: 'semanas',
    errorAllFields: 'Por favor completa todos los campos',
    errorSelectDates: 'Por favor selecciona las fechas de renta',
    errorMinWeeks: `El minimo de renta es ${MINIMUM_WEEKS} semanas`,
    errorGeneric: 'Hubo un error al procesar tu reserva. Intenta nuevamente.',
  },
  en: {
    fullName: 'Full Name',
    fullNamePlaceholder: 'John Smith',
    documentId: 'ID / Passport',
    documentIdPlaceholder: '12345678 or AA123456',
    address: 'Address in Sunshine Coast',
    addressPlaceholder: '123 Ocean St, Mooloolaba',
    email: 'Email',
    emailPlaceholder: 'your@email.com',
    phone: 'Phone',
    phonePlaceholder: '0412 345 678',
    hasWhatsapp: 'I have WhatsApp on this number',
    from: 'From',
    to: 'To',
    choose: 'Select',
    weeksSelected: 'weeks selected',
    weekSelected: 'week selected',
    submitButton: 'Book Now',
    submitting: 'Sending...',
    bondNote: '2 weeks bond required at delivery',
    successTitle: 'Booking Received!',
    successMessage: 'We will contact you via WhatsApp or email to confirm your booking and arrange delivery.',
    weeks: 'weeks',
    errorAllFields: 'Please fill in all fields',
    errorSelectDates: 'Please select rental dates',
    errorMinWeeks: `Minimum rental is ${MINIMUM_WEEKS} weeks`,
    errorGeneric: 'There was an error processing your booking. Please try again.',
  },
}

export function BackpackerBookingForm({ lang = 'es' }: BackpackerBookingFormProps) {
  const texts = t[lang]
  const dateLocale = lang === 'es' ? es : enUS

  // Precios iniciales altos para que no parezca mas barato antes de cargar
  const [pricePerWeek, setPricePerWeek] = useState(85)

  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    documentId: '',
    address: '',
    email: '',
    phone: '',
    hasWhatsapp: true,
    startDate: undefined,
    endDate: undefined,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar precios de la base de datos
  useEffect(() => {
    fetch('/api/prices')
      .then(res => res.json())
      .then(data => {
        if (data.backpacker_weekly) {
          setPricePerWeek(parseInt(data.backpacker_weekly))
        }
      })
      .catch(() => {})
  }, [])

  // Calcular semanas seleccionadas
  const weeksSelected = formData.startDate && formData.endDate
    ? Math.max(differenceInWeeks(formData.endDate, formData.startDate), 0)
    : 0

  const totalPrice = weeksSelected * pricePerWeek

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
    if (!formData.fullName || !formData.documentId || !formData.address || !formData.email || !formData.phone) {
      setError(texts.errorAllFields)
      return
    }

    if (!formData.startDate || !formData.endDate) {
      setError(texts.errorSelectDates)
      return
    }

    if (weeksSelected < MINIMUM_WEEKS) {
      setError(texts.errorMinWeeks)
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
          lang: lang,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al enviar la reserva')
      }

      setIsSuccess(true)
    } catch {
      setError(texts.errorGeneric)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-800 mb-2">{texts.successTitle}</h3>
        <p className="text-green-700 mb-4">
          {texts.successMessage}
        </p>
        <p className="text-sm text-green-600">
          {weeksSelected} {texts.weeks} - ${totalPrice} AUD
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nombre Completo */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-sm font-bold text-slate-700">
          {texts.fullName}
        </Label>
        <Input
          id="fullName"
          type="text"
          placeholder={texts.fullNamePlaceholder}
          value={formData.fullName}
          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
          className="h-12 text-base border-slate-200 focus:border-orange-500 focus:ring-orange-500"
          required
        />
      </div>

      {/* DNI / Pasaporte */}
      <div className="space-y-2">
        <Label htmlFor="documentId" className="text-sm font-bold text-slate-700">
          {texts.documentId}
        </Label>
        <Input
          id="documentId"
          type="text"
          placeholder={texts.documentIdPlaceholder}
          value={formData.documentId}
          onChange={(e) => setFormData(prev => ({ ...prev, documentId: e.target.value }))}
          className="h-12 text-base border-slate-200 focus:border-orange-500 focus:ring-orange-500"
          required
        />
      </div>

      {/* Domicilio */}
      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-bold text-slate-700">
          {texts.address}
        </Label>
        <Input
          id="address"
          type="text"
          placeholder={texts.addressPlaceholder}
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          className="h-12 text-base border-slate-200 focus:border-orange-500 focus:ring-orange-500"
          required
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-bold text-slate-700">
          {texts.email}
        </Label>
        <Input
          id="email"
          type="email"
          placeholder={texts.emailPlaceholder}
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="h-12 text-base border-slate-200 focus:border-orange-500 focus:ring-orange-500"
          required
        />
      </div>

      {/* Telefono */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-bold text-slate-700">
          {texts.phone}
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder={texts.phonePlaceholder}
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          className="h-12 text-base border-slate-200 focus:border-orange-500 focus:ring-orange-500"
          required
        />
      </div>

      {/* Checkbox WhatsApp */}
      <div className="flex items-center gap-3">
        <input
          id="hasWhatsapp"
          type="checkbox"
          checked={formData.hasWhatsapp}
          onChange={(e) => setFormData(prev => ({ ...prev, hasWhatsapp: e.target.checked }))}
          className="w-5 h-5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
        />
        <Label htmlFor="hasWhatsapp" className="text-sm font-medium text-slate-600 cursor-pointer">
          {texts.hasWhatsapp}
        </Label>
      </div>

      {/* Date Pickers */}
      <div className="grid grid-cols-2 gap-4">
        {/* Fecha Inicio */}
        <div className="space-y-2">
          <Label className="text-sm font-bold text-slate-700">{texts.from}</Label>
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
                  format(formData.startDate, 'dd MMM', { locale: dateLocale })
                ) : (
                  <span>{texts.choose}</span>
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
          <Label className="text-sm font-bold text-slate-700">{texts.to}</Label>
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
                  format(formData.endDate, 'dd MMM', { locale: dateLocale })
                ) : (
                  <span>{texts.choose}</span>
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
                {weeksSelected} {weeksSelected === 1 ? texts.weekSelected : texts.weeksSelected}
              </p>
              <p className="text-xs text-orange-600">
                {formData.startDate && format(formData.startDate, 'dd MMM', { locale: dateLocale })} - {formData.endDate && format(formData.endDate, 'dd MMM yyyy', { locale: dateLocale })}
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
            {texts.submitting}
          </>
        ) : (
          texts.submitButton
        )}
      </Button>

      <p className="text-xs text-center text-slate-400">
        {texts.bondNote}
      </p>
    </form>
  )
}
