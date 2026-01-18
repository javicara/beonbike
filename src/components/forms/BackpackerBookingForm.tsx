'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { format, addWeeks, differenceInWeeks, addDays, getDay, nextFriday, nextSaturday, nextDay } from 'date-fns'
import { es, enUS } from 'date-fns/locale'
import { CalendarIcon, Loader2, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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

interface InterestFormData {
  fullName: string
  email: string
  phone: string
  hasWhatsapp: boolean
  notes: string
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
    // Interest form translations
    noAvailability: 'Sin Disponibilidad',
    noAvailabilityMessage: 'Lo sentimos, no tenemos bicis disponibles para las fechas seleccionadas.',
    waitlistTitle: 'Unete a la Lista de Espera',
    waitlistDescription: 'Dejanos tus datos y te contactaremos cuando haya disponibilidad.',
    notesPlaceholder: 'Alguna nota adicional? (opcional)',
    joinWaitlist: 'Unirme a la Lista',
    waitlistSuccess: 'Te agregamos a la lista!',
    waitlistSuccessMessage: 'Te contactaremos en cuanto tengamos disponibilidad para tus fechas.',
    checkingAvailability: 'Verificando disponibilidad...',
    tryOtherDates: 'Probar otras fechas',
    startDayNote: 'El inicio debe ser Viernes, Sabado o Domingo',
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
    // Interest form translations
    noAvailability: 'No Availability',
    noAvailabilityMessage: 'Sorry, we don\'t have bikes available for your selected dates.',
    waitlistTitle: 'Join the Waiting List',
    waitlistDescription: 'Leave your details and we\'ll contact you when there\'s availability.',
    notesPlaceholder: 'Any additional notes? (optional)',
    joinWaitlist: 'Join Waiting List',
    waitlistSuccess: 'You\'re on the list!',
    waitlistSuccessMessage: 'We\'ll contact you as soon as we have availability for your dates.',
    checkingAvailability: 'Checking availability...',
    tryOtherDates: 'Try other dates',
    startDayNote: 'Start must be Friday, Saturday, or Sunday',
  },
}

// Helper to check if a day is valid start day (Friday, Saturday, Sunday)
function isValidStartDay(date: Date): boolean {
  const day = getDay(date)
  return day === 5 || day === 6 || day === 0 // Friday, Saturday, Sunday
}

