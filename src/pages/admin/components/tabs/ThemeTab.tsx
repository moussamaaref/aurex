import type { ThemeState } from "../../constants"
import { SectionHeading, btnPrimary, cardBase, inputBase } from "../primitives/ui"

export function ThemeTab({
  theme,
  onThemeChange,
  onSave,
  isViewer,
}: {
  theme: ThemeState
  onThemeChange: (theme: ThemeState) => void
  onSave: () => void
  isViewer: boolean
}) {
  return (
    <section className={`p-6 ${cardBase}`}>
      <SectionHeading
        title="Thème global"
        description="Personnalisez les couleurs primaires utilisées par le front."
      />
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {(["primary", "accent", "surface"] as const).map((key) => (
          <label key={key} className="text-sm font-semibold capitalize text-[#12233F]">
            {key}
            <div className="mt-2 flex gap-2">
              <input
                type="color"
                value={theme[key]}
                onChange={(e) => onThemeChange({ ...theme, [key]: e.target.value })}
                disabled={isViewer}
                className="h-11 w-14 rounded-lg border border-[#E4DFD2] p-1 disabled:opacity-50"
              />
              <input
                value={theme[key]}
                onChange={(e) => onThemeChange({ ...theme, [key]: e.target.value })}
                disabled={isViewer}
                className={`min-w-0 flex-1 uppercase ${inputBase}`}
              />
            </div>
          </label>
        ))}
      </div>
      <button type="button" onClick={onSave} disabled={isViewer} className={`mt-6 ${btnPrimary}`}>
        Enregistrer le thème
      </button>
    </section>
  )
}
