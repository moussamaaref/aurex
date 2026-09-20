import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { technologies, products, productUrl } from "../data"
import { loadRemoteCollection } from "../lib/contentStore"
import { ml, mlFr } from "../lib/ml"
import { tx } from "../lib/langText"
import Reveal from "../components/Reveal"

function ArrowIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

export type TechPageData = {
  techHeroSubtitle?: string
  techHeroTitle?: string
  techHeroDesc?: string
  stat1Value?: string
  stat1Label?: string
  stat2Value?: string
  stat2Label?: string
  stat3Value?: string
  stat3Label?: string
  stat4Value?: string
  stat4Label?: string
  filterAll?: string
  filterConnectivity?: string
  filterEco?: string
  filterHygiene?: string
  filterConservation?: string
  ctaTitle?: string
  ctaDesc?: string
  ctaButton?: string
  is_active?: boolean
}
const defaultTechPage: TechPageData = {}
function normalizeTechPage(raw: unknown): TechPageData {
  if (!Array.isArray(raw) || raw.length === 0) return defaultTechPage
  const first = (raw as TechPageData[]).find((c) => c && typeof c === "object" && c.is_active !== false)
  return first ?? defaultTechPage
}

export default function TechnologiesPage() {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeTech, setActiveTech] = useState<string | null>(null)
  const [tp, setTp] = useState<TechPageData>(() => {
    try {
      const raw = localStorage.getItem("aurex-data-techPage")
      if (raw) return normalizeTechPage(JSON.parse(raw))
    } catch {
      // ignore
    }
    return defaultTechPage
  })

  useEffect(() => {
    void loadRemoteCollection<TechPageData>("techPage").then((remote) => {
      if (remote && Array.isArray(remote) && remote.length > 0) {
        const normalized = normalizeTechPage(remote)
        setTp(normalized)
        localStorage.setItem("aurex-data-techPage", JSON.stringify([normalized]))
      }
    }).catch(() => {})
  }, [])

  const filterCategories = [
    { key: "all", label: tx(tp.filterAll, t("technologies.filters.all")) },
    { key: "Connectivité", label: tx(tp.filterConnectivity, t("technologies.filters.connectivity")) },
    { key: "Éco-efficacité", label: tx(tp.filterEco, t("technologies.filters.ecoEfficiency")) },
    { key: "Hygiène", label: tx(tp.filterHygiene, t("technologies.filters.hygiene")) },
    { key: "Conservation", label: tx(tp.filterConservation, t("technologies.filters.conservation")) },
  ]

  const countFor = (key: string) =>
    key === "all"
      ? technologies.length
      : technologies.filter((t2) => mlFr(t2.category) === key).length

  const filtered =
    activeCategory === "all"
      ? technologies
      : technologies.filter((t2) => mlFr(t2.category) === activeCategory)

  const selectedTech = activeTech
    ? technologies.find((t2) => t2.id === activeTech)
    : null
  const compatibleProducts = selectedTech
    ? products.filter((p) =>
        selectedTech.compatibleCategories.some(
          (c) => ml(c).toLowerCase() === String(p.category ?? "").toLowerCase(),
        ),
      )
    : []

  const stats = [
    { value: ml(tp.stat1Value) || "12+", label: tx(tp.stat1Label, t("technologies.stats.patented")) },
    { value: ml(tp.stat2Value) || "40%", label: tx(tp.stat2Label, t("technologies.stats.energySavings")) },
    { value: ml(tp.stat3Value) || "3×", label: tx(tp.stat3Label, t("technologies.stats.freshCoolDuration")) },
    { value: tx(tp.stat4Value, t("technologies.stats.inverterWarrantyValue")) || "10 ans", label: tx(tp.stat4Label, t("technologies.stats.inverterWarranty")) },
  ]

  return (
    <div className="min-h-screen bg-[#f5f5f7] pt-24">
      {/* ═══════════ HERO — galerie blanche ═══════════ */}
      <section className="relative bg-white overflow-hidden py-16 lg:py-20 border-b border-[#d6d6d6]">
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0066cc]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {tx(tp.techHeroSubtitle, t("technologies.hero.subtitle"))}
            </span>
            <h1
              className="text-5xl lg:text-6xl font-semibold text-[#1d1d1f] mt-3 leading-[1.06] tracking-tight"
              style={{ fontFamily: "var(--font-display)", whiteSpace: "pre-line" }}
            >
              {tx(tp.techHeroTitle, t("technologies.hero.title"))}
            </h1>
            <p className="text-[#333336] mt-5 leading-relaxed font-sans text-[17px]">
              {tx(tp.techHeroDesc, t("technologies.hero.desc"))}
            </p>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-[#d6d6d6]">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl lg:text-4xl font-semibold text-[#1d1d1f] font-display tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs text-[#707070] mt-1.5 font-sans">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FILTRES STICKY ═══════════ */}
      <div className="sticky top-20 z-20 bg-[#f5f5f7]/90 backdrop-blur-md border-b border-[#d6d6d6] py-3 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 overflow-x-auto">
          {filterCategories.map((cat) => {
            const active = activeCategory === cat.key
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all font-sans ${
                  active
                    ? "bg-[#0071e3] text-white shadow-lg shadow-[#0071e3]/30"
                    : "bg-white text-[#333336] border border-[#d6d6d6] hover:border-[#0071e3]/50 hover:text-[#0071e3] hover:-translate-y-0.5"
                }`}
              >
                {ml(cat.label)}
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    active ? "bg-white/20 text-white" : "bg-[#f5f5f7] text-[#0071e3]"
                  }`}
                >
                  {countFor(cat.key)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ═══════════ GRILLE TECHS ═══════════ */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tech, ti) => {
            const open = activeTech === tech.id
            return (
              <Reveal key={tech.id} delay={Math.min(ti, 5) * 60} className="h-full">
              <button
                onClick={() => setActiveTech(open ? null : tech.id)}
                className={`group text-left rounded-[28px] overflow-hidden border transition-all duration-300 bg-white h-full w-full ${
                  open
                    ? "border-[#0071e3] shadow-xl shadow-[#0071e3]/15 ring-2 ring-[#0071e3]/20"
                    : "border-[#d6d6d6] hover:shadow-xl hover:shadow-[#1d1d1f]/10 hover:border-[#0071e3]/30 hover:-translate-y-1.5"
                }`}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={tech.image}
                    alt={ml(tech.name)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1d1d1f]/80 via-[#1d1d1f]/10 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-white bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/25 font-display">
                      {ml(tech.category)}
                    </span>
                  </div>
                  {/* Indicateur d'expansion */}
                  <div
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 ${
                      open ? "bg-[#0071e3] text-white rotate-180" : "bg-white/15 text-white border border-white/25"
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between gap-3">
                    <h3 className="text-xl font-bold text-white font-display">{ml(tech.name)}</h3>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-[#0071e3]/10 flex items-center justify-center group-hover:bg-[#0071e3] group-hover:scale-110 transition-all duration-300">
                      <svg className="w-3.5 h-3.5 text-[#0071e3] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <p className="text-xs font-semibold text-[#0071e3] font-sans">{ml(tech.benefit)}</p>
                  </div>
                  <p className="text-sm text-[#333336] leading-relaxed font-sans line-clamp-3">
                    {ml(tech.description)}
                  </p>

                  {/* Expansion animée */}
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="mt-4 pt-4 border-t border-[#d6d6d6]">
                        <p className="text-[10px] font-bold tracking-widest uppercase text-[#707070] mb-3 font-display">
                          {t("technologies.productsWith", { name: ml(tech.name) })}
                        </p>
                        <div className="space-y-1.5">
                          {compatibleProducts.length > 0 ? (
                            <>
                              {compatibleProducts.slice(0, 2).map((p) => (
                                <Link
                                  key={p.id}
                                  to={productUrl(p)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="group/p flex items-center gap-3 hover:bg-[#f5f5f7] rounded-[10px] p-2 transition-colors border border-transparent hover:border-[#0071e3]/20"
                                >
                                  <img src={p.image} alt={ml(p.name)} className="w-11 h-11 object-cover rounded-[10px] shadow-sm" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold text-[#1d1d1f] font-sans truncate group-hover/p:text-[#1d1d1f] transition-colors">
                                      {ml(p.name)}
                                    </p>
                                    <p className="text-[10px] text-[#707070] font-mono">{p.reference}</p>
                                  </div>
                                  <ArrowIcon className="w-3.5 h-3.5 text-[#0071e3] flex-shrink-0 opacity-0 group-hover/p:opacity-100 transition-opacity" />
                                </Link>
                              ))}
                              {compatibleProducts.length > 2 && (
                                <Link
                                  to="/produits"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0071e3] hover:text-[#1d1d1f] px-2 pt-1 font-sans transition-colors"
                                >
                                  +{compatibleProducts.length - 2} {t("technologies.more", { defaultValue: "autres" })}
                                  <ArrowIcon className="w-3 h-3" />
                                </Link>
                              )}
                            </>
                          ) : (
                            <p className="text-xs text-[#474747] font-sans">{t("technologies.comingSoon")}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
              </Reveal>
            )
          })}
        </div>
      </div>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-20 bg-[#f5f5f7]">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
          <div className="relative rounded-[28px] bg-[#1d1d1f] p-12 lg:p-16 text-center overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
                backgroundSize: "64px 64px",
              }}
            />
            <div className="relative">
              <h2 className="text-3xl lg:text-4xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                {tx(tp.ctaTitle, t("technologies.ctaTitle"))}
              </h2>
              <p className="text-blue-100/80 mt-4 max-w-xl mx-auto font-sans text-sm leading-relaxed">
                {tx(tp.ctaDesc, t("technologies.ctaDesc"))}
              </p>
              <Link
                to="/produits"
                className="group inline-flex items-center gap-2 mt-8 bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] font-semibold px-8 py-4 rounded-full transition-colors font-sans"
              >
                {tx(tp.ctaButton, t("technologies.viewFullCatalog"))}
                <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}