# Be On Bikes - Sistema de Gestion de Alquiler de E-Bikes

Sistema de gestion para alquiler de bicicletas electricas en Sunshine Coast, Australia.

**URL**: https://beonbikes.com

## Stack Tecnologico

- **Frontend**: Next.js 16 (App Router), React 18, TypeScript
- **Estilos**: Tailwind CSS, Shadcn UI
- **Base de datos**: PostgreSQL (Neon serverless)
- **ORM**: Prisma
- **Auth**: Better Auth
- **Email**: Resend
- **Deploy**: Vercel

## Inicio Rapido

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Generar cliente Prisma y sincronizar DB
npx prisma generate
npx prisma db push

# Iniciar servidor de desarrollo
npm run dev
```

## Variables de Entorno

```env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=tu-secreto-32-chars
NEXT_PUBLIC_APP_URL=http://localhost:3000
RESEND_API_KEY=re_...
```

---

## Panel de Administracion

### Dashboard (`/admin`)

Vista general con metricas clave:

| Metrica | Descripcion |
|---------|-------------|
| Revenue Semanal | Suma de pagos recibidos esta semana |
| Deuda Total | Lo que deben todos los clientes activos |
| Bond Retenido | Bonds pagados pero no devueltos |
| Bicis Disponibles | Bicis listas para alquilar |

### Gestion de Bicis (`/admin/bikes`)

CRUD completo para el inventario:

- **Agregar bici**: Nombre, tipo (alquiler/venta), precio venta, notas
- **Estados**:
  - `available` - Lista para alquilar
  - `rented` - Actualmente alquilada
  - `maintenance` - En reparacion
  - `sold` - Vendida
- **Stats**: Contador de bicis por estado

### Gestion de Reservas (`/admin/bookings`)

Panel principal para administrar alquileres:

#### Campos de cada reserva:
- **Datos del cliente**: Nombre, documento, direccion, email, telefono, WhatsApp
- **Fechas**: Inicio, fin, semanas (editables para extensiones)
- **Bici asignada**: Dropdown para asignar bici
- **Precio acordado**: Editable (para precios especiales)
- **Contrato**: Firmado / Sin firmar
- **Bond**: No pagado / Pagado / Devuelto
- **Estado**: Pendiente / Confirmado / Cancelado

#### Gestion de pagos:
- Registrar pagos (monto, tipo, metodo)
- Ver historial de pagos
- Calculo automatico de deuda:
  ```
  Deuda = (semanas transcurridas x precio acordado) - pagos realizados
  ```

#### Crear reserva manual:
El admin puede crear reservas directamente sin que el cliente use el formulario publico.

#### Extender reservas:
Modificar fecha de fin y semanas para extensiones rapidas (+1, +2 semanas).

### Calendario (`/admin/availability`)

Vista timeline estilo Gantt:

- **Por bici**: Cada fila muestra una bici
- **Colores**: Cada bici tiene su color distintivo
- **Filtros**: Por estado (confirmado/pendiente) y por bici especifica
- **Lista de espera**: Muestra interesados cuando no hay disponibilidad

---

## Sistema de Reservas Publico

### Formulario de Reserva (Landing page)

1. Cliente selecciona fechas (solo Viernes, Sabado o Domingo para inicio)
2. Sistema verifica disponibilidad automaticamente
3. **Si hay bicis**: Muestra formulario completo de reserva
4. **Si NO hay bicis**: Muestra formulario de lista de espera

### Lista de Espera

Cuando no hay disponibilidad:
- Cliente deja sus datos basicos
- Recibe email de confirmacion
- Admin recibe notificacion
- Aparece en el calendario como "interesado"

---

## APIs

### Publicas

| Endpoint | Metodo | Descripcion |
|----------|--------|-------------|
| `/api/bookings` | POST | Crear reserva |
| `/api/prices` | GET | Obtener precios |
| `/api/availability` | GET | Verificar disponibilidad |
| `/api/interest` | POST | Registrar interes (lista espera) |

### Admin (requieren autenticacion)

| Endpoint | Metodo | Descripcion |
|----------|--------|-------------|
| `/api/admin/bikes` | GET, POST | Listar/crear bicis |
| `/api/admin/bikes/[id]` | GET, PATCH, DELETE | Gestionar bici |
| `/api/admin/bookings` | GET, POST | Listar/crear reservas |
| `/api/admin/bookings/[id]` | GET, PATCH, DELETE | Gestionar reserva |
| `/api/admin/payments` | GET, POST | Listar/crear pagos |
| `/api/admin/payments/[id]` | PATCH, DELETE | Gestionar pago |
| `/api/admin/interest/[id]` | PATCH, DELETE | Gestionar interesados |

---

## Modelos de Datos

### Bike (Bicicleta)
```
- id, name, type, status
- salePrice, notes
- createdAt, updatedAt
- rentals[] (relacion)
```

### RentalBooking (Reserva)
```
- id, bikeType, startDate, endDate, weeks
- fullName, documentId, address, email, phone, hasWhatsapp
- status, notes
- bikeId, bike (relacion)
- agreedPrice, contractStatus
- bondAmount, bondStatus
- createdBy (form/admin)
- payments[] (relacion)
```

### Payment (Pago)
```
- id, bookingId, booking (relacion)
- amount, date, type, method, notes
```

### InterestRegistration (Lista de espera)
```
- id, fullName, email, phone, hasWhatsapp
- desiredStartDate, desiredWeeks
- status, notes
```

---

## Flujo de Trabajo Tipico

```
1. Cliente reserva online
   -> Reserva creada con status "pending"

2. Admin revisa en /admin/bookings
   -> Asigna bici
   -> Ajusta precio si es necesario
   -> Confirma reserva

3. Entrega de bici
   -> Marca contrato como "signed"
   -> Marca bond como "paid"
   -> Registra primer pago si corresponde

4. Durante el alquiler
   -> Registra pagos semanales
   -> Sistema calcula deuda automaticamente
   -> Cliente puede extender (se modifican fechas)

5. Devolucion
   -> Marca bond como "returned"
   -> Cambia estado de bici a "available"
```

---

## Scripts

```bash
npm run dev      # Desarrollo
npm run build    # Build produccion
npm run start    # Iniciar produccion
npm run lint     # Linter
npx prisma studio # GUI de base de datos
```

---

## Documentacion Tecnica

Para detalles tecnicos y guias de desarrollo, ver `CLAUDE.md`.

## Soporte

- **Email**: beonbikesaustralia@gmail.com
