import { statAccents } from "../../constants"
import { btnPrimary, btnSecondary, cardBase } from "../primitives/ui"

export function OverviewTab({
  stats,
  onManageCollections,
  onSiteSettings,
  onHistory,
  isViewer,
}: {
  stats: [string, number][]
  onManageCollections: () => void
  onSiteSettings: () => void
  onHistory: () => void
  isViewer: boolean
}) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map(([label, value], index) => (
        <div key={label} className={`relative overflow-hidden p-5 ${cardBase}`}>
          <span
            className="absolute inset-y-0 left-0 w-1"
            style={{ backgroundColor: statAccents[index % statAccents.length] }}
          />
          <p className="text-sm text-[#474747]">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-[#1d1d1f]">{value}</p>
          <p className="mt-1 text-xs text-[#707070]">Éléments administrables</p>
        </div>
      ))}
      <div className={`p-5 sm:col-span-2 xl:col-span-3 ${cardBase}`}>
        <h3 className="text-sm font-semibold text-[#1d1d1f]">Raccourcis</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={onManageCollections} className={btnPrimary}>
            Gérer les collections
          </button>
          <button type="button" onClick={onSiteSettings} className={btnSecondary}>
            Paramètres site
          </button>
          <button type="button" onClick={onHistory} className={btnSecondary}>
            Voir l'historique
          </button>
        </div>
        {isViewer && (
          <p className="mt-3 text-xs text-[#b64400]">
            Viewer : vous pouvez consulter les collections et l'historique, mais pas modifier.
          </p>
        )}
      </div>
    </section>
  )
}
