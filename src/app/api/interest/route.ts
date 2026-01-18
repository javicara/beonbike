import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// POST - Register interest
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, hasWhatsapp, desiredStartDate, desiredWeeks, notes, lang } = body;

    // Validation
    if (!fullName || !email) {
      return NextResponse.json(
        { error: 'fullName and email are required' },
        { status: 400 }
      );
    }

    // Create interest registration
    const interest = await prisma.interestRegistration.create({
      data: {
        fullName,
        email,
        phone: phone || null,
        hasWhatsapp: hasWhatsapp || false,
        desiredStartDate: desiredStartDate ? new Date(desiredStartDate) : null,
        desiredWeeks: desiredWeeks || null,
        notes: notes || null,
        status: 'pending',
      },
    });

    // Send notification email to admin
    try {
      await resend.emails.send({
        from: 'Be On Bikes <reservas@beonbikes.com>',
        to: ['beonbikesaustralia@gmail.com'],
        subject: `Nueva Lista de Espera - ${fullName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ea580c;">Nuevo Interesado en Lista de Espera</h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
              <p><strong>Nombre:</strong> ${fullName}</p>
              <p><strong>Email:</strong> ${email}</p>
              ${phone ? `<p><strong>Telefono:</strong> ${phone} ${hasWhatsapp ? '(WhatsApp)' : ''}</p>` : ''}
              ${desiredStartDate ? `<p><strong>Fecha deseada:</strong> ${new Date(desiredStartDate).toLocaleDateString('es-ES')}</p>` : ''}
              ${desiredWeeks ? `<p><strong>Semanas:</strong> ${desiredWeeks}</p>` : ''}
              ${notes ? `<p><strong>Notas:</strong> ${notes}</p>` : ''}
            </div>
            <p style="color: #64748b; font-size: 12px; margin-top: 20px;">
              Esta persona se registró porque no había bicis disponibles para sus fechas.
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Error sending admin notification:', emailError);
      // Don't fail the request if email fails
    }

    // Send confirmation to user
    const isSpanish = lang === 'es';
    try {
      await resend.emails.send({
        from: 'Be On Bikes <reservas@beonbikes.com>',
        to: [email],
        subject: isSpanish
          ? 'Te avisaremos cuando haya disponibilidad - Be On Bikes'
          : 'We\'ll notify you when available - Be On Bikes',
        html: isSpanish ? `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ea580c;">Hola ${fullName}!</h2>
            <p>Gracias por tu interes en alquilar una e-bike con Be On Bikes.</p>
            <p>Lamentablemente no tenemos bicis disponibles para las fechas que seleccionaste, pero te hemos agregado a nuestra lista de espera.</p>
            <p><strong>Te contactaremos en cuanto haya disponibilidad!</strong></p>
            <div style="background: #fff7ed; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; color: #ea580c;"><strong>Mientras tanto...</strong></p>
              <p style="margin: 5px 0 0 0;">Si tienes alguna pregunta, escribenos a beonbikesaustralia@gmail.com</p>
            </div>
          </div>
        ` : `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ea580c;">Hi ${fullName}!</h2>
            <p>Thanks for your interest in renting an e-bike with Be On Bikes.</p>
            <p>Unfortunately we don't have bikes available for your selected dates, but we've added you to our waiting list.</p>
            <p><strong>We'll contact you as soon as there's availability!</strong></p>
            <div style="background: #fff7ed; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; color: #ea580c;"><strong>In the meantime...</strong></p>
              <p style="margin: 5px 0 0 0;">If you have any questions, email us at beonbikesaustralia@gmail.com</p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Error sending user confirmation:', emailError);
    }

    return NextResponse.json(interest, { status: 201 });
  } catch (error) {
    console.error('Error creating interest registration:', error);
    return NextResponse.json(
      { error: 'Error creating interest registration' },
      { status: 500 }
    );
  }
}
