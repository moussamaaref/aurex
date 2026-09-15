import { useMemo } from "react"
import { collectionGroups, collectionLabels } from "../../constants"
import type { CollectionKey } from "../../types"
import { mlFr } from "../../../../lib/ml"
import { StructuredEditor, TrilingualInput } from "../fields/fields"
import { SectionHeading, btnDanger, btnGhostSmall, cardBase } from "../primitives/ui"

export function CollectionsTab({
  collections,
  activeCollection,
  onSelectCollection,
  editorItems,
  selectedItemIndex,
  onSelectItemIndex,
  onAdd,
  onDelete,
  onSave,
  editor,
  onEditorChange,
  editorRawOpen,
  onToggleRaw,
  onUpdateSelectedItem,
  canEdit,
}: {
  collections: Record<CollectionKey, unknown[]>
  activeCollection: CollectionKey
  onSelectCollection: (key: CollectionKey) => void
  editorItems: unknown[]
  selectedItemIndex: number
  onSelectItemIndex: (index: number) => void
  onAdd: () => void
  onDelete: () => void
  onSave: () => void
  editor: string
  onEditorChange: (value: string) => void
  editorRawOpen: boolean
  onToggleRaw: () => void
  onUpdateSelectedItem: (value: unknown) => void
  canEdit: boolean
}) {
  // Options dynamiques pour les listes déroulantes et suggestions
  const fieldOptions = useMemo<Record<string, string[]>>(() => {
    const asRecord = (v: unknown): Record<string, unknown> =>
      v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {}
    const cats = (collections.categories ?? []).map(asRecord)
    const slugs = cats.map((c) => String(c.slug ?? "")).filter(Boolean)
    const subcategories = [
      ...new Set(
        cats.flatMap((c) =>
          Array.isArray(c.subcategories) ? c.subcategories.map((s) => mlFr(s as string | { fr?: string })) : [],
        ),
      ),
    ].filter(Boolean)
    const techs = (collections.technologies ?? []).map(asRecord)
    const techIds = techs.map((t) => String(t.id ?? "")).filter(Boolean)
    const icons = [...new Set([...techs.map((t) => String(t.icon ?? "")).filter(Boolean), "⟳", "◈", "◇", "❄", "◉", "◌"])]
    // Hiérarchie taxonomique : slugs + cartes enfant → parent
    const fams = (collections.familles ?? []).map(asRecord)
    const sfams = (collections.sousFamilles ?? []).map(asRecord)
    const gammes = (collections.gammes ?? []).map(asRecord)
    const capacites = (collections.capacites ?? []).map(asRecord)
    const couleurs = (collections.couleurs ?? []).map(asRecord)
    const famSlugs = fams.map((f) => String(f.slug ?? "")).filter(Boolean)
    const sfamSlugs = sfams.map((s) => String(s.slug ?? "")).filter(Boolean)
    const gammeSlugs = gammes.map((g) => String(g.slug ?? "")).filter(Boolean)
    return {
      category_slug: slugs,
      famille: famSlugs,
      famille_id: famSlugs,
      sousFamille: sfamSlugs,
      sous_famille: sfamSlugs,
      sous_famille_id: sfamSlugs,
      gamme: gammeSlugs,
      gamme_id: gammeSlugs,
      capacites: capacites.map((c) => String(c.slug ?? "")).filter(Boolean),
      couleurs: couleurs.map((c) => String(c.slug ?? "")).filter(Boolean),
      subcategory: subcategories,
      technologies: techIds,
      compatibleCategories: slugs,
      compatible_categories: slugs,
      icon: icons,
    }
  }, [collections])

  // Cartes enfant → parent + libellés lisibles pour les selects dépendants
  const { taxonomyParents, optionLabels } = useMemo(() => {
    const asRecord = (v: unknown): Record<string, unknown> =>
      v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {}
    const str = (v: unknown) => String(v ?? "").toLowerCase().trim()
    const parents: Record<string, Record<string, string>> = { famille: {}, sousFamille: {}, gamme: {} }
    const labels: Record<string, Record<string, string>> = {}
    const fill = (
      items: unknown[],
      slugKey: string,
      parentKey: string | null,
      mapKey: string | null,
      labelKeys: string[],
    ) => {
      const map: Record<string, string> = {}
      for (const item of items.map(asRecord)) {
        const slug = str(item[slugKey])
        if (!slug) continue
        if (parentKey && mapKey) parents[mapKey][slug] = str(item[parentKey])
        const label = labelKeys.map((k) => mlFr(item[k] as string | { fr?: string })).find((s) => s.trim() !== "")
        if (label) map[slug] = label
      }
      return map
    }
    const catLabels = fill((collections.categories ?? []), "slug", null, null, ["label", "name"])
    labels.category_slug = catLabels
    labels.famille = fill(collections.familles ?? [], "slug", "category_slug", "famille", ["name", "label"])
    labels.famille_id = labels.famille
    labels.sousFamille = fill(collections.sousFamilles ?? [], "slug", "famille_id", "sousFamille", ["name", "label"])
    labels.sous_famille = labels.sousFamille
    labels.sous_famille_id = labels.sousFamille
    labels.gamme = fill(collections.gammes ?? [], "slug", "sous_famille_id", "gamme", ["name", "label"])
    labels.gamme_id = labels.gamme
    labels.capacites = fill(collections.capacites ?? [], "slug", null, null, ["name"])
    labels.couleurs = fill(collections.couleurs ?? [], "slug", null, null, ["name"])
    return { taxonomyParents: parents, optionLabels: labels }
  }, [collections])
  return (
    <section className={`p-6 ${cardBase}`}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <SectionHeading
          title="Données complètes"
          description="Modifiez chaque champ, uploadez les images vers aurex-media, puis enregistrez."
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onAdd}
            disabled={!canEdit}
            className="rounded-lg bg-[#1F8A5F] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#1B7952] disabled:cursor-not-allowed disabled:opacity-45"
          >
            Ajouter
          </button>
          <select
            value={selectedItemIndex}
            onChange={(event) => onSelectItemIndex(Number(event.target.value))}
            disabled={editorItems.length === 0}
            className="rounded-lg border border-[#E4DFD2] bg-white px-2 py-2 text-xs font-medium text-[#12233F] disabled:opacity-50"
          >
            {editorItems.length === 0 ? (
              <option value={0}>Aucun élément</option>
            ) : (
              editorItems.map((_item, index) => (
                <option key={index} value={index}>
                  Élément {index + 1}
                </option>
              ))
            )}
          </select>
          <button
            type="button"
            onClick={onDelete}
            disabled={editorItems.length === 0 || !canEdit}
            className={btnDanger}
          >
            Supprimer
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!canEdit}
            className="rounded-lg bg-[#2F5FE8] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#2650C6] disabled:cursor-not-allowed disabled:opacity-45"
          >
            Enregistrer
          </button>
        </div>
      </div>
      {!canEdit && (
        <p className="mt-3 text-xs font-semibold text-[#B8863D]">
          Lecture seule — viewer ne peut pas enregistrer.
        </p>
      )}
      <div className="mt-5 space-y-4">
        {collectionGroups.map((group) => (
          <div key={group.id}>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A9585]">
              {group.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.keys.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => onSelectCollection(key)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    activeCollection === key
                      ? "bg-[#0A2342] text-white"
                      : "bg-[#F7F4EC] text-[#4A4438] hover:bg-[#EFEAD8]"
                  }`}
                >
                  {collectionLabels[key]} ({(collections[key] ?? []).length})
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-2xl border border-[#E4DFD2] bg-[#FBFAF6] p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-xs text-[#8A8474]">
            Chaque enregistrement est une ligne Supabase — les champs image/images ouvrent un
            uploader vers le bucket aurex-media.
          </p>
          <button type="button" onClick={onToggleRaw} className={btnGhostSmall}>
            {editorRawOpen ? "Éditeur structuré" : "JSON brut"}
          </button>
        </div>
        {editorItems.length > 0 ? (
          editorRawOpen ? (
            <textarea
              value={editor}
              onChange={(e) => onEditorChange(e.target.value)}
              rows={18}
              disabled={!canEdit}
              className="w-full rounded-xl border border-[#E4DFD2] bg-white p-4 font-mono text-xs disabled:opacity-50"
            />
          ) : activeCollection === "marquee" ? (
            <TrilingualInput
              value={editorItems[selectedItemIndex]}
              onChange={onUpdateSelectedItem as (v: { fr: string; ar: string; en: string }) => void}
              disabled={!canEdit}
            />
          ) : (
            <StructuredEditor
              value={editorItems[selectedItemIndex]}
              onChange={onUpdateSelectedItem}
              disabled={!canEdit}
              options={fieldOptions}
              optionLabels={optionLabels}
              taxonomyParents={taxonomyParents}
            />
          )
        ) : (
          <p className="rounded-xl border border-dashed border-[#D9D2BF] p-6 text-center text-sm text-[#8A8474]">
            Aucun enregistrement. Cliquez sur Ajouter pour créer la première ligne.
          </p>
        )}
      </div>
    </section>
  )
}
