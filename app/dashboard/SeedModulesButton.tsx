"use client";

import { useState } from "react";
import { seedModules } from "@/app/actions/setup";

export function SeedModulesButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSeed = async () => {
    setLoading(true);
    setError(null);
    try {
      await seedModules();
    } catch (e: any) {
      setError(e.message ?? "Erro desconhecido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleSeed}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-700 hover:bg-amber-800 active:scale-[0.98] text-white text-sm font-medium rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed self-start"
      >
        {loading ? (
          <>
            <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Configurando...
          </>
        ) : (
          "Configurar 13 módulos do currículo"
        )}
      </button>
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
