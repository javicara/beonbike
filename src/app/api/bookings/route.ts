import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { fullName, documentId, address, email, startDate, endDate, weeks, bikeType } = body

    // Validaciones básicas
    if (!fullName || !documentId || !address || !email || !startDate || !endDate || !weeks) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    // Validar mínimo de semanas
    if (weeks < 2) {
      return NextResponse.json(
        { error: 'El mínimo de renta es 2 semanas' },
        { status: 400 }
      )
    }

    // Crear la reserva en la base de datos
    const booking = await prisma.rentalBooking.create({
      data: {
        fullName,
        documentId,
        address,
        email,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        weeks,
        bikeType: bikeType || 'backpacker',
        status: 'pending',
      },
    })

    // Formatear fechas para el email
    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const totalPrice = weeks * 70

    // Enviar email de notificación al negocio
    await resend.emails.send({
      from: 'Be On Bikes <reservas@beonbikes.com>',
      to: ['javicaraballo1@gmail.com'],
      subject: `Nueva Reserva Backpacker - ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ea580c, #f59e0b); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Nueva Reserva E-Bike</h1>
          </div>

          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #1e293b; margin-top: 0;">Datos del Cliente</h2>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Nombre:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">DNI/Pasaporte:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${documentId}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Domicilio:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${address}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #1e293b;"><a href="mailto:${email}">${email}</a></td>
              </tr>
            </table>

            <h2 style="color: #1e293b; margin-top: 30px;">Detalles de la Reserva</h2>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Fecha Inicio:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${formatDate(startDate)}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Fecha Fin:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${formatDate(endDate)}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Semanas:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${weeks} semanas</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Total:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #ea580c; font-weight: bold; font-size: 18px;">$${totalPrice} AUD</td>
              </tr>
            </table>

            <div style="margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 8px;">
              <p style="margin: 0; color: #92400e; font-weight: bold;">Bond requerido: $${70 * 2} AUD (2 semanas)</p>
            </div>
          </div>

          <div style="padding: 20px; background: #1e293b; text-align: center;">
            <p style="color: #94a3b8; margin: 0; font-size: 12px;">
              ID de Reserva: ${booking.id}
            </p>
          </div>
        </div>
      `,
    })

    // Enviar email de confirmación al cliente
    await resend.emails.send({
      from: 'Be On Bikes <reservas@beonbikes.com>',
      to: [email],
      subject: 'Confirmación de Reserva - Be On Bikes',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ea580c, #f59e0b); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">¡Gracias por tu reserva!</h1>
          </div>

          <div style="padding: 30px; background: #f8fafc;">
            <p style="color: #1e293b; font-size: 16px;">Hola <strong>${fullName}</strong>,</p>

            <p style="color: #64748b; line-height: 1.6;">
              Hemos recibido tu reserva de E-Bike. Te contactaremos pronto por WhatsApp o email para confirmar los detalles y coordinar la entrega.
            </p>

            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
              <h3 style="color: #1e293b; margin-top: 0;">Resumen de tu Reserva</h3>
              <p style="color: #64748b; margin: 5px 0;"><strong>Desde:</strong> ${formatDate(startDate)}</p>
              <p style="color: #64748b; margin: 5px 0;"><strong>Hasta:</strong> ${formatDate(endDate)}</p>
              <p style="color: #64748b; margin: 5px 0;"><strong>Duracion:</strong> ${weeks} semanas</p>
              <p style="color: #ea580c; margin: 5px 0; font-size: 20px;"><strong>Total: $${totalPrice} AUD</strong></p>
            </div>

            <div style="background: #fef3c7; padding: 15px; border-radius: 8px;">
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                <strong>Recuerda:</strong> Al momento de la entrega necesitaras un bond de $${70 * 2} AUD (2 semanas) que se devuelve al finalizar el alquiler.
              </p>
            </div>

            <p style="color: #64748b; margin-top: 20px; line-height: 1.6;">
              Si tienes alguna pregunta, contactanos por WhatsApp al <strong>0403 460 777</strong>.
            </p>
          </div>

          <div style="padding: 20px; background: #1e293b; text-align: center;">
            <p style="color: white; margin: 0 0 10px 0; font-weight: bold;">Be On Bikes</p>
            <p style="color: #94a3b8; margin: 0; font-size: 12px;">
              Sunshine Coast, QLD | info@beonbikes.com
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Reserva creada exitosamente',
        bookingId: booking.id
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const bookings = await prisma.rentalBooking.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
