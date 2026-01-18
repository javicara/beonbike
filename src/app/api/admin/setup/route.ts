import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Este endpoint solo funciona si no hay usuarios en la base de datos
// Útil para crear el primer admin
export async function POST(request: NextRequest) {
  try {
    // Verificar si ya existe algún usuario
    const existingUsers = await prisma.user.count();

    if (existingUsers > 0) {
      return NextResponse.json(
        { error: "Ya existe un administrador. Use el panel de login." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password y name son requeridos" },
        { status: 400 }
      );
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }

    // Validar password (mínimo 8 caracteres)
    if (password.length < 8) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 8 caracteres" },
        { status: 400 }
      );
    }

    // Crear el usuario usando Better Auth
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    if (!result) {
      return NextResponse.json(
        { error: "Error al crear el usuario" },
        { status: 500 }
      );
    }

    // Actualizar el rol a admin
    await prisma.user.update({
      where: { email },
      data: { role: "admin" },
    });

    return NextResponse.json({
      success: true,
      message: "Administrador creado exitosamente",
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// Endpoint para verificar si ya hay un admin
export async function GET() {
  try {
    const existingUsers = await prisma.user.count();
    return NextResponse.json({ hasAdmin: existingUsers > 0 });
  } catch (error) {
    console.error("Error checking admin:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
