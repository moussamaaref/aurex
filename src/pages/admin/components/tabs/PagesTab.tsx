import type { PagesState } from "../../constants"
import { SectionHeading, btnPrimary, cardBase, inputBase } from "../primitives/ui"

export function PagesTab({
  pages,
  onPagesChange,
  onSave,
  isViewer,
}: {
  pages: PagesState
  onPagesChange: (pages: PagesState) => void
  onSave: () => void
  isViewer: boolean
}) {
  return (
    <section className={`p-6 ${cardBase}`}>
      <SectionHeading
        title="Pages, contenu et SEO"
        description="Titres et descriptions SEO (prioritaires sur les valeurs par défaut du site) et coordonnées de contact. Les textes éditoriaux des pages sont gérés dans le contenu du site (website brief 2026)."
      />
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold text-[#1d1d1f]">
          Titre accueil
          <input
            value={pages.home.title}
            onChange={(e) => onPagesChange({ ...pages, home: { ...pages.home, title: e.target.value } })}
            disabled={isViewer}
            className={`mt-2 ${inputBase}`}
          />
        </label>
        <label className="text-sm font-semibold text-[#1d1d1f]">
          Email contact
          <input
            value={pages.contact.email}
            onChange={(e) =>
              onPagesChange({ ...pages, contact: { ...pages.contact, email: e.target.value } })
            }
            disabled={isViewer}
            className={`mt-2 ${inputBase}`}
          />
        </label>
        <label className="text-sm font-semibold text-[#1d1d1f] sm:col-span-2">
          Description accueil
          <textarea
            value={pages.home.description}
            onChange={(e) =>
              onPagesChange({ ...pages, home: { ...pages.home, description: e.target.value } })
            }
            rows={4}
            disabled={isViewer}
            className={`mt-2 ${inputBase}`}
          />
        </label>
        <label className="text-sm font-semibold text-[#1d1d1f]">
          Téléphone
          <input
            value={pages.contact.phone}
            onChange={(e) =>
              onPagesChange({ ...pages, contact: { ...pages.contact, phone: e.target.value } })
            }
            disabled={isViewer}
            className={`mt-2 ${inputBase}`}
          />
        </label>
        <label className="text-sm font-semibold text-[#1d1d1f]">
          Adresse
          <input
            value={pages.contact.address}
            onChange={(e) =>
              onPagesChange({ ...pages, contact: { ...pages.contact, address: e.target.value } })
            }
            disabled={isViewer}
            className={`mt-2 ${inputBase}`}
          />
        </label>
        <label className="text-sm font-semibold text-[#1d1d1f]">
          Titre SEO
          <input
            value={pages.seo.title}
            onChange={(e) => onPagesChange({ ...pages, seo: { ...pages.seo, title: e.target.value } })}
            disabled={isViewer}
            className={`mt-2 ${inputBase}`}
          />
        </label>
        <label className="text-sm font-semibold text-[#1d1d1f]">
          Mots-clés SEO
          <input
            value={pages.seo.keywords}
            onChange={(e) =>
              onPagesChange({ ...pages, seo: { ...pages.seo, keywords: e.target.value } })
            }
            disabled={isViewer}
            className={`mt-2 ${inputBase}`}
          />
        </label>
        <label className="text-sm font-semibold text-[#1d1d1f] sm:col-span-2">
          Description SEO
          <textarea
            value={pages.seo.description}
            onChange={(e) =>
              onPagesChange({ ...pages, seo: { ...pages.seo, description: e.target.value } })
            }
            rows={3}
            disabled={isViewer}
            className={`mt-2 ${inputBase}`}
          />
        </label>
      </div>
      <button type="button" onClick={onSave} disabled={isViewer} className={`mt-6 ${btnPrimary}`}>
        Enregistrer les pages
      </button>
    </section>
  )
}
