import { useState, useMemo, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { categories, products } from "../data"
import CompareButton from "../components/CompareButton"
import { useCompare } from "../context/CompareContext"

const energyClasses = ["A+++", "A++", "A+", "A"]

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
      className={`${color} text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md font-display tracking-wider shadow-sm`}
    >
      {cls}
    </span>
  )
}

export default function ProductsPage() {
  const { t } = useTranslation()
  const { category } = useParams<{ category?: string }>()
  const { ids, max, remove, clear } = useCompare()

  const [selectedEnergy, setSelectedEnergy] = useState<string[]>([])
  const [connectedOnly, setConnectedOnly] = useState(false)
  const [selectedSubcategory, setSelectedSubcategory] = useState("")
  const [sortBy, setSortBy] = useState("relevance")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const selectedProducts = ids
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is (typeof products)[number] => product !== undefined)

  const currentCategory = category
    ? categories.find((c) => c.slug === category)
    : null

  const sortOptions = [
    { value: "relevance", label: t("products.sortBy.relevance") },
    { value: "newest", label: t("products.sortBy.newest") },
    { value: "price-asc", label: t("products.sortBy.priceAsc") },
    { value: "price-desc", label: t("products.sortBy.priceDesc") },
  ]

  const filtered = useMemo(() => {
    let list = category
      ? products.filter((p) => p.category === category)
      : [...products]
    if (selectedEnergy.length > 0)
      list = list.filter((p) => selectedEnergy.includes(p.energyClass))
    if (selectedSubcategory)
      list = list.filter((p) => p.subcategory === selectedSubcategory)
    if (connectedOnly) list = list.filter((p) => p.connectivity)
    if (sortBy === "newest")
      list = list.filter((p) => p.isNew).concat(list.filter((p) => !p.isNew))
    if (sortBy === "price-asc")
      list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
    if (sortBy === "price-desc")
      list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
    return list
  }, [category, selectedEnergy, selectedSubcategory, connectedOnly, sortBy])

  const toggleEnergy = (cls: string) => {
    setSelectedEnergy((prev) =>
      prev.includes(cls) ? prev.filter((x) => x !== cls) : [...prev, cls],
    )
  }

  const resetFilters = () => {
    setSelectedEnergy([])
    setSelectedSubcategory("")
    setConnectedOnly(false)
  }

  const hasFilters = selectedEnergy.length > 0 || Boolean(selectedSubcategory) || connectedOnly
  const availableSubcategories = currentCategory?.subcategories ?? []

  useEffect(() => {
    setSelectedSubcategory("")
  }, [category])

  const badgeStyle = (badge: string) =>
    badge === "Nouveau"
      ? "bg-[#0A2463] text-white"
      : badge === "Promotion"
        ? "bg-red-500 text-white"
        : badge === "Best Seller"
          ? "bg-amber-400 text-amber-900"
          : "bg-[#1E5EF3] text-white"

  const smartIcon = "w-3.5 h-3.5"

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      {/* ══ Hero catégorie / titre général ══ */}
      {currentCategory ? (
        <section className="relative overflow-hidden bg-[#0A2463] px-6 pb-20 pt-12 text-white">
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#1E5EF3]/25 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="relative mx-auto max-w-7xl">
            <nav className="mb-5 flex items-center gap-2 text-xs font-sans" aria-label="Breadcrumb">
              <Link to="/" className="text-blue-200 transition-colors hover:text-white">{t("products.breadcrumb.home")}</Link>
              <span className="text-blue-400">/</span>
              <Link to="/produits" className="text-blue-200 transition-colors hover:text-white">{t("products.breadcrumb.products")}</Link>
              <span className="text-blue-400">/</span>
              <span className="font-semibold text-white">{currentCategory.label}</span>
            </nav>
            <h1 className="text-4xl font-bold lg:text-5xl font-display">{currentCategory.label}</h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-blue-100/90 font-sans">{currentCategory.description}</p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm">
              {filtered.length} {filtered.length === 1 ? t("products.results.one") : t("products.results.other")}
            </p>
          </div>
        </section>
      ) : (
        <section className="relative overflow-hidden bg-[#0A2463] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(30,94,243,0.5),transparent_40%),linear-gradient(120deg,#061540,#0A2463)]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#1E5EF3]/10 blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-12">
            <nav className="mb-5 flex items-center gap-2 text-xs font-sans" aria-label="Breadcrumb">
              <Link to="/" className="text-blue-200/70 transition-colors hover:text-white">{t("products.breadcrumb.home")}</Link>
              <span className="text-blue-400/50">/</span>
              <span className="font-semibold text-white">{t("products.breadcrumb.products")}</span>
            </nav>
            <span
              className="inline-flex items-center gap-2.5 text-[10px] font-bold tracking-[0.22em] uppercase text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-5 shadow-lg"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E5EF3] animate-pulse" />
              EUREX
            </span>
            <h1 className="text-4xl font-bold lg:text-5xl font-display text-white">
              {t("products.allProducts")}
            </h1>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm">
              {filtered.length} {filtered.length === 1 ? t("products.results.one") : t("products.results.other")}
            </p>
          </div>
          <div className="relative h-8 overflow-hidden">
            <svg viewBox="0 0 1440 32" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
              <path d="M0,32 C360,0 1080,0 1440,32 L1440,32 L0,32 Z" fill="#f8fafc" />
            </svg>
          </div>
        </section>
      )}

      <main className={`mx-auto max-w-7xl px-4 py-8 sm:px-6 ${selectedProducts.length > 0 ? "pb-52 lg:pb-44" : ""}`}>
        {/* ══ Onglets catégories ══ */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            to="/produits"
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all font-sans ${
              !category
                ? "bg-[#0A2463] text-white shadow-lg shadow-blue-900/20"
                : "bg-white text-slate-500 hover:bg-slate-50 hover:text-[#0A2463] hover:shadow-sm"
            }`}
          >
            {t("common.all")}
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/produits/${cat.slug}`}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all font-sans ${
                category === cat.slug
                  ? "bg-[#0A2463] text-white shadow-lg shadow-blue-900/20"
                  : "bg-white text-slate-500 hover:bg-slate-50 hover:text-[#0A2463] hover:shadow-sm"
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        <div className="flex gap-8">
          {/* ══ Sidebar filtres ══ */}
          <aside className="hidden w-60 flex-shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
              {/* En-tête sidebar */}
              <div className="px-5 py-4 bg-gradient-to-r from-[#0A2463] to-[#1E5EF3] text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200" style={{ fontFamily: "var(--font-display)" }}>
                  {t("products.filters.energyClass")}
                </p>
              </div>
              <div className="p-5 space-y-6">
                <div className="space-y-2.5">
                  {energyClasses.map((cls) => (
                    <label key={cls} className="group flex cursor-pointer items-center gap-2.5 rounded-xl p-2 transition-colors hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={selectedEnergy.includes(cls)}
                        onChange={() => toggleEnergy(cls)}
                        className="h-4 w-4 rounded border-slate-300 text-[#1E5EF3] accent-[#1E5EF3]"
                      />
                      <EnergyBadge cls={cls} />
                      <span className="text-sm text-slate-600 transition-colors group-hover:text-slate-900 font-sans">
                        {cls}
                      </span>
                    </label>
                  ))}
                </div>

                {availableSubcategories.length > 0 && (
                  <div className="border-t border-slate-100 pt-5">
                    <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 font-display">
                      {t("products.filters.subcategory")}
                    </label>
                    <select
                      value={selectedSubcategory}
                      onChange={(event) => setSelectedSubcategory(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#1E5EF3]"
                    >
                      <option value="">{t("products.filters.allSubcategories")}</option>
                      {availableSubcategories.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-5">
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 font-display">
                    {t("products.filters.connectivity")}
                  </p>
                  <label className="group flex cursor-pointer items-center gap-2.5 rounded-xl p-2 transition-colors hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={connectedOnly}
                      onChange={(e) => setConnectedOnly(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 accent-[#1E5EF3]"
                    />
                    <div className="flex items-center gap-1.5">
                      <svg className={`${smartIcon} text-[#1E5EF3]`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                      </svg>
                      <span className="text-sm text-slate-600 font-sans">SmartConnect</span>
                    </div>
                  </label>
                </div>

                {hasFilters && (
                  <div className="border-t border-slate-100 pt-4">
                    <button
                      onClick={resetFilters}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition-all hover:bg-red-100 hover:border-red-200 font-sans"
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
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 lg:hidden font-sans"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  {t("products.filter")}
                  {hasFilters && <span className="ml-0.5 h-2 w-2 rounded-full bg-[#1E5EF3]" />}
                </button>

                {/* Chips filtres actifs */}
                <div className="hidden flex-wrap items-center gap-2 lg:flex">
                  {selectedEnergy.map((cls) => (
                    <button
                      key={cls}
                      onClick={() => toggleEnergy(cls)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0A2463] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      <EnergyBadge cls={cls} />
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  ))}
                  {selectedSubcategory && (
                    <button
                      onClick={() => setSelectedSubcategory("")}
                      className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0A2463] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      {selectedSubcategory}
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  {connectedOnly && (
                    <button
                      onClick={() => setConnectedOnly(false)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0A2463] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
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
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#1E5EF3] focus:ring-4 focus:ring-blue-100 font-sans hover:bg-slate-100 cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>

                <div className="flex overflow-hidden rounded-xl border border-slate-200">
                  {(["grid", "list"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      aria-label={mode}
                      className={`p-2.5 transition-colors ${
                        viewMode === mode
                          ? "bg-[#0A2463] text-white"
                          : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
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
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white py-24 text-center">
                <div className="relative w-20 h-20 mb-6 mx-auto">
                  <div className="absolute inset-0 rounded-2xl bg-[#1E5EF3]/10 blur-lg" />
                  <div className="relative w-20 h-20 bg-[#EFF3FB] rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
                    <svg className="h-10 w-10 text-[#1E5EF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xl font-bold text-[#0A2463] font-display">{t("products.noResults")}</p>
                <p className="mt-2 max-w-sm text-sm text-slate-500 font-sans leading-relaxed">{t("products.noResultsDesc")}</p>
                <button
                  onClick={resetFilters}
                  className="mt-8 rounded-xl bg-[#0A2463] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#061540] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-900/20"
                >
                  {t("common.resetFilters")}
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((product) => (
                  <Link
                    key={product.id}
                    to={`/produits/${product.category}/${product.id}`}
                    className="group overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-100/50 hover:shadow-2xl hover:shadow-blue-900/12 flex flex-col"
                  >
                    <div className="relative aspect-square overflow-hidden bg-slate-100 flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      {/* Overlay au hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A2463]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                        {product.badges.map((badge) => (
                          <span
                            key={badge}
                            className={`rounded-md px-2 py-1 text-[10px] font-bold tracking-wider shadow-sm backdrop-blur-sm ${badgeStyle(badge)}`}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                      {product.connectivity && (
                        <div
                          className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[#0A2463]/85 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-full shadow-md"
                          title="SmartConnect"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                          SmartConnect
                        </div>
                      )}
                      {/* Bouton voir flottant */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-xl -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <svg className="h-4 w-4 text-[#0A2463]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12l-7.5 7.5M21 12H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-slate-400">{product.reference}</p>
                      <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-slate-900 transition-colors group-hover:text-[#0A2463]">
                        {product.name}
                      </h3>
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <EnergyBadge cls={product.energyClass} />
                        {product.capacity && (
                          <span className="text-xs text-slate-500 font-sans bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">{product.capacity}</span>
                        )}
                      </div>
                      <div className="mt-auto border-t border-slate-50 pt-3">
                        <div className="mb-3 flex items-center justify-between">
                          {product.price ? (
                            <span className="font-display text-base font-bold text-[#0A2463]">
                              {product.price.toLocaleString("fr-DZ")} DA
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 font-sans">{t("common.priceOnRequest")}</span>
                          )}
                          <span className="flex items-center gap-1 text-xs font-semibold text-[#1E5EF3] transition-all group-hover:gap-2">
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
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((product) => (
                  <Link
                    key={product.id}
                    to={`/produits/${product.category}/${product.id}`}
                    className="group flex flex-col sm:flex-row gap-5 rounded-2xl border border-slate-100 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-blue-100/50 hover:shadow-xl hover:shadow-blue-900/12"
                  >
                    <div className="relative h-48 w-full sm:h-36 sm:w-36 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A2463]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">{product.reference}</p>
                          <h3 className="mt-1 text-base font-semibold text-slate-900 transition-colors group-hover:text-[#0A2463]">
                            {product.name}
                          </h3>
                        </div>
                        <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
                          {product.badges.map((badge) => (
                            <span key={badge} className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider ${badgeStyle(badge)}`}>
                              {badge}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-slate-500 leading-relaxed max-w-2xl">{product.description}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <EnergyBadge cls={product.energyClass} />
                        {product.capacity && <span className="text-xs text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">{product.capacity}</span>}
                        {product.connectivity && (
                          <span className="flex items-center gap-1.5 text-xs font-medium text-[#1E5EF3] bg-blue-50 px-2.5 py-1 rounded-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1E5EF3] animate-pulse" />
                            SmartConnect
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between sm:w-48 sm:pl-4 sm:border-l border-slate-100">
                      <div className="flex flex-col items-end w-full">
                        {product.price ? (
                          <span className="font-display text-xl font-bold text-[#0A2463]">
                            {product.price.toLocaleString("fr-DZ")} DA
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">{t("common.priceOnRequest")}</span>
                        )}
                        <span className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#1E5EF3] transition-all group-hover:gap-2">
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
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ══ Tiroir comparateur ══ */}
      {selectedProducts.length > 0 && (
        <div className="no-print fixed inset-x-0 bottom-0 z-50 border-t border-[#1E5EF3]/20 bg-[#0A2463]/95 shadow-[0_-16px_50px_rgba(10,36,99,0.35)] backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-sm font-bold text-white">
                <svg className="h-4 w-4 text-[#1E5EF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                  <div key={product.id} className="flex min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/10 backdrop-blur-sm p-2">
                    <img src={product.image} alt={product.name} className="h-12 w-12 flex-shrink-0 rounded-lg object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-mono text-[9px] uppercase tracking-wider text-blue-300/60">{product.reference}</span>
                      <span className="mt-1 block line-clamp-2 text-xs font-semibold leading-snug text-white">{product.name}</span>
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
                  <div key={`empty-${index}`} className="flex min-h-[76px] min-w-0 items-center justify-center rounded-xl border border-dashed border-white/15 px-3 py-4 text-center text-xs font-medium text-blue-200/40">
                    {t("comparator.addMoreCta")}
                  </div>
                )
              })}
            </div>
            <Link
              to="/comparateur"
              className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold transition-all ${
                selectedProducts.length > 1
                  ? "bg-[#1E5EF3] text-white shadow-lg shadow-[#1E5EF3]/30 hover:-translate-y-0.5 hover:bg-[#1a51d4] hover:shadow-xl"
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
          <div className="absolute inset-0 bg-[#0A2463]/40 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
          <div className="animate-slide-up absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white p-6 shadow-2xl">
            <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-slate-200" />
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#0A2463] font-display">{t("products.mobileFilters")}</h3>
              <button onClick={() => setFiltersOpen(false)} className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400 font-display">
                  {t("products.filters.energyClass")}
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {energyClasses.map((cls) => (
                    <button
                      key={cls}
                      onClick={() => toggleEnergy(cls)}
                      className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors font-sans flex items-center gap-2 ${
                        selectedEnergy.includes(cls)
                          ? "border-[#0A2463] bg-[#0A2463] text-white shadow-md shadow-[#0A2463]/20"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      <EnergyBadge cls={cls} />
                      {cls}
                    </button>
                  ))}
                </div>
              </div>
              {availableSubcategories.length > 0 && (
                <div className="border-t border-slate-100 pt-6">
                  <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-slate-400 font-display">
                    {t("products.filters.subcategory")}
                  </label>
                  <select
                    value={selectedSubcategory}
                    onChange={(event) => setSelectedSubcategory(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#1E5EF3] focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">{t("products.filters.allSubcategories")}</option>
                    {availableSubcategories.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="border-t border-slate-100 pt-6">
                <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-[#1E5EF3]">
                      <svg className={smartIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-slate-700 font-sans">{t("products.smartConnectOnly")}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={connectedOnly}
                    onChange={(e) => setConnectedOnly(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 accent-[#1E5EF3]"
                  />
                </label>
              </div>
              
              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="w-full rounded-xl bg-[#0A2463] py-4 text-sm font-bold text-white transition-all hover:bg-[#061540] hover:-translate-y-0.5 hover:shadow-lg shadow-[#0A2463]/20 font-sans"
                >
                  {t("products.viewResults", { count: filtered.length })}
                </button>
                {hasFilters && (
                  <button
                    onClick={resetFilters}
                    className="w-full rounded-xl bg-red-50 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 font-sans"
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