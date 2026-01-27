"use client";

import { useState } from "react";

interface PriceSetting {
  key: string;
  label: string;
  description: string;
  value: string;
  defaultValue: string;
  id?: string;
}

interface PriceSettingsProps {
  initialSettings: PriceSetting[];
}

export default function PriceSettings({ initialSettings }: PriceSettingsProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value } : s))
    );
  };

  const handleSave = async (setting: PriceSetting) => {
    setSaving(setting.key);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: setting.key,
          value: setting.value,
          description: setting.description,
        }),
      });

      if (response.ok) {
        setSaved(setting.key);
        setTimeout(() => setSaved(null), 2000);
      }
    } catch (error) {
      console.error("Error saving setting:", error);
    } finally {
      setSaving(null);
    }
  };

  const handleSaveAll = async () => {
    setSaving("all");
    try {
      for (const setting of settings) {
        await fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: setting.key,
            value: setting.value,
            description: setting.description,
          }),
        });
      }
      setSaved("all");
      setTimeout(() => setSaved(null), 2000);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-700">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            Precios de Alquiler
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Los precios están en AUD (Dólares Australianos)
          </p>
        </div>

        <div className="divide-y divide-slate-700">
          {settings.map((setting) => (
            <div
              key={setting.key}
              className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
            >
              <div className="flex-1">
                <label className="block text-white font-medium text-sm sm:text-base">
                  {setting.label}
                </label>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                  {setting.description}
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative flex-1 sm:flex-none">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    value={setting.value}
                    onChange={(e) => handleChange(setting.key, e.target.value)}
                    className="w-full sm:w-32 pl-7 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-right focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <button
                  onClick={() => handleSave(setting)}
                  disabled={saving === setting.key}
                  className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-colors flex-shrink-0 active:scale-[0.98] ${
                    saved === setting.key
                      ? "bg-green-500/10 text-green-500"
                      : "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
                  } disabled:opacity-50`}
                >
                  {saving === setting.key ? (
                    <svg
                      className="w-5 h-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : saved === setting.key ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    "Guardar"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveAll}
          disabled={saving === "all"}
          className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-colors active:scale-[0.98] ${
            saved === "all"
              ? "bg-green-500 text-white"
              : "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
          } disabled:opacity-50`}
        >
          {saving === "all" ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Guardando...
            </span>
          ) : saved === "all" ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Guardado
            </span>
          ) : (
            "Guardar Todos"
          )}
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 sm:p-6">
        <div className="flex gap-3 sm:gap-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-blue-400 font-medium text-sm sm:text-base">
              Sobre los precios dinámicos
            </h3>
            <p className="text-blue-300/70 text-xs sm:text-sm mt-1">
              Los cambios en los precios se aplicarán a las nuevas reservas. Las
              reservas existentes mantendrán el precio original. El bond se
              calcula automáticamente multiplicando el precio semanal por el
              número de semanas configurado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