// Helper to get next valid start day from a date
function getNextValidStartDay(date: Date): Date {
  const day = getDay(date)
  if (day === 5) return date // Friday
  if (day === 6) return date // Saturday
  if (day === 0) return date // Sunday
  // Find next Friday
  return nextFriday(date)
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

  const [interestData, setInterestData] = useState<InterestFormData>({
    fullName: '',
    email: '',
    phone: '',
    hasWhatsapp: true,
    notes: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Availability states
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [showInterestForm, setShowInterestForm] = useState(false)
  const [interestSubmitted, setInterestSubmitted] = useState(false)

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

  // Check availability when dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      checkAvailability()
    } else {
      setIsAvailable(null)
      setShowInterestForm(false)
    }
  }, [formData.startDate, formData.endDate])

  const checkAvailability = async () => {
    if (!formData.startDate || !formData.endDate) return

    setIsCheckingAvailability(true)
    try {
      const response = await fetch(
        `/api/availability?startDate=${formData.startDate.toISOString()}&endDate=${formData.endDate.toISOString()}`
      )
      const data = await response.json()
      setIsAvailable(data.available)
      if (!data.available) {
        setShowInterestForm(true)
        // Pre-fill interest form with booking form data
        setInterestData(prev => ({
          ...prev,
          fullName: formData.fullName || prev.fullName,
          email: formData.email || prev.email,
          phone: formData.phone || prev.phone,
          hasWhatsapp: formData.hasWhatsapp,
        }))
      } else {
        setShowInterestForm(false)
      }
    } catch {
      // If check fails, assume available
      setIsAvailable(true)
    } finally {
      setIsCheckingAvailability(false)
    }
  }

  // Calcular semanas seleccionadas
  const weeksSelected = formData.startDate && formData.endDate
    ? Math.max(differenceInWeeks(formData.endDate, formData.startDate), 0)
    : 0

  const totalPrice = weeksSelected * pricePerWeek

  // Handler para fecha de inicio - debe ser viernes, sabado o domingo
  const handleStartDateSelect = (date: Date | undefined) => {
    if (!date) return

    // Adjust to next valid start day if needed
    const validStartDate = isValidStartDay(date) ? date : getNextValidStartDay(date)

    // Calcular fecha fin mínima (2 semanas)
    const minEndDate = addWeeks(validStartDate, MINIMUM_WEEKS)

    setFormData(prev => ({
      ...prev,
      startDate: validStartDate,
      endDate: minEndDate,
    }))
  }

  // Handler para fecha de fin
  const handleEndDateSelect = (date: Date | undefined) => {
    if (!date || !formData.startDate) return

    // Calcular semanas desde el inicio
    const weeksFromStart = Math.max(
      differenceInWeeks(date, formData.startDate),
      MINIMUM_WEEKS
    )

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

  const handleInterestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!interestData.fullName || !interestData.email) {
      setError(texts.errorAllFields)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...interestData,
          desiredStartDate: formData.startDate?.toISOString(),
          desiredWeeks: weeksSelected || MINIMUM_WEEKS,
          lang: lang,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al registrar interes')
      }

      setInterestSubmitted(true)
    } catch {
      setError(texts.errorGeneric)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetToDateSelection = () => {
    setShowInterestForm(false)
    setFormData(prev => ({
      ...prev,
      startDate: undefined,
      endDate: undefined,
    }))
    setIsAvailable(null)
  }

  // Success state for booking
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

  // Success state for interest registration
  if (interestSubmitted) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 text-center">
        <Clock className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-orange-800 mb-2">{texts.waitlistSuccess}</h3>
        <p className="text-orange-700">
          {texts.waitlistSuccessMessage}
        </p>
      </div>
    )
  }

  // Interest form when no availability
  if (showInterestForm && isAvailable === false) {
    return (
      <div className="space-y-5">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800">{texts.noAvailability}</p>
            <p className="text-sm text-amber-700">{texts.noAvailabilityMessage}</p>
            {formData.startDate && formData.endDate && (
              <p className="text-xs text-amber-600 mt-1">
                {format(formData.startDate, 'dd MMM', { locale: dateLocale })} - {format(formData.endDate, 'dd MMM yyyy', { locale: dateLocale })}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="font-bold text-slate-800 mb-1">{texts.waitlistTitle}</h3>
          <p className="text-sm text-slate-500 mb-4">{texts.waitlistDescription}</p>

          <form onSubmit={handleInterestSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="interestName" className="text-sm font-bold text-slate-700">
                {texts.fullName}
              </Label>
              <Input
                id="interestName"
                type="text"
                placeholder={texts.fullNamePlaceholder}
                value={interestData.fullName}
                onChange={(e) => setInterestData(prev => ({ ...prev, fullName: e.target.value }))}
                className="h-12 text-base border-slate-200 focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestEmail" className="text-sm font-bold text-slate-700">
                {texts.email}
              </Label>
              <Input
                id="interestEmail"
                type="email"
                placeholder={texts.emailPlaceholder}
                value={interestData.email}
                onChange={(e) => setInterestData(prev => ({ ...prev, email: e.target.value }))}
                className="h-12 text-base border-slate-200 focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestPhone" className="text-sm font-bold text-slate-700">
                {texts.phone}
              </Label>
              <Input
                id="interestPhone"
                type="tel"
                placeholder={texts.phonePlaceholder}
                value={interestData.phone}
                onChange={(e) => setInterestData(prev => ({ ...prev, phone: e.target.value }))}
                className="h-12 text-base border-slate-200 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                id="interestWhatsapp"
                type="checkbox"
                checked={interestData.hasWhatsapp}
                onChange={(e) => setInterestData(prev => ({ ...prev, hasWhatsapp: e.target.checked }))}
                className="w-5 h-5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
              />
              <Label htmlFor="interestWhatsapp" className="text-sm font-medium text-slate-600 cursor-pointer">
                {texts.hasWhatsapp}
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestNotes" className="text-sm font-bold text-slate-700">
                {lang === 'es' ? 'Notas' : 'Notes'}
              </Label>
              <Textarea
                id="interestNotes"
                placeholder={texts.notesPlaceholder}
                value={interestData.notes}
                onChange={(e) => setInterestData(prev => ({ ...prev, notes: e.target.value }))}
                className="border-slate-200 focus:border-orange-500 focus:ring-orange-500"
                rows={3}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-base font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {texts.submitting}
                </>
              ) : (
                texts.joinWaitlist
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={resetToDateSelection}
              className="w-full h-10 text-sm"
            >
              {texts.tryOtherDates}
            </Button>
          </form>
        </div>
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
                disabled={(date) => {
                  // Disable past dates
                  if (date < new Date()) return true
                  // Disable days that are not Friday, Saturday, Sunday
                  const day = getDay(date)
                  return day !== 5 && day !== 6 && day !== 0
                }}
                initialFocus
              />
              <p className="text-xs text-slate-500 px-4 pb-3">{texts.startDayNote}</p>
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

      {/* Availability check indicator */}
      {isCheckingAvailability && (
        <div className="flex items-center gap-2 text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">{texts.checkingAvailability}</span>
        </div>
      )}

      {/* Resumen de semanas */}
      {weeksSelected > 0 && isAvailable !== false && (
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
        disabled={isSubmitting || weeksSelected < MINIMUM_WEEKS || isAvailable === false || isCheckingAvailability}
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
