import type { RefObject } from "react"
import type { SeedResult } from "../../../../lib/contentStore"
import { SectionHeading, btnPrimary, btnSecondary, cardBase } from "../primitives/ui"

export function BackupTab({
  onExport,
  onImportFile,
  fileInputRef,
  onSeed,
  seedBusy,
  seedResults,
  canEdit,
}: {
  onExport: () => void
  onImportFile: (file: File) => void
  fileInputRef: RefObject<HTMLInputElement | null>
  onSeed: () => void
  seedBusy: boolean
  seedResults: SeedResult[] | null
  canEdit: boolean
}) {
  return (
    <section className={`p-6 ${cardBase}`}>
      <SectionHeading
        title="Sauvegarde des données"
        description="Exportez toutes les données de l'application ou restaurez une sauvegarde JSON. Peuplez aussi les tables normalisées."
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={onExport} className={btnPrimary}>
          Exporter toute l'application
        </button>
        <button type="button" onClick={() => fileInputRef.current?.click()} className={btnSecondary}>
          Importer une sauvegarde
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          hidden
          onChange={(e) => e.target.files?.[0] && onImportFile(e.target.files[0])}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-[#E4DFD2] bg-[#FBFAF6] p-5">
        <h3 className="text-sm font-semibold text-[#12233F]">Peupler les tables normalisées</h3>
        <p className="mt-1 text-xs text-[#8A8474]">
          Utilise seedNormalizedTables pour insérer les catégories, produits, technologies,
          actualités et paramètres par défaut (idempotent).
        </p>
        <button
          type="button"
          onClick={onSeed}
          disabled={!canEdit || seedBusy}
          className="mt-3 rounded-xl bg-[#1F8A5F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1B7952] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {seedBusy ? "Seed en cours..." : "Lancer le seed"}
        </button>
        {seedResults && (
          <div className="mt-4 overflow-auto rounded-xl border border-[#E4DFD2] bg-white p-3">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[#9A9585]">
                  <th className="py-1.5">Table</th>
                  <th className="py-1.5">Insérés</th>
                  <th className="py-1.5">Erreur</th>
                </tr>
              </thead>
              <tbody>
                {seedResults.map((r) => (
                  <tr key={r.table} className="border-t border-[#E4DFD2]">
                    <td className="py-1.5 font-semibold text-[#12233F]">{r.table}</td>
                    <td className="py-1.5">{r.inserted}</td>
                    <td className="py-1.5 text-[#C1443D]">{r.error ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-5 rounded-xl bg-[#FBF3E3] p-4 text-xs leading-relaxed text-[#8A672E]">
        Après un import, un seed ou une modification de collection, rechargez les pages publiques
        pour charger les nouvelles données.
      </p>
    </section>
  )
}
