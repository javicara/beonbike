import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import PriceSettings from "@/components/admin/PriceSettings";

const defaultPrices = [
  {
    key: "backpacker_weekly",
    label: "Precio Semanal",
    description: "Precio actual por semana (se muestra en la página principal)",
    defaultValue: "70",
  },
  {
    key: "backpacker_weekly_original",
    label: "Precio Original (tachado)",
    description: "Precio original mostrado tachado en la oferta",
    defaultValue: "90",
  },
  {
    key: "min_weeks",
    label: "Mínimo de semanas",
    description: "Número mínimo de semanas para alquilar",
    defaultValue: "2",
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
