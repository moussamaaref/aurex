import type { SiteSettings } from "../../../../lib/contentStore"
import { SingleImageField } from "../fields/fields"
import { SectionHeading, btnPrimary, cardBase, inputBase } from "../primitives/ui"

export function SiteTab({
  siteSettings,
  onSiteChange,
  onSave,
  siteSaving,
  isViewer,
}: {
  siteSettings: SiteSettings | null
  onSiteChange: (settings: SiteSettings) => void
  onSave: () => void
  siteSaving: boolean
  isViewer: boolean
}) {
  return (
    <section className={`p-6 ${cardBase}`}>
      <SectionHeading
        title="Site & Marque"
        description="Logo, favicon, couleurs, contacts et réseaux sociaux. Stocké dans site_settings."
      />
      {!siteSettings ? (
        <p className="mt-6 text-sm text-[#8A8474]">Chargement...</p>
      ) : (
        <>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-[#12233F]">Logo (upload vers aurex-media)</p>
              <div className="mt-2">
                <SingleImageField
                  value={siteSettings.logoUrl ?? ""}
                  onChange={(v) => onSiteChange({ ...siteSettings, logoUrl: v || null })}
                  disabled={isViewer}
                />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#12233F]">Favicon</p>
              <div className="mt-2">
                <SingleImageField
                  value={siteSettings.faviconUrl ?? ""}
                  onChange={(v) => onSiteChange({ ...siteSettings, faviconUrl: v || null })}
                  disabled={isViewer}
                />
              </div>
            </div>
            <label className="text-sm font-semibold text-[#12233F]">
              Texte logo
              <input
                value={siteSettings.logoText}
                onChange={(e) => onSiteChange({ ...siteSettings, logoText: e.target.value })}
                disabled={isViewer}
                className={`mt-2 ${inputBase}`}
              />
            </label>
            <label className="text-sm font-semibold text-[#12233F]">
              Couleur texte logo
              <div className="mt-2 flex gap-2">
                <input
                  type="color"
                  value={siteSettings.logoTextColor}
                  onChange={(e) => onSiteChange({ ...siteSettings, logoTextColor: e.target.value })}
                  disabled={isViewer}
                  className="h-11 w-14 rounded-lg border border-[#E4DFD2] p-1 disabled:opacity-50"
                />
                <input
                  value={siteSettings.logoTextColor}
                  onChange={(e) => onSiteChange({ ...siteSettings, logoTextColor: e.target.value })}
                  disabled={isViewer}
                  className={`min-w-0 flex-1 uppercase ${inputBase}`}
                />
              </div>
            </label>
            <label className="text-sm font-semibold text-[#12233F]">
              Fond icône logo
              <div className="mt-2 flex gap-2">
                <input
                  type="color"
                  value={siteSettings.logoIconBg.startsWith("var(") ? "#008ED0" : siteSettings.logoIconBg}
                  onChange={(e) => onSiteChange({ ...siteSettings, logoIconBg: e.target.value })}
                  disabled={isViewer}
                  className="h-11 w-14 rounded-lg border border-[#E4DFD2] p-1 disabled:opacity-50"
                />
                <input
                  value={siteSettings.logoIconBg}
                  onChange={(e) => onSiteChange({ ...siteSettings, logoIconBg: e.target.value })}
                  disabled={isViewer}
                  className={`min-w-0 flex-1 ${inputBase}`}
                  placeholder="var(--color-primary) ou #008ED0"
                />
              </div>
            </label>
            <label className="text-sm font-semibold text-[#12233F]">
              Accent icône logo
              <div className="mt-2 flex gap-2">
                <input
                  type="color"
                  value={siteSettings.logoAccent.startsWith("var(") ? "#0077B6" : siteSettings.logoAccent}
                  onChange={(e) => onSiteChange({ ...siteSettings, logoAccent: e.target.value })}
                  disabled={isViewer}
                  className="h-11 w-14 rounded-lg border border-[#E4DFD2] p-1 disabled:opacity-50"
                />
                <input
                  value={siteSettings.logoAccent}
                  onChange={(e) => onSiteChange({ ...siteSettings, logoAccent: e.target.value })}
                  disabled={isViewer}
                  className={`min-w-0 flex-1 ${inputBase}`}
                  placeholder="var(--color-accent) ou #0077B6"
                />
              </div>
            </label>
            <div className="flex flex-col gap-2 rounded-xl border border-[#E4DFD2] bg-[#FBFAF6] p-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-[#12233F]">
                <input
                  type="checkbox"
                  checked={siteSettings.showLogoIcon}
                  onChange={(e) => onSiteChange({ ...siteSettings, showLogoIcon: e.target.checked })}
                  disabled={isViewer}
                />
                Afficher icône logo (carré 4 cases)
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#12233F]">
                <input
                  type="checkbox"
                  checked={siteSettings.showLogoImage}
                  onChange={(e) => onSiteChange({ ...siteSettings, showLogoImage: e.target.checked })}
                  disabled={isViewer}
                />
                Afficher image logo
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#12233F]">
                <input
                  type="checkbox"
                  checked={siteSettings.showLogoText}
                  onChange={(e) => onSiteChange({ ...siteSettings, showLogoText: e.target.checked })}
                  disabled={isViewer}
                />
                Afficher texte logo
              </label>
            </div>
            <label className="text-sm font-semibold text-[#12233F]">
              Couleur primaire
              <div className="mt-2 flex gap-2">
                <input
                  type="color"
                  value={siteSettings.primaryColor}
                  onChange={(e) => onSiteChange({ ...siteSettings, primaryColor: e.target.value })}
                  disabled={isViewer}
                  className="h-11 w-14 rounded-lg border border-[#E4DFD2] p-1 disabled:opacity-50"
                />
                <input
                  value={siteSettings.primaryColor}
                  onChange={(e) => onSiteChange({ ...siteSettings, primaryColor: e.target.value })}
                  disabled={isViewer}
                  className={`min-w-0 flex-1 uppercase ${inputBase}`}
                />
              </div>
            </label>
            <label className="text-sm font-semibold text-[#12233F]">
              Couleur accent
              <div className="mt-2 flex gap-2">
                <input
                  type="color"
                  value={siteSettings.accentColor}
                  onChange={(e) => onSiteChange({ ...siteSettings, accentColor: e.target.value })}
                  disabled={isViewer}
                  className="h-11 w-14 rounded-lg border border-[#E4DFD2] p-1 disabled:opacity-50"
                />
                <input
                  value={siteSettings.accentColor}
                  onChange={(e) => onSiteChange({ ...siteSettings, accentColor: e.target.value })}
                  disabled={isViewer}
                  className={`min-w-0 flex-1 uppercase ${inputBase}`}
                />
              </div>
            </label>
            <label className="text-sm font-semibold text-[#12233F]">
              Couleur surface
              <div className="mt-2 flex gap-2">
                <input
                  type="color"
                  value={siteSettings.surfaceColor}
                  onChange={(e) => onSiteChange({ ...siteSettings, surfaceColor: e.target.value })}
                  disabled={isViewer}
                  className="h-11 w-14 rounded-lg border border-[#E4DFD2] p-1 disabled:opacity-50"
                />
                <input
                  value={siteSettings.surfaceColor}
                  onChange={(e) => onSiteChange({ ...siteSettings, surfaceColor: e.target.value })}
                  disabled={isViewer}
                  className={`min-w-0 flex-1 uppercase ${inputBase}`}
                />
              </div>
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-[#E4DFD2] bg-[#FBFAF6] px-4 py-3 text-sm font-semibold text-[#12233F]">
              <input
                type="checkbox"
                checked={siteSettings.maintenanceMode}
                onChange={(e) => onSiteChange({ ...siteSettings, maintenanceMode: e.target.checked })}
                disabled={isViewer}
              />
              Mode maintenance
            </label>
            <label className="text-sm font-semibold text-[#12233F]">
              Email contact
              <input
                value={siteSettings.contactEmail ?? ""}
                onChange={(e) => onSiteChange({ ...siteSettings, contactEmail: e.target.value })}
                disabled={isViewer}
                className={`mt-2 ${inputBase}`}
              />
            </label>
            <label className="text-sm font-semibold text-[#12233F]">
              Téléphone contact
              <input
                value={siteSettings.contactPhone ?? ""}
                onChange={(e) => onSiteChange({ ...siteSettings, contactPhone: e.target.value })}
                disabled={isViewer}
                className={`mt-2 ${inputBase}`}
              />
            </label>
            <label className="text-sm font-semibold text-[#12233F] sm:col-span-2">
              Adresse
              <input
                value={siteSettings.contactAddress ?? ""}
                onChange={(e) => onSiteChange({ ...siteSettings, contactAddress: e.target.value })}
                disabled={isViewer}
                className={`mt-2 ${inputBase}`}
              />
            </label>
          </div>

          <div className="mt-6 rounded-2xl border border-[#E4DFD2] bg-[#FBFAF6] p-4">
            <h3 className="text-sm font-semibold text-[#12233F]">Réseaux sociaux</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {["facebook", "instagram", "linkedin", "youtube", "twitter", "tiktok"].map((k) => (
                <label key={k} className="text-xs font-semibold capitalize text-[#4A4438]">
                  {k}
                  <input
                    value={siteSettings.socialLinks[k] ?? ""}
                    onChange={(e) =>
                      onSiteChange({
                        ...siteSettings,
                        socialLinks: { ...siteSettings.socialLinks, [k]: e.target.value },
                      })
                    }
                    placeholder={`https://${k}.com/aurex`}
                    disabled={isViewer}
                    className={`mt-1 ${inputBase}`}
                  />
                </label>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onSave}
            disabled={isViewer || siteSaving}
            className={`mt-6 ${btnPrimary}`}
          >
            {siteSaving ? "Enregistrement..." : "Enregistrer le site"}
          </button>
        </>
      )}
    </section>
  )
}
