import { useState, useMemo, useEffect } from "react"
import { Link, Navigate, useNavigate, useParams, useSearchParams, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  categories,
  products,
  familles,
  sousFamilles,
  gammes,
  capacites,
  couleurs,
  productFamille,
  productSousFamille,
  productGamme,
  productCapacites,
  productCouleurs,
  productUrl,
  type TaxoValue,
} from "../data"
import { ml } from "../lib/ml"
import { canonicalCategory } from "../lib/taxonomy"
import { useP } from "../content/lang"
import { productsUi, usageProFirst } from "../content/products"
import CompareButton from "../components/CompareButton"
import Reveal from "../components/Reveal"
import { useCompare } from "../context/CompareContext"

const energyClasses = ["A+++", "A++", "A+", "A"]

// Couleur par catégorie (modifiable aussi depuis /admin via le champ "Couleur" des catégories)
const CATEGORY_COLORS: Record<string, string> = {
  "cuisine-encastrable": "#b64400",
  "soin-linge-entretien": "#0077b3",
  "eau-confort": "#00a1b3",
  "petit-electro-coffee": "#8668ff",
  "refrigeration-conservation": "#03873a",
}

function categoryColor(slug?: string | null, override?: string | null): string {
  if (override?.trim()) return override.trim()
  if (slug && CATEGORY_COLORS[slug]) return CATEGORY_COLORS[slug]
  return "var(--color-primary)"
}

function EnergyBadge({ cls }: { cls: string }) {
  const color =
    cls === "A+++"
      ? "bg-green-600"
      : cls === "A++"
        ? "bg-green-500"
        : cls === "A+"
          ? "bg-lime-500"
          : "bg-yellow-500"
  return (
    <span
      className={`${color} text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[10px] font-display tracking-wider shadow-sm`}
    >
      {cls}
    </span>
  )
}

