import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { newsItems } from "../data"
import { loadRemoteCollection } from "../lib/contentStore"
import { ml } from "../lib/ml"
import { tx } from "../lib/langText"

/* ── Icône flèche réutilisable ── */
function ArrowIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

export type NewsPageData = {
  newsHeroEyebrow?: string
  newsHeroTitle?: string
  newsHeroDesc?: string
  newsStatArticles?: string
  newsStatCategories?: string
  newsSectionEyebrow?: string
  newsSectionTitle?: string
  newsFilterAll?: string
  newsFeaturedBadge?: string
  newsFeaturedReadTime?: string
  newsCardReadTime?: string
  newsEmpty?: string
  newsSupportEyebrow?: string
  newsSupportTitle?: string
  newsSupportButton?: string
  is_active?: boolean
}
const defaultNewsPage: NewsPageData = {}
function normalizeNewsPage(raw: unknown): NewsPageData {
  if (!Array.isArray(raw) || raw.length === 0) return defaultNewsPage
  const first = (raw as NewsPageData[]).find((c) => c && typeof c === "object" && c.is_active !== false)
  return first ?? defaultNewsPage
}

export default function NewsPage() {
  const { t, i18n } = useTranslation()
  const [category, setCategory] = useState("all")
  const [np, setNp] = useState<NewsPageData>(() => {
    try {
      const raw = localStorage.getItem("aurex-data-newsPage")
      if (raw) return normalizeNewsPage(JSON.parse(raw))
    } catch {
      // ignore
    }
    return defaultNewsPage
  })

  useEffect(() => {
    void loadRemoteCollection<NewsPageData>("newsPage").then((remote) => {
      if (remote && Array.isArray(remote) && remote.length > 0) {
        const normalized = normalizeNewsPage(remote)
        setNp(normalized)
        localStorage.setItem("aurex-data-newsPage", JSON.stringify([normalized]))
      }
    }).catch(() => {})
  }, [])

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(newsItems.map((item) => ml(item.category))))],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [i18n.language],
  )
  const visibleNews =
    category === "all"
      ? newsItems
      : newsItems.filter((item) => ml(item.category) === category)
  const featured = visibleNews[0]
  const remaining = visibleNews.slice(1)

  return (
    <div className="bg-[#F9FAFB] pt-28">

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden bg-[#0A2463] text-white">
        {/* Arrière-plan dégradé */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(30,94,243,0.55),transparent_40%),linear-gradient(120deg,#061540,#0A2463)]" />
        {/* Cercles décoratifs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#1E5EF3]/10 blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-64 h-64 rounded-full bg-[#1E5EF3]/10 blur-2xl translate-y-1/2 pointer-events-none" />
        {/* Grille décorative */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          {/* Eyebrow pill */}
          <span
            className="inline-flex items-center gap-2.5 text-[10px] font-bold tracking-[0.22em] uppercase text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6 shadow-lg"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E5EF3] animate-pulse" />
            {tx(np.newsHeroEyebrow, t("newsPage.eyebrow"))}
          </span>

          <h1
            className="max-w-3xl text-5xl md:text-7xl font-bold leading-[0.95] mt-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {tx(np.newsHeroTitle, t("newsPage.title"))}
          </h1>
          <p className="max-w-xl text-base md:text-lg text-blue-100/80 leading-relaxed mt-6">
            {tx(np.newsHeroDesc, t("newsPage.description"))}
          </p>

          {/* Mini-stats */}
          <div className="mt-10 flex flex-wrap gap-8 border-t border-white/10 pt-8">
            <div>
              <p className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                {newsItems.length}
              </p>
              <p className="text-xs text-blue-200 mt-0.5 uppercase tracking-wider">{tx(np.newsStatArticles, t("newsPage.statsArticles"))}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                {new Set(newsItems.map((n) => n.category)).size}
              </p>
              <p className="text-xs text-blue-200 mt-0.5 uppercase tracking-wider">{tx(np.newsStatCategories, t("newsPage.statsCategories"))}</p>
            </div>
          </div>
        </div>

        {/* Vague de transition */}
        <div className="relative h-10 overflow-hidden">
          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
            <path d="M0,40 C360,0 1080,0 1440,40 L1440,40 L0,40 Z" fill="#F9FAFB" />
          </svg>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-16">

        {/* ═══════════ EN-TÊTE + FILTRES ═══════════ */}
        <div className="flex flex-wrap items-center justify-between gap-5 mb-10">
          <div>
            <p
              className="text-xs uppercase tracking-[0.2em] text-[#1E5EF3] font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {tx(np.newsSectionEyebrow, t("newsPage.latest"))}
            </p>
            <h2
              className="text-3xl md:text-4xl text-[#0A2463] font-bold mt-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {tx(np.newsSectionTitle, t("newsPage.allNews"))}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2" aria-label={t("newsPage.filters")}>
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full px-5 py-2 text-xs font-semibold transition-all duration-200 ${
                  category === item
                    ? "bg-[#0A2463] text-white shadow-lg shadow-[#0A2463]/20 scale-105"
                    : "bg-white text-[#64748B] border border-[#E2E8F0] hover:border-[#1E5EF3] hover:text-[#1E5EF3] hover:shadow-sm"
                }`}
              >
                {item === "all" ? tx(np.newsFilterAll, t("newsPage.all")) : item}
              </button>
            ))}
          </div>
        </div>

        {/* ═══════════ ARTICLE À LA UNE ═══════════ */}
        {featured && (
          <article className="group grid lg:grid-cols-[1.15fr_0.85fr] bg-white rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-[0_20px_60px_rgba(10,36,99,0.09)] mb-8 hover:shadow-[0_28px_80px_rgba(10,36,99,0.14)] transition-shadow duration-500">
            {/* Image */}
            <div className="relative min-h-[280px] lg:min-h-[400px] overflow-hidden">
              <img
                src={featured.image}
                alt={ml(featured.title)}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A2463]/40 via-transparent to-transparent" />
              {/* Badge */}
              <span className="absolute top-5 left-5 inline-flex items-center gap-2 bg-[#1E5EF3] text-white rounded-full px-4 py-2 text-[10px] uppercase tracking-widest font-bold shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                {tx(np.newsFeaturedBadge, t("newsPage.featured"))}
              </span>
              {/* Catégorie overlay */}
              <span className="absolute bottom-5 left-5 bg-white/20 backdrop-blur-md text-white rounded-full px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold border border-white/30">
                {ml(featured.category)}
              </span>
            </div>

            {/* Contenu */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <p className="text-xs text-[#94A3B8] font-mono">{ml(featured.date)}</p>
              <h3
                className="text-3xl md:text-[2rem] leading-tight text-[#0A2463] font-bold mt-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {ml(featured.title)}
              </h3>
              {/* Trait animé */}
              <div className="w-10 h-0.5 bg-[#1E5EF3] mt-5 mb-5 group-hover:w-16 transition-all duration-500" />
              <p className="text-[#64748B] leading-relaxed text-sm">{ml(featured.excerpt)}</p>
              <div className="mt-8 flex items-center gap-4">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E5EF3] group-hover:gap-3 transition-all duration-300">
                  {t("common.seeMore")}
                  <ArrowIcon className="w-4 h-4" />
                </span>
                <span className="h-4 w-px bg-[#E2E8F0]" />
                <span className="text-xs text-[#94A3B8]">{tx(np.newsFeaturedReadTime, t("newsPage.readTimeFeatured"))}</span>
              </div>
            </div>
          </article>
        )}

        {/* ═══════════ GRILLE D'ARTICLES ═══════════ */}
        {remaining.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {remaining.map((news, idx) => (
              <article
                key={news.id}
                className="group bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#0A2463]/10 hover:border-transparent transition-all duration-300 flex flex-col"
                style={{ transitionDelay: `${idx * 30}ms` }}
              >
                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden flex-shrink-0">
                  <img
                    src={news.image}
                    alt={ml(news.title)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A2463]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="absolute top-3 left-3 bg-[#0A2463]/90 backdrop-blur-sm text-white rounded-full px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold">
                    {ml(news.category)}
                  </span>
                  {/* Bouton flottant hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <ArrowIcon className="w-5 h-5 text-[#0A2463]" />
                    </div>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-xs text-[#94A3B8] font-mono">{ml(news.date)}</p>
                  <h3
                    className="text-lg text-[#0A2463] font-bold leading-snug mt-2 group-hover:text-[#1E5EF3] transition-colors duration-200 line-clamp-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {ml(news.title)}
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed mt-3 line-clamp-2 flex-1">{ml(news.excerpt)}</p>
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#F1F5F9]">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E5EF3]">
                      {t("common.seeMore")}
                      <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                    </span>
                    <span className="text-xs text-[#CBD5E1]">{tx(np.newsCardReadTime, t("newsPage.readTimeCard"))}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ═══════════ ÉTAT VIDE ═══════════ */}
        {visibleNews.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white py-20 text-center">
            <div className="w-14 h-14 bg-[#EFF3FB] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <p className="text-[#64748B] font-medium">{tx(np.newsEmpty, t("newsPage.empty"))}</p>
          </div>
        )}

        {/* ═══════════ BANNIÈRE SUPPORT ═══════════ */}
        <section className="mt-16 relative overflow-hidden rounded-3xl bg-[#0A2463] p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-7">
          {/* Décors */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#1E5EF3]/20 blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#1E5EF3]/10 blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="relative">
            <p
              className="text-xs uppercase tracking-[0.2em] text-[#A9C4FF] font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {tx(np.newsSupportEyebrow, t("newsPage.needHelp"))}
            </p>
            <h2
              className="text-2xl md:text-3xl text-white font-bold mt-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {tx(np.newsSupportTitle, t("newsPage.supportTitle"))}
            </h2>
          </div>
          <Link
            to="/support"
            className="relative shrink-0 inline-flex items-center gap-2.5 justify-center rounded-xl bg-white text-[#0A2463] px-7 py-4 text-sm font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {tx(np.newsSupportButton, t("newsPage.supportAction"))}
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </section>
      </main>
    </div>
  )
}
