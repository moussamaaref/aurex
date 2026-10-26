import { useMemo, useState } from "react"
import {
  GROUPS,
  fieldLabel,
  getLeaves,
  sectionOf,
  type Lang3,
  type Leaf,
  type Overrides,
} from "../../../../content/registry"
import { SectionHeading, btnGhostSmall, btnPrimary, btnSecondary, cardBase, inputBase } from "../primitives/ui"

const LANG_LABEL: Record<Lang3, string> = { fr: "Français", en: "English", ar: "العربية" }
const LANGS: Lang3[] = ["fr", "en", "ar"]

type L3Value = Partial<Record<Lang3, string | string[]>>

const toText = (v: string | string[] | undefined) => (Array.isArray(v) ? v.join("\n") : (v ?? ""))
const sameText = (a: string | string[] | undefined, b: string | string[] | undefined) => toText(a) === toText(b)

/** Éditeur de TOUS les contenus éditoriaux du site (textes FR/EN/AR, images, liens). */
export function ContentTab({
  overrides,
  onChange,
  onSave,
  saving,
  isViewer,
}: {
  overrides: Overrides
  onChange: (next: Overrides) => void
  onSave: () => void
  saving: boolean
  isViewer: boolean
}) {
  const leaves = useMemo(() => getLeaves(), [])
  const [groupId, setGroupId] = useState(GROUPS[0].id)
  const [query, setQuery] = useState("")

  const countByGroup = useMemo(() => {
    const m: Record<string, { total: number; edited: number }> = {}
    for (const l of leaves) {
      const c = (m[l.group] ??= { total: 0, edited: 0 })
      c.total += 1
      if (overrides[l.id] !== undefined) c.edited += 1
    }
    return m
  }, [leaves, overrides])

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = leaves.filter((l) => l.group === groupId)
    const filtered = q
      ? list.filter((l) => {
          const hay = `${fieldLabel(l)} ${JSON.stringify(l.defaults)} ${JSON.stringify(overrides[l.id] ?? "")}`.toLowerCase()
          return hay.includes(q)
        })
      : list
    const map = new Map<string, Leaf[]>()
    for (const l of filtered) {
      const s = sectionOf(l)
      map.set(s, [...(map.get(s) ?? []), l])
    }
    return [...map.entries()]
  }, [leaves, groupId, query, overrides])

  const setLang = (leaf: Leaf, lang: Lang3, text: string) => {
    const defaults = leaf.defaults as Record<Lang3, string | string[]>
    const current = (overrides[leaf.id] as L3Value | undefined) ?? {}
    const value: string | string[] = leaf.kind === "l3list" ? text.split("\n").map((s) => s.trim()).filter(Boolean) : text
    const next: L3Value = { ...current }
    if (sameText(value, defaults[lang])) delete next[lang]
    else next[lang] = value
    const all = { ...overrides }
    if (Object.keys(next).length === 0) delete all[leaf.id]
    else all[leaf.id] = next
    onChange(all)
  }

  const setString = (leaf: Leaf, text: string) => {
    const all = { ...overrides }
    if (text === (leaf.defaults as string) || text === "") delete all[leaf.id]
    else all[leaf.id] = text
    onChange(all)
  }

  const reset = (leaf: Leaf) => {
    const all = { ...overrides }
    delete all[leaf.id]
    onChange(all)
  }

  const totalEdited = Object.keys(overrides).length

  return (
    <section className={`p-6 ${cardBase}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionHeading
          title="Contenu du site"
          description="Tous les textes (français, anglais, arabe), images et liens des pages : accueil, À propos, Support, Smart Tech, Nouveautés, catégories, navigation, pied de page, newsletter, filtres, SEO. Un champ modifié remplace celui du code ; « Rétablir » revient à l'original."
        />
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#f0f7fb] px-3 py-1 text-xs font-semibold text-[#0077b3]">
            {totalEdited} modification{totalEdited > 1 ? "s" : ""}
          </span>
          <button type="button" onClick={onSave} disabled={isViewer || saving} className={btnPrimary}>
            {saving ? "Enregistrement…" : "Enregistrer le contenu"}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Pages" className="space-y-1">
          {GROUPS.map((g) => {
            const c = countByGroup[g.id]
            const active = g.id === groupId
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setGroupId(g.id)}
                aria-current={active}
                className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                  active ? "bg-[#1d1d1f] text-white" : "text-[#333336] hover:bg-[#f5f5f7]"
                }`}
              >
                {g.label}
                <span className={`text-[11px] ${active ? "text-white/70" : "text-[#5a5a5e]"}`}>
                  {c?.edited ? `${c.edited}/` : ""}
                  {c?.total ?? 0}
                </span>
              </button>
            )
          })}
        </nav>

        <div className="min-w-0">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un texte dans cette page…"
            className={inputBase}
            aria-label="Rechercher"
          />

          <div className="mt-4 space-y-3">
            {sections.length === 0 && <p className="text-sm text-[#5a5a5e]">Aucun champ.</p>}
            {sections.map(([title, items], index) => {
              const edited = items.filter((l) => overrides[l.id] !== undefined).length
              return (
                <details key={title} open={query !== "" || index === 0} className="rounded-2xl border border-[#d6d6d6] bg-white">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-[#1d1d1f]">
                    <span>{title}</span>
                    <span className="text-xs font-medium text-[#5a5a5e]">
                      {edited > 0 && <span className="me-2 rounded-full bg-[#f0f7fb] px-2 py-0.5 text-[#0077b3]">{edited} modifié{edited > 1 ? "s" : ""}</span>}
                      {items.length} champ{items.length > 1 ? "s" : ""}
                    </span>
                  </summary>
                  <div className="space-y-5 border-t border-[#e6e6e8] p-4">
                    {items.map((leaf) => {
                      const ov = overrides[leaf.id]
                      const modified = ov !== undefined
                      return (
                        <div key={leaf.id}>
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#5a5a5e]">{fieldLabel(leaf)}</p>
                            {modified && (
                              <button type="button" onClick={() => reset(leaf)} disabled={isViewer} className={btnGhostSmall}>
                                Rétablir
                              </button>
                            )}
                          </div>
                          {leaf.kind === "string" ? (
                            <input
                              value={typeof ov === "string" ? ov : (leaf.defaults as string)}
                              onChange={(e) => setString(leaf, e.target.value)}
                              disabled={isViewer}
                              className={inputBase}
                            />
                          ) : (
                            <div className="grid gap-3 md:grid-cols-3">
                              {LANGS.map((lang) => {
                                const defaults = leaf.defaults as Record<Lang3, string | string[]>
                                const value = ((ov as L3Value | undefined)?.[lang] ?? defaults[lang]) as string | string[]
                                const text = toText(value)
                                return (
                                  <label key={lang} className="block text-[11px] font-semibold text-[#5a5a5e]">
                                    {LANG_LABEL[lang]}
                                    <textarea
                                      value={text}
                                      dir={lang === "ar" ? "rtl" : "ltr"}
                                      rows={Math.min(8, Math.max(2, Math.ceil(text.length / 38) + (leaf.kind === "l3list" ? 1 : 0)))}
                                      onChange={(e) => setLang(leaf, lang, e.target.value)}
                                      disabled={isViewer}
                                      className={`mt-1 ${inputBase} ${
                                        (ov as L3Value | undefined)?.[lang] !== undefined ? "!border-[#0077b3]" : ""
                                      } font-normal`}
                                    />
                                  </label>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </details>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={onSave} disabled={isViewer || saving} className={btnPrimary}>
          {saving ? "Enregistrement…" : "Enregistrer le contenu"}
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Rétablir TOUS les contenus d'origine ? (non enregistré tant que vous ne cliquez pas sur Enregistrer)")) onChange({})
          }}
          disabled={isViewer || totalEdited === 0}
          className={btnSecondary}
        >
          Tout rétablir
        </button>
      </div>
    </section>
  )
}
