import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import PriceSettings from "@/components/admin/PriceSettings";

const defaultPrices = [
  {
    key: "backpacker_weekly",
    label: "Backpacker (Semanal)",
    description: "Precio por semana para alquiler backpacker",
    defaultValue: "70",
  },
  {
    key: "rental_hourly",
    label: "Alquiler por Hora",
    description: "Precio por hora de alquiler",
    defaultValue: "25",
  },
  {
    key: "rental_daily",
    label: "Alquiler Diario",
    description: "Precio por día de alquiler",
    defaultValue: "60",
  },
  {
    key: "rental_weekly",
    label: "Alquiler Semanal",
    description: "Precio por semana de alquiler regular",
    defaultValue: "210",
  },
  {
    key: "bond_weeks",
    label: "Bond (semanas)",
    description: "Número de semanas requeridas como depósito",
    defaultValue: "2",
  },
];

async function getSettings() {
  const settings = await prisma.settings.findMany();

  // Combinar con valores por defecto
  return defaultPrices.map((price) => {
    const setting = settings.find((s) => s.key === price.key);
    return {
      ...price,
      value: setting?.value || price.defaultValue,
      id: setting?.id,
    };
  });
}

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin/login");
  }

  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Precios</h1>
        <p className="text-slate-400 mt-1">
          Configura los precios de alquiler y servicios
        </p>
      </div>

      <PriceSettings initialSettings={settings} />
    </div>
  );
}
