import { useState, useMemo, useEffect } from "react"
import { Link, Navigate, useNavigate, useParams, useSearchParams, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { categories, products, productUrl } from "../data"
import { ml } from "../lib/ml"
import { canonicalCategory } from "../lib/taxonomy"
import {
  CLASSIFICATION_GROUPS,
  OFFICIAL_CAPACITY_VALUES,
  OFFICIAL_POWERS,
  OFFICIAL_FAMILIES,
  formatCapacity,
  OFFICIAL_COLORS,
  OFFICIAL_RANGES,
  OFFICIAL_SUBFAMILIES,
  catalogInfoOf,
  familyById,
} from "../lib/catalog"
import { keySpecsOf } from "../lib/catalogView"
import { useP } from "../content/lang"
import { productsUi, usageProFirst } from "../content/products"
import CompareButton from "../components/CompareButton"
import ProductsAdSpot from "../components/ProductsAdSpot"
import Reveal from "../components/Reveal"
import { useCompare } from "../context/CompareContext"

// Couleur par famille (modifiable aussi depuis /admin via le champ "Couleur" des catégories)
const CATEGORY_COLORS: Record<string, string> = {
  "cuisine-encastrable": "#b64400",
  "lavage-entretien": "#0077b3",
  "eau-confort": "#00a1b3",
  "petit-electromenager": "#8668ff",
}

function categoryColor(slug?: string | null, override?: string | null): string {
  if (override?.trim()) return override.trim()
  if (slug && CATEGORY_COLORS[slug]) return CATEGORY_COLORS[slug]
  return "var(--color-primary)"
}

/** Select générique d'un filtre (sidebar + tiroir mobile). */
function FilterSelect({
  label,
  value,
  onChange,
  allLabel,
  options,
  groups,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  allLabel: string
  options?: Array<{ value: string; label: string }>
  groups?: Array<{ label: string; options: Array<{ value: string; label: string }> }>
}) {
  return (
    <div className="border-t border-fog pt-5">
      <label className="mb-3 block text-xs font-bold text-iron-gray font-display">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[10px] border border-fog bg-studio-mist px-3 py-2 text-sm text-charcoal outline-none focus:border-[var(--color-accent)]"
      >
        <option value="">{allLabel}</option>
        {(options ?? []).map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
        {(groups ?? []).map((g) => (
          <optgroup key={g.label} label={g.label}>
            {g.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  )
}

/** Anciennes URLs de catégorie (lavage, cuisson…) → familles officielles ; rubriques abandonnées → catalogue complet. */
export default function ProductsPage() {
  const { category } = useParams<{ category?: string }>()
  const { search } = useLocation()
  if (category) {
    const canonical = canonicalCategory(category)
    if (!familyById(canonical)) return <Navigate to="/produits" replace />
    if (canonical !== category.toLowerCase()) return <Navigate to={`/produits/${canonical}${search}`} replace />
  }
  return <ProductsPageInner />
}

function ProductsPageInner() {
  const { t, i18n } = useTranslation()
  const { p, lang } = useP()
  const navigate = useNavigate()
  const { category } = useParams<{ category?: string }>()
  const [searchParams] = useSearchParams()
  const badgeParam = (searchParams.get("badge") ?? "").toLowerCase()
  const usageParam = (searchParams.get("usage") ?? "").toLowerCase()
  const { ids, max, remove, clear } = useCompare()

  // Filtres officiels : Famille (route) → Sous-famille → Gamme → Capacité → Couleur → Connectivité → Classification
  const [sousFamille, setSousFamille] = useState("")
  const [gamme, setGamme] = useState("")
  const [capacite, setCapacite] = useState("")
  const [puissance, setPuissance] = useState("")
  const [couleur, setCouleur] = useState("")
  const [wifiOnly, setWifiOnly] = useState(false)
  const [bluetoothOnly, setBluetoothOnly] = useState(false)
  const [smartOnly, setSmartOnly] = useState(false)
  const [classification, setClassification] = useState("")
  const [sortBy, setSortBy] = useState("relevance")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const selectedProducts = ids
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is (typeof products)[number] => product !== undefined)

  const currentCategory = category ? categories.find((c) => String(c.slug ?? "").toLowerCase() === category.toLowerCase()) ?? null : null

  const sortOptions = [
    { value: "relevance", label: t("products.sortBy.relevance") },
    { value: "newest", label: t("products.sortBy.newest") },
  ]

  const inFamily = useMemo(() => (category ? products.filter((x) => x.category === category) : products), [category])

  /* Périmètre contextuel : famille + sous-famille. Les autres filtres n'affichent que les options réellement présentes. */
  const scoped = useMemo(
    () => inFamily.filter((x) => !sousFamille || catalogInfoOf(x).sousFamille === sousFamille),
    [inFamily, sousFamille],
  )

  const subFamilyOptions = useMemo(
    () =>
      OFFICIAL_SUBFAMILIES.filter((s) => inFamily.some((x) => catalogInfoOf(x).sousFamille === s.id)).map((s) => ({
        value: s.id,
        label: s.name[lang] || s.name.fr,
        family: s.family,
      })),
    [inFamily, lang],
  )
  const gammeOptions = useMemo(() => OFFICIAL_RANGES.filter((r) => scoped.some((x) => catalogInfoOf(x).range === r.id)).map((r) => ({ value: r.id, label: r.name })), [scoped])
  const capacityOptions = useMemo(() => OFFICIAL_CAPACITY_VALUES.filter((c) => scoped.some((x) => catalogInfoOf(x).capacities.includes(c.id))).map((c) => ({ value: c.id, label: formatCapacity(c, lang) })), [scoped, lang])
  const powerOptions = useMemo(() => OFFICIAL_POWERS.filter((c) => scoped.some((x) => catalogInfoOf(x).powers.includes(c.id))).map((c) => ({ value: c.id, label: formatCapacity(c, lang) })), [scoped, lang])
  // Famille : libellés courts du filtre officiel ; seules les familles ayant des produits disponibles.
  const familyOptions = useMemo(
    () => OFFICIAL_FAMILIES.filter((f) => products.some((x) => x.category === f.id)).map((f) => ({ value: f.id, label: f.name[lang] || f.name.fr })),
    [lang],
  )
  const colorOptions = useMemo(
    () => OFFICIAL_COLORS.filter((c) => scoped.some((x) => catalogInfoOf(x).colors.includes(c.id))).map((c) => ({ value: c.id, label: c.name[lang] || c.name.fr })),
    [scoped, lang],
  )
  const hasWifi = useMemo(() => scoped.some((x) => catalogInfoOf(x).wifi), [scoped])
  const hasBluetooth = useMemo(() => scoped.some((x) => catalogInfoOf(x).bluetooth), [scoped])
  const classificationGroups = useMemo(
    () =>
      CLASSIFICATION_GROUPS.map((g) => ({
        label: g.title[lang] || g.title.fr,
        options: g.options
          .filter((opt) => scoped.some((x) => catalogInfoOf(x).classifications.includes(opt.id)))
          .map((opt) => ({ value: opt.id, label: opt.name[lang] || opt.name.fr })),
      })).filter((g) => g.options.length > 0),
    [scoped, lang],
  )

  // Une sélection devenue sans objet (changement de famille / sous-famille) est retirée.
  useEffect(() => {
    if (sousFamille && !subFamilyOptions.some((o) => o.value === sousFamille)) setSousFamille("")
    if (gamme && !gammeOptions.some((o) => o.value === gamme)) setGamme("")
    if (capacite && !capacityOptions.some((o) => o.value === capacite)) setCapacite("")
    if (puissance && !powerOptions.some((o) => o.value === puissance)) setPuissance("")
    if (couleur && !colorOptions.some((o) => o.value === couleur)) setCouleur("")
    if (wifiOnly && !hasWifi) setWifiOnly(false)
    if (bluetoothOnly && !hasBluetooth) setBluetoothOnly(false)
    if (classification && !classificationGroups.some((g) => g.options.some((o) => o.value === classification))) setClassification("")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subFamilyOptions, gammeOptions, capacityOptions, powerOptions, colorOptions, hasWifi, hasBluetooth, classificationGroups])

  const filtered = useMemo(() => {
    let list = scoped.filter((x) => {
      const info = catalogInfoOf(x)
      if (gamme && info.range !== gamme) return false
      if (capacite && !info.capacities.includes(capacite)) return false
      if (puissance && !info.powers.includes(puissance)) return false
      if (couleur && !info.colors.includes(couleur)) return false
      if (wifiOnly && !info.wifi) return false
      if (bluetoothOnly && !info.bluetooth) return false
      if (smartOnly && !(info.wifi || info.bluetooth || x.connectivity)) return false
      if (classification && !info.classifications.includes(classification)) return false
      return true
    })
    if (badgeParam) {
      const wanted = badgeParam === "promotion" ? "Promotion" : badgeParam === "best-seller" ? "Best Seller" : badgeParam === "nouveau" ? "Nouveau" : ""
      if (wanted) list = list.filter((x) => x.badges?.includes(wanted as (typeof x.badges)[number]))
    }
    if (sortBy === "newest") list = list.filter((x) => x.isNew).concat(list.filter((x) => !x.isNew))
    // ?usage=pro : les appareils haute performance passent au premier plan
    if (usageParam === "pro") {
      const rank = (x: (typeof products)[number]) => {
        const i = usageProFirst.indexOf(String(catalogInfoOf(x).sousFamille ?? ""))
        return i === -1 ? 99 : i
      }
      list = [...list].sort((a, b) => rank(a) - rank(b))
    }
    return list
  }, [scoped, gamme, capacite, puissance, couleur, wifiOnly, bluetoothOnly, smartOnly, classification, badgeParam, usageParam, sortBy])

  const resetFilters = () => {
    setSousFamille("")
    setGamme("")
    setCapacite("")
    setPuissance("")
    setCouleur("")
    setWifiOnly(false)
    setBluetoothOnly(false)
    setSmartOnly(false)
    setClassification("")
  }

  const hasFilters = Boolean(sousFamille || gamme || capacite || puissance || couleur || wifiOnly || bluetoothOnly || smartOnly || classification)

  // Valeurs initiales via l'URL (?sousFamille=…&gamme=…&capacite=…&couleur=…&classification=…&connectivite=wifi|bluetooth|smart)
  useEffect(() => {
    const q = (k: string) => (searchParams.get(k) ?? "").toLowerCase().trim()
    setSousFamille(q("sousfamille") || q("sous-famille"))
    setGamme(q("gamme"))
    setCapacite(q("capacite"))
    setPuissance(q("puissance"))
    setCouleur(q("couleur"))
    setClassification(q("classification"))
    const conn = q("connectivite")
    setSmartOnly(conn === "smart")
    setWifiOnly(conn === "wifi")
    setBluetoothOnly(conn === "bluetooth")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, searchParams])

  /** Chips des filtres actifs. */
  const chips: Array<{ key: string; label: string; clear: () => void }> = []
  if (sousFamille) chips.push({ key: "sf", label: subFamilyOptions.find((o) => o.value === sousFamille)?.label ?? sousFamille, clear: () => setSousFamille("") })
  if (gamme) chips.push({ key: "g", label: gammeOptions.find((o) => o.value === gamme)?.label ?? gamme, clear: () => setGamme("") })
  if (capacite) chips.push({ key: "c", label: capacityOptions.find((o) => o.value === capacite)?.label ?? capacite, clear: () => setCapacite("") })
  if (puissance) chips.push({ key: "p", label: powerOptions.find((o) => o.value === puissance)?.label ?? puissance, clear: () => setPuissance("") })
  if (couleur) chips.push({ key: "k", label: colorOptions.find((o) => o.value === couleur)?.label ?? couleur, clear: () => setCouleur("") })
  if (wifiOnly) chips.push({ key: "w", label: "Wi-Fi", clear: () => setWifiOnly(false) })
  if (bluetoothOnly) chips.push({ key: "b", label: "Bluetooth", clear: () => setBluetoothOnly(false) })
  if (smartOnly) chips.push({ key: "s", label: p(productsUi.smartTitle), clear: () => setSmartOnly(false) })
  if (classification) {
    const label = classificationGroups.flatMap((g) => g.options).find((o) => o.value === classification)?.label ?? classification
    chips.push({ key: "cl", label, clear: () => setClassification("") })
  }

  /** Champs de filtres dans l'ordre officiel : Famille, Sous-famille, Classification, Gamme, Capacité, Puissance, Couleur, Connectivité. */
  const renderFilterFields = () => (
    <>
      <FilterSelect
        label={p(productsUi.filters.famille)}
        value={category ?? ""}
        onChange={(v) => navigate(v ? `/produits/${v}` : "/produits")}
        allLabel={p(productsUi.filters.allFamilles)}
        options={familyOptions}
      />
      <FilterSelect
        label={p(productsUi.filters.sousFamille)}
        value={sousFamille}
        onChange={(v) => setSousFamille(v)}
        allLabel={p(productsUi.filters.allSousFamilles)}
        options={category ? subFamilyOptions : undefined}
        groups={
          category
            ? undefined
            : categories
                .map((c) => ({ label: ml(c.label), options: subFamilyOptions.filter((o) => o.family === c.slug).map((o) => ({ value: o.value, label: o.label })) }))
                .filter((g) => g.options.length > 0)
        }
      />
      {classificationGroups.length > 0 && (
        <FilterSelect
          label={p(productsUi.filters.classification)}
          value={classification}
          onChange={setClassification}
          allLabel={p(productsUi.filters.allClassifications)}
          groups={classificationGroups}
        />
      )}
      {gammeOptions.length > 0 && (
        <FilterSelect label={p(productsUi.filters.gamme)} value={gamme} onChange={setGamme} allLabel={p(productsUi.filters.allGammes)} options={gammeOptions} />
      )}
      {capacityOptions.length > 0 && (
        <FilterSelect label={p(productsUi.filters.capacite)} value={capacite} onChange={setCapacite} allLabel={p(productsUi.filters.allCapacites)} options={capacityOptions} />
      )}
      {powerOptions.length > 0 && (
        <FilterSelect label={p(productsUi.filters.puissance)} value={puissance} onChange={setPuissance} allLabel={p(productsUi.filters.allPuissances)} options={powerOptions} />
      )}
      {colorOptions.length > 0 && (
        <FilterSelect label={p(productsUi.filters.couleur)} value={couleur} onChange={setCouleur} allLabel={p(productsUi.filters.allCouleurs)} options={colorOptions} />
      )}
      {(hasWifi || hasBluetooth) && (
        <div className="border-t border-fog pt-5">
          <p className="mb-3 text-xs font-bold text-iron-gray font-display">{p(productsUi.filters.connectivite)}</p>
          {(
            [
              { key: "wifi", show: hasWifi, label: productsUi.filters.wifi, checked: wifiOnly, set: setWifiOnly },
              { key: "bluetooth", show: hasBluetooth, label: productsUi.filters.bluetooth, checked: bluetoothOnly, set: setBluetoothOnly },
            ] as const
          )
            .filter((c) => c.show)
            .map((c) => (
              <label key={c.key} className="group flex min-h-11 cursor-pointer items-center gap-2.5 rounded-[10px] p-2 transition-colors hover:bg-studio-mist">
                <input type="checkbox" checked={c.checked} onChange={(e) => c.set(e.target.checked)} className="h-4 w-4 rounded border-fog accent-[var(--color-accent)]" />
                <span className="text-sm text-charcoal font-sans">{p(c.label)}</span>
              </label>
            ))}
        </div>
      )}
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

  const ctaLabel = p(productsUi.discover)
  const resultsLabel = `${filtered.length} ${filtered.length === 1 ? t("products.results.one") : t("products.results.other")}`

  return (
    <div className="min-h-screen bg-studio-mist pt-[72px]">
      {/* ══ Product Advertising Spot : visuels publicitaires AUREX (aucun texte de présentation) ══ */}
      <ProductsAdSpot family={category} />
      <h1 className="sr-only">
        {currentCategory ? ml(currentCategory.label) : searchParams.get("connectivite") === "smart" ? p(productsUi.smartTitle) : t("products.allProducts")}
      </h1>

      <main className={`mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8 ${selectedProducts.length > 0 ? "pb-52 lg:pb-44" : ""}`}>
        {/* Fil d'Ariane */}
        <nav className="mb-2 flex items-center gap-2 text-xs font-sans sm:mb-4" aria-label="Breadcrumb">
          <Link to="/" className="inline-flex min-h-11 items-center text-iron-gray transition-colors hover:text-obsidian">{t("products.breadcrumb.home")}</Link>
          <span className="text-fog">/</span>
          {currentCategory ? (
            <>
              <Link to="/produits" className="text-iron-gray transition-colors hover:text-obsidian">{t("products.breadcrumb.products")}</Link>
              <span className="text-fog">/</span>
              <span className="font-semibold text-obsidian">{ml(currentCategory.label)}</span>
            </>
          ) : (
            <span className="font-semibold text-obsidian">{t("products.breadcrumb.products")}</span>
          )}
        </nav>

        {/* ══ Onglets familles (4) ══ */}
        <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:mb-8 sm:flex-wrap sm:overflow-visible sm:px-0">
          <Link
            to="/produits"
            className={`inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full px-5 text-sm font-semibold transition-[color,background-color,border-color,opacity,transform,box-shadow] font-sans ${
              !category ? "bg-[var(--color-accent)] text-white" : "bg-white text-slate hover:bg-studio-mist hover:text-[var(--color-primary)]"
            }`}
          >
            {t("common.all")}
          </Link>
          {categories.map((cat) => {
            const isActive = category === cat.slug
            // Seules les familles qui ont des produits réellement disponibles sont proposées.
            if (!isActive && !products.some((x) => x.category === cat.slug)) return null
            const color = categoryColor(cat.slug, cat.color)
            return (
              <Link
                key={cat.slug}
                to={`/produits/${cat.slug}`}
                className={`inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full px-5 text-sm font-semibold transition-[color,background-color,border-color,opacity,transform,box-shadow] font-sans ${
                  isActive ? "text-white bg-[var(--color-accent)]" : "bg-white text-slate hover:bg-studio-mist hover:text-[var(--color-primary)]"
                }`}
              >
                {!isActive && <span className="mr-2 inline-block h-2 w-2 rounded-full align-middle" style={{ backgroundColor: color }} />}
                {ml(cat.label)}
                <span className={`ms-2 text-xs font-medium ${isActive ? "text-white/80" : "text-iron-gray"}`}>
                  {products.filter((x) => x.category === cat.slug).length}
                </span>
              </Link>
            )
          })}
        </div>

        <div className="flex gap-8">
          {/* ══ Sidebar filtres (défilante) ══ */}
          <aside className="hidden w-60 flex-shrink-0 lg:block">
            <div className="sticky top-24 flex max-h-[calc(100vh-7rem)] flex-col overflow-hidden rounded-[28px] border border-fog bg-white shadow-sm">
              <div className="shrink-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] px-5 py-4 text-white">
                <p className="text-xs font-bold text-blue-200" style={{ fontFamily: "var(--font-display)" }}>
                  {t("products.filter")}
                </p>
              </div>
              <div
                className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain p-5 [scrollbar-color:var(--color-steel)_transparent] [scrollbar-width:thin]"
                tabIndex={0}
                aria-label={t("products.filter")}
              >
                {renderFilterFields()}
                {hasFilters && (
                  <div className="border-t border-fog pt-4">
                    <button
                      onClick={resetFilters}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:border-red-200 hover:bg-red-100 font-sans"
                    >
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
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-fog bg-white p-3 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="flex min-h-11 items-center gap-2 rounded-full border border-fog px-3.5 py-2 text-sm font-medium text-charcoal transition-colors hover:bg-studio-mist lg:hidden font-sans"
                >
                  <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  {t("products.filter")}
                  {hasFilters && <span className="ml-0.5 h-2 w-2 rounded-full bg-[var(--color-accent)]" />}
                </button>
                <span className="text-sm font-semibold text-charcoal">{resultsLabel}</span>

                {/* Chips filtres actifs */}
                <div className="hidden flex-wrap items-center gap-2 lg:flex">
                  {chips.map((chip) => (
                    <button
                      key={chip.key}
                      onClick={chip.clear}
                      className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-studio-mist px-3 py-1 text-xs font-semibold text-[var(--color-primary)] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      {chip.label}
                      <svg aria-hidden="true" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="min-h-11 max-w-[10rem] cursor-pointer rounded-[10px] border border-fog bg-studio-mist px-3 py-2 text-sm sm:max-w-none text-charcoal outline-none transition hover:bg-white focus:border-[var(--color-accent)] focus:ring-4 focus:ring-blue-100 font-sans"
                  aria-label={t("products.sortBy.relevance")}
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <div className="hidden overflow-hidden rounded-full border border-fog sm:flex">
                  {(["grid", "list"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      aria-label={mode}
                      className={`flex h-11 w-11 items-center justify-center transition-colors ${
                        viewMode === mode ? "bg-[var(--color-primary)] text-white" : "bg-studio-mist text-iron-gray hover:bg-white hover:text-charcoal"
                      }`}
                    >
                      {mode === "grid" ? (
                        <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      ) : (
                        <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
              <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-fog bg-white py-24 text-center">
                <p className="font-display text-xl font-bold text-[var(--color-primary)]">
                  {smartOnly ? p(productsUi.smartEmptyTitle) : t("products.noResults")}
                </p>
                <p className="mt-2 max-w-sm font-sans text-sm leading-relaxed text-slate">
                  {smartOnly ? p(productsUi.smartEmptyText) : t("products.noResultsDesc")}
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-8 rounded-full bg-[var(--color-accent)] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
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
                      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-fog bg-white transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:border-fog/50 motion-reduce:transition-none"
                    >
                      <div className="relative aspect-square flex-shrink-0 overflow-hidden bg-white">
                        <img
                          loading="lazy"
                          decoding="async"
                          src={product.image}
                          alt={ml(product.name)}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
                        />
                        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                          {product.badges.map((badge) => (
                            <span key={ml(badge)} className={`rounded-[10px] px-2 py-1 text-xs font-bold backdrop-blur-sm ${badgeStyle(ml(badge))}`}>
                              {ml(badge)}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <p className="mb-1 font-mono text-xs text-iron-gray">{product.reference}</p>
                        <h3 className="mb-3 line-clamp-2 text-sm font-semibold leading-snug text-obsidian transition-colors group-hover:text-[var(--color-primary)]">
                          {ml(product.name)}
                        </h3>
                        {/* 2 à 6 caractéristiques principales (données réelles du produit) */}
                        <ul className="mb-3 flex flex-wrap gap-1.5">
                          {keySpecsOf(product, lang).map((spec) => (
                            <li key={spec} className="rounded-[10px] border border-fog bg-studio-mist px-2 py-0.5 font-sans text-xs text-slate">
                              {spec}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-auto border-t border-fog pt-3">
                          <span className="mb-3 flex items-center gap-1 text-xs font-semibold text-link-deep transition-[color,background-color,border-color,opacity,transform,box-shadow] group-hover:gap-2">
                            {ctaLabel}
                            <svg aria-hidden="true" className="h-3.5 w-3.5 rtl:-scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12l-7.5 7.5M21 12H3" />
                            </svg>
                          </span>
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
                      className="group flex flex-col gap-5 rounded-[28px] border border-fog bg-white p-4 transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-fog/50 motion-reduce:transition-none sm:flex-row"
                    >
                      <div className="relative h-48 w-full flex-shrink-0 overflow-hidden rounded-[10px] bg-white sm:h-36 sm:w-36">
                        <img loading="lazy" decoding="async" src={product.image} alt={ml(product.name)} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-center">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-mono text-xs text-iron-gray">{product.reference}</p>
                            <h3 className="mt-1 text-base font-semibold text-obsidian transition-colors group-hover:text-[var(--color-primary)]">{ml(product.name)}</h3>
                          </div>
                          <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
                            {product.badges.map((badge) => (
                              <span key={ml(badge)} className={`rounded-[10px] px-2 py-0.5 text-xs font-bold ${badgeStyle(ml(badge))}`}>
                                {ml(badge)}
                              </span>
                            ))}
                          </div>
                        </div>
                        <ul className="mt-3 flex flex-wrap gap-1.5">
                          {keySpecsOf(product, lang).map((spec) => (
                            <li key={spec} className="rounded-[10px] border border-fog bg-studio-mist px-2 py-0.5 text-xs text-slate">
                              {spec}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-col items-end justify-between border-fog sm:w-48 sm:border-l sm:pl-4">
                        <span className="flex items-center gap-1 text-xs font-semibold text-link-deep transition-[color,background-color,border-color,opacity,transform,box-shadow] group-hover:gap-2">
                          {ctaLabel}
                          <svg aria-hidden="true" className="h-3.5 w-3.5 rtl:-scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12l-7.5 7.5M21 12H3" />
                          </svg>
                        </span>
                        <div className="mt-4 w-full sm:mt-0">
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
        <div className="no-print fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-accent)]/20 bg-[var(--color-primary)]/95 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-sm font-bold text-white">
                {t("comparator.countShort")}
                <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white">
                  {selectedProducts.length}/{max}
                </span>
              </p>
              <button type="button" onClick={clear} className="text-xs font-semibold text-blue-200/60 transition-colors hover:text-red-400">
                {t("comparator.actions.clear")}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              {Array.from({ length: max }, (_, index) => {
                const product = selectedProducts[index]
                return product ? (
                  <div key={product.id} className="flex min-w-0 items-center gap-2 rounded-[10px] border border-white/10 bg-white/10 p-2 backdrop-blur-sm">
                    <img loading="lazy" decoding="async" src={product.image} alt={ml(product.name)} className="h-12 w-12 flex-shrink-0 rounded-[10px] object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-mono text-[9px] text-blue-300/60">{product.reference}</span>
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
                selectedProducts.length > 1 ? "bg-[var(--color-accent)] text-white hover:bg-accent-hover" : "pointer-events-none bg-white/10 text-white/30"
              }`}
              aria-disabled={selectedProducts.length < 2}
            >
              {t("comparator.compare")}
              <svg aria-hidden="true" className="h-4 w-4 rtl:-scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      )}

      {/* ══ Filtres mobile / tablette ══ */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-[var(--color-primary)]/40 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
          <div className="animate-slide-up absolute bottom-0 left-0 right-0 max-h-[88dvh] overflow-y-auto overscroll-contain rounded-t-3xl bg-white p-6">
            <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-fog" />
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-[var(--color-primary)]">{t("products.mobileFilters")}</h3>
              <button onClick={() => setFiltersOpen(false)} className="rounded-full p-2 text-iron-gray transition-colors hover:bg-studio-mist" aria-label="Close">
                <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-6">
              {renderFilterFields()}
              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="w-full rounded-full bg-[var(--color-accent)] py-4 font-sans text-sm font-bold text-white transition-colors hover:bg-accent-hover"
                >
                  {t("products.viewResults", { count: filtered.length })}
                </button>
                {hasFilters && (
                  <button onClick={resetFilters} className="w-full rounded-full bg-red-50 py-3 font-sans text-sm font-semibold text-red-600 transition-colors hover:bg-red-100">
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