/** Select générique pour un niveau de la hiérarchie (sidebar + tiroir mobile). */
function TaxoSelect({
  label,
  value,
  onChange,
  allLabel,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  allLabel: string
  options: Array<{ value: string; label: string }>
}) {
  return (
    <div className="border-t border-[#d6d6d6] pt-5">
      <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.18em] text-[#5a5a5e] font-display">
        {label}
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[10px] border border-[#d6d6d6] bg-[#f5f5f7] px-3 py-2 text-sm text-[#333336] outline-none focus:border-[var(--color-accent)]"
      >
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

/** Anciennes URLs de catégorie (lavage, cuisson…) → nouvelles catégories du brief. */
export default function ProductsPage() {
  const { category } = useParams<{ category?: string }>()
  const { search } = useLocation()
  if (category && canonicalCategory(category) !== category.toLowerCase()) {
    return <Navigate to={`/produits/${canonicalCategory(category)}${search}`} replace />
  }
  return <ProductsPageInner />
}

function ProductsPageInner() {
  const { t, i18n } = useTranslation()
  const { p } = useP()
  const navigate = useNavigate()
  const { category } = useParams<{ category?: string }>()
  const [searchParams] = useSearchParams()
  const badgeParam = (searchParams.get("badge") ?? "").toLowerCase()
  const usageParam = (searchParams.get("usage") ?? "").toLowerCase()
  const { ids, max, remove, clear } = useCompare()

  const [selectedEnergy, setSelectedEnergy] = useState<string[]>([])
  const [connectedOnly, setConnectedOnly] = useState(false)
  const [wifiOnly, setWifiOnly] = useState(false)
  const [bluetoothOnly, setBluetoothOnly] = useState(false)
  // Hiérarchie dépendante : Catégorie → Famille → Sous-famille → Gamme (+ Capacité, Couleur)
  const [selectedFamille, setSelectedFamille] = useState("")
  const [selectedSousFamille, setSelectedSousFamille] = useState("")
  const [selectedGamme, setSelectedGamme] = useState("")
  const [selectedCapacite, setSelectedCapacite] = useState("")
  const [selectedCouleur, setSelectedCouleur] = useState("")
  const [sortBy, setSortBy] = useState("relevance")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const selectedProducts = ids
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is (typeof products)[number] => product !== undefined)

  const currentCategory = category
    ? categories.find((c) => String(c.slug ?? "").toLowerCase() === String(category ?? "").toLowerCase()) ?? null
    : null

  const sortOptions = [
    { value: "relevance", label: t("products.sortBy.relevance") },
    { value: "newest", label: t("products.sortBy.newest") },
  ]

  // Options dépendantes de la hiérarchie (re-triées à chaque langue)
  const familleOptions = useMemo(() => {
    const list = category
      ? familles.filter((f) => String(f.categorySlug ?? "").toLowerCase() === category.toLowerCase())
      : [...familles]
    return [...list].sort((a, b) => ml(a.name).localeCompare(ml(b.name)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, i18n.language])

  const sousFamilleOptions = useMemo(() => {
    const list = selectedFamille
      ? sousFamilles.filter((s) => String(s.familleSlug ?? "").toLowerCase() === selectedFamille)
      : category
        ? sousFamilles.filter((s) =>
            familleOptions.some((f) => String(f.slug ?? "").toLowerCase() === String(s.familleSlug ?? "").toLowerCase()),
          )
        : [...sousFamilles]
    return [...list].sort((a, b) => ml(a.name).localeCompare(ml(b.name)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, selectedFamille, familleOptions, i18n.language])

  const gammeOptions = useMemo(() => {
    const list = selectedSousFamille
      ? gammes.filter((g) => String(g.sousFamilleSlug ?? "").toLowerCase() === selectedSousFamille)
      : selectedFamille || category
        ? gammes.filter((g) =>
            sousFamilleOptions.some((s) => String(s.slug ?? "").toLowerCase() === String(g.sousFamilleSlug ?? "").toLowerCase()),
          )
        : [...gammes]
    return [...list].sort((a, b) => ml(a.name).localeCompare(ml(b.name)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, selectedFamille, selectedSousFamille, sousFamilleOptions, i18n.language])

  // Produits dans le périmètre hiérarchique (sans capacité/couleur/énergie/connectivité)
  const scopedProducts = useMemo(
    () =>
      products.filter((p) => {
        if (category && String(p.category ?? "").toLowerCase() !== category.toLowerCase()) return false
        if (selectedFamille && String(productFamille(p)?.slug ?? "") !== selectedFamille) return false
        if (selectedSousFamille && String(productSousFamille(p)?.slug ?? "") !== selectedSousFamille) return false
        if (selectedGamme && String(productGamme(p)?.slug ?? "") !== selectedGamme) return false
        return true
      }),
    [category, selectedFamille, selectedSousFamille, selectedGamme],
  )

  // Capacités / couleurs réellement présentes dans le périmètre
  const capaciteOptions: TaxoValue[] = useMemo(() => {
    const map = new Map<string, TaxoValue>()
    for (const p of scopedProducts)
      for (const v of productCapacites(p)) if (!map.has(v.id.toLowerCase())) map.set(v.id.toLowerCase(), v)
    const known = capacites.filter((c) => map.has(c.slug.toLowerCase()))
    const extra = [...map.values()].filter((v) => !known.some((c) => c.slug.toLowerCase() === v.id.toLowerCase()))
    const sortByLabel = (a: TaxoValue, b: TaxoValue) => ml(a.label).localeCompare(ml(b.label))
    return [
      ...[...known].sort((a, b) => ml(a.name).localeCompare(ml(b.name))).map((c) => ({ id: c.slug, label: c.name })),
      ...extra.sort(sortByLabel),
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopedProducts, i18n.language])

  const couleurOptions: TaxoValue[] = useMemo(() => {
    const map = new Map<string, TaxoValue>()
    for (const p of scopedProducts)
      for (const v of productCouleurs(p)) if (!map.has(v.id.toLowerCase())) map.set(v.id.toLowerCase(), v)
    const known = couleurs.filter((c) => map.has(c.slug.toLowerCase()))
    const extra = [...map.values()].filter((v) => !known.some((c) => c.slug.toLowerCase() === v.id.toLowerCase()))
    const sortByLabel = (a: TaxoValue, b: TaxoValue) => ml(a.label).localeCompare(ml(b.label))
    return [
      ...[...known].sort((a, b) => ml(a.name).localeCompare(ml(b.name))).map((c) => ({ id: c.slug, label: c.name })),
      ...extra.sort(sortByLabel),
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopedProducts, i18n.language])

  const matchCapacite = (p: (typeof products)[number]) => {
    if (!selectedCapacite) return true
    const wanted = capaciteOptions.find((o) => o.id.toLowerCase() === selectedCapacite)
    const wantedLabel = wanted ? ml(wanted.label).toLowerCase() : ""
    return productCapacites(p).some(
      (v) => v.id.toLowerCase() === selectedCapacite || (wantedLabel !== "" && ml(v.label).toLowerCase() === wantedLabel),
    )
  }

  const matchCouleur = (p: (typeof products)[number]) => {
    if (!selectedCouleur) return true
    const wanted = couleurOptions.find((o) => o.id.toLowerCase() === selectedCouleur)
    const wantedLabel = wanted ? ml(wanted.label).toLowerCase() : ""
    return productCouleurs(p).some(
      (v) => v.id.toLowerCase() === selectedCouleur || (wantedLabel !== "" && ml(v.label).toLowerCase() === wantedLabel),
    )
  }

  const filtered = useMemo(() => {
    let list = scopedProducts
    if (selectedEnergy.length > 0)
      list = list.filter((p) => selectedEnergy.includes(p.energyClass))
    if (connectedOnly) list = list.filter((p) => p.connectivity)
    if (wifiOnly) list = list.filter((p) => p.wifi ?? p.connectivity)
    if (bluetoothOnly) list = list.filter((p) => p.bluetooth ?? p.connectivity)
    if (badgeParam) {
      const wanted = badgeParam === "promotion" ? "Promotion" : badgeParam === "best-seller" ? "Best Seller" : badgeParam === "nouveau" ? "Nouveau" : ""
      if (wanted) list = list.filter((p) => p.badges?.includes(wanted as (typeof p.badges)[number]))
    }
    if (selectedCapacite) list = list.filter(matchCapacite)
    if (selectedCouleur) list = list.filter(matchCouleur)
    if (sortBy === "newest")
      list = list.filter((p) => p.isNew).concat(list.filter((p) => !p.isNew))
    // ?usage=pro : les appareils haute performance passent au premier plan
    if (usageParam === "pro") {
      const rank = (p: (typeof products)[number]) => {
        const i = usageProFirst.indexOf(String(productFamille(p)?.slug ?? ""))
        return i === -1 ? 99 : i
      }
      list = [...list].sort((a, b) => rank(a) - rank(b))
    }
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopedProducts, selectedEnergy, connectedOnly, wifiOnly, bluetoothOnly, badgeParam, usageParam, selectedCapacite, selectedCouleur, sortBy])

  const toggleEnergy = (cls: string) => {
    setSelectedEnergy((prev) =>
      prev.includes(cls) ? prev.filter((x) => x !== cls) : [...prev, cls],
    )
  }

  const resetFilters = () => {
    setSelectedEnergy([])
    setSelectedFamille("")
    setSelectedSousFamille("")
    setSelectedGamme("")
    setSelectedCapacite("")
    setSelectedCouleur("")
    setConnectedOnly(false)
    setWifiOnly(false)
    setBluetoothOnly(false)
  }

  const hasFilters =
    selectedEnergy.length > 0 ||
    Boolean(selectedFamille) ||
    Boolean(selectedSousFamille) ||
    Boolean(selectedGamme) ||
    Boolean(selectedCapacite) ||
    Boolean(selectedCouleur) ||
    wifiOnly ||
    bluetoothOnly ||
    connectedOnly

  const taxonomyLabel = (kind: "famille" | "sousFamille" | "gamme" | "capacite" | "couleur", slug: string): string => {
    const s = slug.toLowerCase()
    if (kind === "famille") {
      const f = familles.find((x) => x.slug.toLowerCase() === s)
      return f ? ml(f.name) : slug
    }
    if (kind === "sousFamille") {
      const x = sousFamilles.find((x) => x.slug.toLowerCase() === s)
      return x ? ml(x.name) : slug
    }
    if (kind === "gamme") {
      const x = gammes.find((x) => x.slug.toLowerCase() === s)
      return x ? ml(x.name) : slug
    }
    if (kind === "capacite") {
      const o = capaciteOptions.find((x) => x.id.toLowerCase() === s)
      return o ? ml(o.label) : slug
    }
    const o = couleurOptions.find((x) => x.id.toLowerCase() === s)
    return o ? ml(o.label) : slug
  }

  useEffect(() => {
    // Valeurs initiales via query (?famille=…&sousFamille=…&gamme=…&capacite=…&couleur=…), ex. depuis le breadcrumb.
    const q = (k: string) => (searchParams.get(k) ?? "").toLowerCase().trim()
    setSelectedFamille(q("famille"))
    setSelectedSousFamille(q("sousFamille"))
    setSelectedGamme(q("gamme"))
    setSelectedCapacite(q("capacite"))
    setSelectedCouleur(q("couleur"))
    const conn = q("connectivite")
    setWifiOnly(conn === "wifi")
    setBluetoothOnly(conn === "bluetooth")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, searchParams, i18n.language])

  /** Champs de filtres (sidebar desktop + tiroir mobile) : Famille → Sous-famille → Classification → Gamme → Capacité → Couleur → Connectivité. */
  const renderFilterFields = () => (
    <>
      <TaxoSelect
        label={p(productsUi.filters.famille)}
        value={category ? canonicalCategory(category) : ""}
        onChange={(v) => navigate(v ? `/produits/${v}` : "/produits")}
        allLabel={p(productsUi.filters.allFamilles)}
        options={categories.map((c) => ({ value: c.slug, label: ml(c.label) }))}
      />
      <TaxoSelect
        label={p(productsUi.filters.sousFamille)}
        value={selectedFamille}
        onChange={(v) => {
          setSelectedFamille(v.toLowerCase())
          setSelectedSousFamille("")
          setSelectedGamme("")
        }}
        allLabel={p(productsUi.filters.allSousFamilles)}
        options={familleOptions.map((f) => ({ value: f.slug.toLowerCase(), label: ml(f.name) }))}
      />
      <TaxoSelect
        label={p(productsUi.filters.classification)}
        value={selectedSousFamille}
        onChange={(v) => {
          setSelectedSousFamille(v.toLowerCase())
          setSelectedGamme("")
        }}
        allLabel={p(productsUi.filters.allClassifications)}
        options={sousFamilleOptions.map((s) => ({ value: s.slug.toLowerCase(), label: ml(s.name) }))}
      />
      <TaxoSelect
        label={p(productsUi.filters.gamme)}
        value={selectedGamme}
        onChange={(v) => setSelectedGamme(v.toLowerCase())}
        allLabel={p(productsUi.filters.allGammes)}
        options={gammeOptions.map((g) => ({ value: g.slug.toLowerCase(), label: ml(g.name) }))}
      />
      <TaxoSelect
        label={p(productsUi.filters.capacite)}
        value={selectedCapacite}
        onChange={(v) => setSelectedCapacite(v.toLowerCase())}
        allLabel={p(productsUi.filters.allCapacites)}
        options={capaciteOptions.map((o) => ({ value: o.id.toLowerCase(), label: ml(o.label) }))}
      />
      <TaxoSelect
        label={p(productsUi.filters.couleur)}
        value={selectedCouleur}
        onChange={(v) => setSelectedCouleur(v.toLowerCase())}
        allLabel={p(productsUi.filters.allCouleurs)}
        options={couleurOptions.map((o) => ({ value: o.id.toLowerCase(), label: ml(o.label) }))}
      />
      <div className="border-t border-[#d6d6d6] pt-5">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#5a5a5e] font-display">
          {p(productsUi.filters.connectivite)}
        </p>
        {(
          [
            { key: "wifi", label: productsUi.filters.wifi, checked: wifiOnly, set: setWifiOnly },
            { key: "bluetooth", label: productsUi.filters.bluetooth, checked: bluetoothOnly, set: setBluetoothOnly },
          ] as const
        ).map((c) => (
          <label key={c.key} className="group flex min-h-11 cursor-pointer items-center gap-2.5 rounded-[10px] p-2 transition-colors hover:bg-[#f5f5f7]">
            <input
              type="checkbox"
              checked={c.checked}
              onChange={(e) => c.set(e.target.checked)}
              className="h-4 w-4 rounded border-[#d6d6d6] accent-[var(--color-accent)]"
            />
            <span className="text-sm text-[#333336] font-sans">{p(c.label)}</span>
          </label>
        ))}
      </div>
    </>
  )

  const badgeStyle = (badge: string) =>
    badge === "Nouveau"
      ? "bg-[var(--color-primary)] text-white"
      : badge === "Promotion"
        ? "bg-red-500 text-white"
        : badge === "Best Seller"
          ? "bg-amber-400 text-amber-900"
          : "bg-[var(--color-accent)] text-white"

  const smartIcon = "w-3.5 h-3.5"

  return (
    <div className="min-h-screen bg-[#f5f5f7] pt-24">
      {/* ══ Hero catégorie / titre général — galerie blanche ══ */}
      {currentCategory ? (
        <section className="relative overflow-hidden bg-white px-6 pb-14 pt-12 border-b border-[#d6d6d6]">
          <div className="relative mx-auto max-w-7xl">
            <nav className="mb-5 flex items-center gap-2 text-xs font-sans" aria-label="Breadcrumb">
              <Link to="/" className="text-[#5a5a5e] transition-colors hover:text-[#1d1d1f]">{t("products.breadcrumb.home")}</Link>
              <span className="text-[#d6d6d6]">/</span>
              <Link to="/produits" className="text-[#5a5a5e] transition-colors hover:text-[#1d1d1f]">{t("products.breadcrumb.products")}</Link>
              <span className="text-[#d6d6d6]">/</span>
              <span className="font-semibold text-[#1d1d1f]">{ml(currentCategory.label)}</span>
            </nav>
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0077b3]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t("products.breadcrumb.products")}
            </p>
            <h1 className="mt-2 text-5xl font-semibold lg:text-6xl font-display text-[#1d1d1f] tracking-tight">{ml(currentCategory.label)}</h1>
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-[#333336] font-sans">{ml(currentCategory.description)}</p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f5f5f7] px-4 py-1.5 text-xs font-semibold text-[#333336]">
              {filtered.length} {filtered.length === 1 ? t("products.results.one") : t("products.results.other")}
            </p>
          </div>
        </section>
      ) : (
        <section className="relative overflow-hidden bg-white border-b border-[#d6d6d6]">
          <div className="relative mx-auto max-w-7xl px-6 pb-14 pt-12">
            <nav className="mb-5 flex items-center gap-2 text-xs font-sans" aria-label="Breadcrumb">
              <Link to="/" className="text-[#5a5a5e] transition-colors hover:text-[#1d1d1f]">{t("products.breadcrumb.home")}</Link>
              <span className="text-[#d6d6d6]">/</span>
              <span className="font-semibold text-[#1d1d1f]">{t("products.breadcrumb.products")}</span>
            </nav>
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0077b3]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              AUREX
            </p>
            <h1 className="mt-2 text-5xl font-semibold lg:text-6xl font-display text-[#1d1d1f] tracking-tight">
              {t("products.allProducts")}
            </h1>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f5f5f7] px-4 py-1.5 text-xs font-semibold text-[#333336]">
              {filtered.length} {filtered.length === 1 ? t("products.results.one") : t("products.results.other")}
            </p>
          </div>
        </section>
      )}

      <main className={`mx-auto max-w-7xl px-4 py-8 sm:px-6 ${selectedProducts.length > 0 ? "pb-52 lg:pb-44" : ""}`}>
        {/* ══ Onglets catégories ══ */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            to="/produits"
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all font-sans ${
                  !category
                    ? "bg-[var(--color-accent)] text-white"
                    : "bg-white text-[#474747] hover:bg-[#f5f5f7] hover:text-[var(--color-primary)]"
                }`}
          >
            {t("common.all")}
          </Link>
          {categories.map((cat) => {
            const isActive = category === cat.slug
            const color = categoryColor(cat.slug, cat.color)
            return (
              <Link
                key={cat.slug}
                to={`/produits/${cat.slug}`}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all font-sans ${
                  isActive
                    ? "text-white bg-[var(--color-accent)]"
                    : "bg-white text-[#474747] hover:bg-[#f5f5f7] hover:text-[var(--color-primary)]"
                }`}
              >
                {!isActive && (
                  <span
                    className="mr-2 inline-block h-2 w-2 rounded-full align-middle"
                    style={{ backgroundColor: color }}
                  />
                )}
                {ml(cat.label)}
                <span className={`ms-2 text-xs font-medium ${isActive ? "text-white/80" : "text-[#5a5a5e]"}`}>
                  {products.filter((x) => x.category === cat.slug).length}
                </span>
              </Link>
            )
          })}
        </div>

        <div className="flex gap-8">
          {/* ══ Sidebar filtres ══ */}
          <aside className="hidden w-60 flex-shrink-0 lg:block">
            <div className="sticky top-24 rounded-[28px] border border-[#d6d6d6] bg-white shadow-sm overflow-hidden">
              {/* En-tête sidebar */}
              <div className="px-5 py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200" style={{ fontFamily: "var(--font-display)" }}>
                  {t("products.filters.energyClass")}
                </p>
              </div>
              <div className="p-5 space-y-6">
                <div className="space-y-2.5">
                  {energyClasses.map((cls) => (
                    <label key={cls} className="group flex cursor-pointer items-center gap-2.5 rounded-[10px] p-2 transition-colors hover:bg-[#f5f5f7]">
                      <input
                        type="checkbox"
                        checked={selectedEnergy.includes(cls)}
                        onChange={() => toggleEnergy(cls)}
                        className="h-4 w-4 rounded border-[#d6d6d6] text-[#0077b3] accent-[var(--color-accent)]"
                      />
                      <EnergyBadge cls={cls} />
                      <span className="text-sm text-[#333336] transition-colors group-hover:text-[#1d1d1f] font-sans">
                        {cls}
                      </span>
                    </label>
                  ))}
                </div>

                {renderFilterFields()}

                {hasFilters && (
                  <div className="border-t border-[#d6d6d6] pt-4">
                    <button
                      onClick={resetFilters}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 hover:border-red-200 font-sans"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {t("common.resetFilters")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* ══ Contenu ══ */}
          <div className="min-w-0 flex-1">
            {/* Barre d'outils */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-[#d6d6d6] bg-white p-3 shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="flex items-center gap-2 rounded-full border border-[#d6d6d6] px-3.5 py-2 text-sm font-medium text-[#333336] transition-colors hover:bg-[#f5f5f7] lg:hidden font-sans"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  {t("products.filter")}
                  {hasFilters && <span className="ml-0.5 h-2 w-2 rounded-full bg-[var(--color-accent)]" />}
                </button>

                {/* Chips filtres actifs */}
                <div className="hidden flex-wrap items-center gap-2 lg:flex">
                  {selectedEnergy.map((cls) => (
                    <button
                      key={cls}
                      onClick={() => toggleEnergy(cls)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-[#f5f5f7] px-3 py-1 text-xs font-semibold text-[var(--color-primary)] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      <EnergyBadge cls={cls} />
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  ))}
                  {selectedFamille && (
                    <button
                      onClick={() => {
                        setSelectedFamille("")
                        setSelectedSousFamille("")
                        setSelectedGamme("")
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-[#f5f5f7] px-3 py-1 text-xs font-semibold text-[var(--color-primary)] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      {taxonomyLabel("famille", selectedFamille)}
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  {selectedSousFamille && (
                    <button
                      onClick={() => {
                        setSelectedSousFamille("")
                        setSelectedGamme("")
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-[#f5f5f7] px-3 py-1 text-xs font-semibold text-[var(--color-primary)] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      {taxonomyLabel("sousFamille", selectedSousFamille)}
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  {selectedGamme && (
                    <button
                      onClick={() => setSelectedGamme("")}
                      className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-[#f5f5f7] px-3 py-1 text-xs font-semibold text-[var(--color-primary)] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      {taxonomyLabel("gamme", selectedGamme)}
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  {selectedCapacite && (
                    <button
                      onClick={() => setSelectedCapacite("")}
                      className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-[#f5f5f7] px-3 py-1 text-xs font-semibold text-[var(--color-primary)] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      {taxonomyLabel("capacite", selectedCapacite)}
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  {selectedCouleur && (
                    <button
                      onClick={() => setSelectedCouleur("")}
                      className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-[#f5f5f7] px-3 py-1 text-xs font-semibold text-[var(--color-primary)] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      {taxonomyLabel("couleur", selectedCouleur)}
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  {connectedOnly && (
                    <button
                      onClick={() => setConnectedOnly(false)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-[#f5f5f7] px-3 py-1 text-xs font-semibold text-[var(--color-primary)] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      SmartConnect
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-[10px] border border-[#d6d6d6] bg-[#f5f5f7] px-3 py-2 text-sm text-[#333336] outline-none transition focus:border-[var(--color-accent)] focus:ring-4 focus:ring-blue-100 font-sans hover:bg-white cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>

                <div className="flex overflow-hidden rounded-full border border-[#d6d6d6]">
                  {(["grid", "list"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      aria-label={mode}
                      className={`p-2.5 transition-colors ${
                        viewMode === mode
                          ? "bg-[var(--color-primary)] text-white"
                          : "bg-[#f5f5f7] text-[#5a5a5e] hover:bg-white hover:text-[#333336]"
                      }`}
                    >
                      {mode === "grid" ? (
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ══ Grille / Liste ══ */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-[#d6d6d6] bg-white py-24 text-center">
                <div className="relative w-20 h-20 mb-6 mx-auto">
                  <div className="absolute inset-0 rounded-[28px] bg-[var(--color-accent)]/10 blur-lg" />
                  <div className="relative w-20 h-20 bg-[#f5f5f7] rounded-[28px] flex items-center justify-center border border-[#d6d6d6] shadow-sm">
                    <svg className="h-10 w-10 text-[#0077b3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xl font-bold text-[var(--color-primary)] font-display">{t("products.noResults")}</p>
                <p className="mt-2 max-w-sm text-sm text-[#474747] font-sans leading-relaxed">{t("products.noResultsDesc")}</p>
                <button
                  onClick={resetFilters}
                  className="mt-8 rounded-full bg-[var(--color-accent)] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#00628f]"
                >
                  {t("common.resetFilters")}
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((product, pi) => (
                  <Reveal key={product.id} delay={Math.min(pi, 7) * 50} className="h-full">
                  <Link
                    to={productUrl(product)}
                    className="group overflow-hidden rounded-[28px] border border-[#d6d6d6] bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-[#d6d6d6]/50 hover:shadow-2xl hover:shadow-blue-900/12 flex flex-col h-full"
                  >
                    <div className="relative aspect-square overflow-hidden bg-white flex-shrink-0">
                      <img loading="lazy" decoding="async"
                        src={product.image}
                        alt={ml(product.name)}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      {/* Overlay au hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                        {product.badges.map((badge) => (
                          <span
                            key={ml(badge)}
                            className={`rounded-[10px] px-2 py-1 text-[10px] font-bold tracking-wider shadow-sm backdrop-blur-sm ${badgeStyle(ml(badge))}`}
                          >
                            {ml(badge)}
                          </span>
                        ))}
                      </div>
                      {product.connectivity && (
                        <div
                          className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[var(--color-primary)]/85 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-full shadow-md"
                          title="SmartConnect"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                          SmartConnect
                        </div>
                      )}
                      {/* Bouton voir flottant */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-xl -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <svg className="h-4 w-4 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12l-7.5 7.5M21 12H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-[#5a5a5e]">{product.reference}</p>
                      <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-[#1d1d1f] transition-colors group-hover:text-[var(--color-primary)]">
                        {ml(product.name)}
                      </h3>
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <EnergyBadge cls={product.energyClass} />
                        {ml(product.capacity) && (
                          <span className="text-xs text-[#474747] font-sans bg-[#f5f5f7] border border-[#d6d6d6] px-2 py-0.5 rounded-[10px]">{ml(product.capacity)}</span>
                        )}
                      </div>
                      <div className="mt-auto border-t border-[#d6d6d6] pt-3">
                        <div className="mb-3 flex items-center justify-end">
                          <span className="flex items-center gap-1 text-xs font-semibold text-[#0077b3] transition-all group-hover:gap-2">
                            {t("common.view")}
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12l-7.5 7.5M21 12H3" />
                            </svg>
                          </span>
                        </div>
                        <CompareButton productId={product.id} variant="card" className="w-full" />
                      </div>
                    </div>
                  </Link>
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((product, pi) => (
                  <Reveal key={product.id} delay={Math.min(pi, 5) * 60}>
                  <Link
                    to={productUrl(product)}
                    className="group flex flex-col sm:flex-row gap-5 rounded-[28px] border border-[#d6d6d6] bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#d6d6d6]/50 hover:shadow-xl hover:shadow-blue-900/12"
                  >
                    <div className="relative h-48 w-full sm:h-36 sm:w-36 flex-shrink-0 overflow-hidden rounded-[10px] bg-white">
                      <img loading="lazy" decoding="async"
                        src={product.image}
                        alt={ml(product.name)}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-widest text-[#5a5a5e]">{product.reference}</p>
                          <h3 className="mt-1 text-base font-semibold text-[#1d1d1f] transition-colors group-hover:text-[var(--color-primary)]">
                            {ml(product.name)}
                          </h3>
                        </div>
                        <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
                          {product.badges.map((badge) => (
                            <span key={ml(badge)} className={`rounded-[10px] px-2 py-0.5 text-[10px] font-bold tracking-wider ${badgeStyle(ml(badge))}`}>
                              {ml(badge)}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-[#474747] leading-relaxed max-w-2xl">{ml(product.description)}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <EnergyBadge cls={product.energyClass} />
                        {ml(product.capacity) && <span className="text-xs text-[#474747] bg-[#f5f5f7] border border-[#d6d6d6] px-2 py-0.5 rounded-[10px]">{ml(product.capacity)}</span>}
                        {product.connectivity && (
                          <span className="flex items-center gap-1.5 text-xs font-medium text-[#0077b3] bg-[#f5f5f7] px-2.5 py-1 rounded-[10px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                            SmartConnect
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between sm:w-48 sm:pl-4 sm:border-l border-[#d6d6d6]">
                      <div className="flex flex-col items-end w-full">
                        <span className="flex items-center gap-1 text-xs font-semibold text-[#0077b3] transition-all group-hover:gap-2">
                          {t("common.view")}
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12l-7.5 7.5M21 12H3" />
                          </svg>
                        </span>
                      </div>
                      <div className="w-full mt-4 sm:mt-0">
                        <CompareButton productId={product.id} variant="card" className="w-full" />
                      </div>
                    </div>
                  </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ══ Tiroir comparateur ══ */}
      {selectedProducts.length > 0 && (
        <div className="no-print fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-accent)]/20 bg-[var(--color-primary)]/95 shadow-[0_-16px_50px_rgba(10,36,99,0.35)] backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-sm font-bold text-white">
                <svg className="h-4 w-4 text-[#0077b3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                </svg>
                {t("comparator.countShort")}
                <span className="inline-flex items-center gap-1 bg-white/10 border border-white/15 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white">
                  {selectedProducts.length}/{max}
                </span>
              </p>
              <button
                type="button"
                onClick={clear}
                className="text-xs font-semibold text-blue-200/60 transition-colors hover:text-red-400"
              >
                {t("comparator.actions.clear")}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              {Array.from({ length: max }, (_, index) => {
                const product = selectedProducts[index]
                return product ? (
                  <div key={product.id} className="flex min-w-0 items-center gap-2 rounded-[10px] border border-white/10 bg-white/10 backdrop-blur-sm p-2">
                    <img loading="lazy" decoding="async" src={product.image} alt={ml(product.name)} className="h-12 w-12 flex-shrink-0 rounded-[10px] object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-mono text-[9px] uppercase tracking-wider text-blue-300/60">{product.reference}</span>
                      <span className="mt-1 block line-clamp-2 text-xs font-semibold leading-snug text-white">{ml(product.name)}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(product.id)}
                      aria-label={t("comparator.remove")}
                      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-blue-200/50 transition-colors hover:bg-red-500/20 hover:text-red-400"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div key={`empty-${index}`} className="flex min-h-[76px] min-w-0 items-center justify-center rounded-[10px] border border-dashed border-white/15 px-3 py-4 text-center text-xs font-medium text-blue-200/40">
                    {t("comparator.addMoreCta")}
                  </div>
                )
              })}
            </div>
            <Link
              to="/comparateur"
              className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold transition-colors ${
                selectedProducts.length > 1
                  ? "bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/30 hover:-translate-y-0.5 hover:bg-[#00628f] hover:shadow-xl"
                  : "pointer-events-none bg-white/10 text-white/30"
              }`}
              aria-disabled={selectedProducts.length < 2}
            >
              {t("comparator.compare")}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      )}

      {/* ══ Filtres mobile ══ */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-[var(--color-primary)]/40 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
          <div className="animate-slide-up absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white p-6 shadow-2xl">
            <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-[#d6d6d6]" />
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[var(--color-primary)] font-display">{t("products.mobileFilters")}</h3>
              <button onClick={() => setFiltersOpen(false)} className="rounded-full p-2 text-[#5a5a5e] transition-colors hover:bg-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#5a5a5e] font-display">
                  {t("products.filters.energyClass")}
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {energyClasses.map((cls) => (
                    <button
                      key={cls}
                      onClick={() => toggleEnergy(cls)}
                      className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors font-sans flex items-center gap-2 ${
                        selectedEnergy.includes(cls)
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20"
                          : "border-[#d6d6d6] bg-[#f5f5f7] text-[#333336] hover:border-[#d6d6d6] hover:bg-white"
                      }`}
                    >
                      <EnergyBadge cls={cls} />
                      {cls}
                    </button>
                  ))}
                </div>
              </div>
              {renderFilterFields()}
              
              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="w-full rounded-full bg-[var(--color-accent)] py-4 text-sm font-bold text-white transition-colors hover:bg-[#00628f] font-sans"
                >
                  {t("products.viewResults", { count: filtered.length })}
                </button>
                {hasFilters && (
                  <button
                    onClick={resetFilters}
                    className="w-full rounded-full bg-red-50 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 font-sans"
                  >
                    {t("common.resetFilters")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}