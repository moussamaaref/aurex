import { useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { technologies, products } from "../data"

function ArrowIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

export default function TechnologiesPage() {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeTech, setActiveTech] = useState<string | null>(null)

  const filterCategories = [
    { key: "all", label: t("technologies.filters.all") },
    { key: "Connectivité", label: t("technologies.filters.connectivity") },
    { key: "Éco-efficacité", label: t("technologies.filters.ecoEfficiency") },
    { key: "Hygiène", label: t("technologies.filters.hygiene") },
    { key: "Conservation", label: t("technologies.filters.conservation") },
  ]

  const countFor = (key: string) =>
    key === "all" ? technologies.length : technologies.filter((t2) => t2.category === key).length

  const filtered =
    activeCategory === "all"
      ? technologies
      : technologies.filter((t2) => t2.category === activeCategory)

  const selectedTech = activeTech
    ? technologies.find((t2) => t2.id === activeTech)
    : null
  const compatibleProducts = selectedTech
    ? products.filter((p) => selectedTech.compatibleCategories.includes(p.category))
    : []

  const stats = [
    { value: "12+", label: t("technologies.stats.patented") },
    { value: "40%", label: t("technologies.stats.energySavings") },
    { value: "3×", label: t("technologies.stats.freshCoolDuration") },
    { value: "10 ans", label: t("technologies.stats.inverterWarranty") },
  ]

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-24">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative bg-[#0A2463] overflow-hidden py-20 lg:py-24">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#1E5EF3] blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#1E5EF3] blur-2xl translate-y-1/2 -translate-x-1/4" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <span
              className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#4d8dff]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t("technologies.hero.subtitle")}
            </span>
            <h1
              className="text-5xl lg:text-6xl font-bold text-white mt-3 leading-tight"
              style={{ fontFamily: "var(--font-display)", whiteSpace: "pre-line" }}
            >
              {t("technologies.hero.title")}
            </h1>
            <p className="text-blue-100/80 mt-5 leading-relaxed font-sans text-base">
              {t("technologies.hero.desc")}
            </p>
          </div>
          {/* Stats dans le hero sombre */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14 pt-8 border-t border-white/10">
            {stats.map((stat, i) => (
              <div key={stat.label} className="group">
                <p
                  className="text-3xl lg:text-4xl font-bold text-white font-display flex items-center gap-2"
                >
                  <span className="w-1 h-8 rounded-full bg-[#1E5EF3] group-hover:h-10 transition-all duration-300" style={{ transitionDelay: `${i * 50}ms` }} />
                  {stat.value}
                </p>
                <p className="text-xs text-blue-200/70 mt-1.5 font-sans">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FILTRES STICKY ═══════════ */}
      <div className="sticky top-20 z-20 bg-[#F9FAFB]/90 backdrop-blur-md border-b border-gray-100 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 overflow-x-auto">
          {filterCategories.map((cat) => {
            const active = activeCategory === cat.key
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all font-sans ${
                  active
                    ? "bg-[#1E5EF3] text-white shadow-lg shadow-[#1E5EF3]/30"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-[#1E5EF3]/50 hover:text-[#1E5EF3] hover:-translate-y-0.5"
                }`}
              >
                {cat.label}
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    active ? "bg-white/20 text-white" : "bg-[#EFF3FB] text-[#1E5EF3]"
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
          {filtered.map((tech) => {
            const open = activeTech === tech.id
            return (
              <button
                key={tech.id}
                onClick={() => setActiveTech(open ? null : tech.id)}
                className={`group text-left rounded-2xl overflow-hidden border transition-all duration-300 bg-white ${
                  open
                    ? "border-[#1E5EF3] shadow-xl shadow-[#1E5EF3]/15 ring-2 ring-[#1E5EF3]/20"
                    : "border-gray-100 hover:shadow-xl hover:shadow-[#0A2463]/10 hover:border-[#1E5EF3]/30 hover:-translate-y-1.5"
                }`}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={tech.image}
                    alt={tech.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A2463]/80 via-[#0A2463]/10 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-white bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/25 font-display">
                      {tech.category}
                    </span>
                  </div>
                  {/* Indicateur d'expansion */}
                  <div
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 ${
                      open ? "bg-[#1E5EF3] text-white rotate-180" : "bg-white/15 text-white border border-white/25"
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between gap-3">
                    <h3 className="text-xl font-bold text-white font-display">{tech.name}</h3>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-[#1E5EF3]/10 flex items-center justify-center group-hover:bg-[#1E5EF3] group-hover:scale-110 transition-all duration-300">
                      <svg className="w-3.5 h-3.5 text-[#1E5EF3] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <p className="text-xs font-semibold text-[#1E5EF3] font-sans">{tech.benefit}</p>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed font-sans line-clamp-3">
                    {tech.description}
                  </p>

                  {/* Expansion animée */}
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-3 font-display">
                          {t("technologies.productsWith", { name: tech.name })}
                        </p>
                        <div className="space-y-1.5">
                          {compatibleProducts.length > 0 ? (
                            <>
                              {compatibleProducts.slice(0, 2).map((p) => (
                                <Link
                                  key={p.id}
                                  to={`/produits/${p.category}/${p.id}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="group/p flex items-center gap-3 hover:bg-[#EFF3FB] rounded-xl p-2 transition-colors border border-transparent hover:border-[#1E5EF3]/20"
                                >
                                  <img src={p.image} alt={p.name} className="w-11 h-11 object-cover rounded-lg shadow-sm" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold text-gray-900 font-sans truncate group-hover/p:text-[#0A2463] transition-colors">
                                      {p.name}
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-mono">{p.reference}</p>
                                  </div>
                                  <ArrowIcon className="w-3.5 h-3.5 text-[#1E5EF3] flex-shrink-0 opacity-0 group-hover/p:opacity-100 transition-opacity" />
                                </Link>
                              ))}
                              {compatibleProducts.length > 2 && (
                                <Link
                                  to="/produits"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1E5EF3] hover:text-[#0A2463] px-2 pt-1 font-sans transition-colors"
                                >
                                  +{compatibleProducts.length - 2} {t("technologies.more", { defaultValue: "autres" })}
                                  <ArrowIcon className="w-3 h-3" />
                                </Link>
                              )}
                            </>
                          ) : (
                            <p className="text-xs text-gray-500 font-sans">{t("technologies.comingSoon")}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-3xl bg-gradient-to-br from-[#0A2463] to-[#1E5EF3] p-12 lg:p-16 text-center overflow-hidden shadow-2xl shadow-[#0A2463]/30">
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#1E5EF3]/40 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
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
                {t("technologies.ctaTitle")}
              </h2>
              <p className="text-blue-100/80 mt-4 max-w-xl mx-auto font-sans text-sm leading-relaxed">
                {t("technologies.ctaDesc")}
              </p>
              <Link
                to="/produits"
                className="group inline-flex items-center gap-2 mt-8 bg-white text-[#0A2463] hover:bg-blue-50 font-semibold px-8 py-4 rounded-xl transition-all font-sans shadow-xl hover:-translate-y-0.5"
              >
                {t("technologies.viewFullCatalog")}
                <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}