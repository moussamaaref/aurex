import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

function ArrowIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

/* ── Révélation douce au scroll ── */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

export default function AboutPage() {
  const { t } = useTranslation()

  const values = (t("about.values.items", { returnObjects: true }) as Array<{
    title: string
    desc: string
  }>).map((v, i) => ({ ...v, icon: ["⚡", "🌱", "🤝", "🏆"][i] }))
  const milestones = t("about.history.milestones", {
    returnObjects: true,
  }) as Array<{ year: string; title: string; desc: string }>
  const introduction = t("about.introduction", {
    returnObjects: true,
  }) as string[]

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-24">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden min-h-[480px] flex items-end">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1600&h=600&fit=crop&auto=format"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061540]/90 via-[#0A2463]/60 to-[#0A2463]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061540]/70 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 w-full">
          <span
            className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#4d8dff] animate-fade-in"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("about.hero.subtitle")}
          </span>
          <h1
            className="text-5xl lg:text-7xl font-bold text-white mt-3 leading-tight animate-slide-up"
            style={{ fontFamily: "var(--font-display)", whiteSpace: "pre-line" }}
          >
            {t("about.hero.title")}
          </h1>
          <p className="text-blue-100/80 mt-5 max-w-xl leading-relaxed font-sans delay-200 animate-slide-up">
            {t("about.hero.desc")}
          </p>
        </div>
      </section>

      {/* ═══════════ BANDE STATS ═══════════ */}
      <section className="bg-white border-b border-[#E8EDF4]">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:divide-x md:divide-[#E8EDF4]">
          {[
            { value: "30+", label: t("about.stats.years", { defaultValue: "Années d'expertise" }) },
            { value: "120+", label: t("about.stats.products", { defaultValue: "Références produits" }) },
            { value: "48", label: t("about.stats.sales", { defaultValue: "Points de vente" }) },
            { value: "500+", label: t("about.stats.employees", { defaultValue: "Collaborateurs" }) },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="md:pl-8 first:pl-0 text-center md:text-left group">
              <p className="text-3xl font-bold text-[#0A2463] font-display group-hover:text-[#1E5EF3] transition-colors">
                {s.value}
              </p>
              <p className="text-xs text-[#64748B] mt-1 font-sans">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════ INTRODUCTION ═══════════ */}
      <section className="bg-[#F9FAFB] py-16">
        <div className="mx-auto max-w-4xl px-6">
          <Reveal>
            <div className="relative rounded-3xl border border-blue-100 bg-white p-8 sm:p-12 shadow-xl shadow-[#0A2463]/5 overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#1E5EF3] to-[#0A2463]" />
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#1E5EF3]/5 blur-2xl" />
              <span
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1E5EF3]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {t("about.introductionTitle")}
              </span>
              <div className="mt-5 space-y-4 text-sm leading-8 text-gray-600 font-sans">
                {introduction.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-8 border-t border-blue-50 pt-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0A2463] to-[#1E5EF3] flex items-center justify-center text-white font-bold font-display text-lg shadow-lg shadow-[#1E5EF3]/30">
                  A
                </div>
                <p>
                  <span className="block text-lg font-bold text-[#0A2463] font-display">AUREX</span>
                  <span className="block text-sm font-medium text-[#1E5EF3] font-sans">
                    {t("about.tagline")}
                  </span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ MISSION ═══════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div>
              <span
                className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1E5EF3]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {t("about.mission.subtitle")}
              </span>
              <h2
                className="text-4xl font-bold text-[#0A2463] mt-3 leading-tight"
                style={{ fontFamily: "var(--font-display)", whiteSpace: "pre-line" }}
              >
                {t("about.mission.title")}
              </h2>
              <p className="text-gray-600 mt-5 leading-relaxed font-sans text-sm">
                {t("about.mission.desc1")}
              </p>
              <p className="text-gray-600 mt-4 leading-relaxed font-sans text-sm">
                {t("about.mission.desc2")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/produits"
                  className="group inline-flex items-center gap-2 bg-[#1E5EF3] text-white font-semibold px-7 py-4 rounded-xl text-sm font-sans hover:bg-[#1a51d4] transition-all shadow-lg shadow-[#1E5EF3]/25 hover:-translate-y-0.5"
                >
                  {t("about.mission.seeProducts")}
                  <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/support"
                  className="inline-flex items-center gap-2 border border-[#0A2463]/20 text-[#0A2463] font-medium px-7 py-4 rounded-xl text-sm font-sans hover:bg-[#EFF3FB] hover:-translate-y-0.5 transition-all"
                >
                  {t("about.mission.savContact")}
                </Link>
              </div>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-[#1E5EF3]/20 to-transparent blur-xl" />
              <img
                src="https://images.unsplash.com/photo-1639405069836-f82aa6dcb900?w=700&h=700&fit=crop&auto=format"
                alt=""
                className="relative rounded-3xl w-full object-cover shadow-2xl"
              />
              <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl p-4 shadow-2xl flex items-center gap-3 animate-float">
                <div className="w-11 h-11 rounded-xl bg-[#EFF3FB] flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#1E5EF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0A2463] font-sans">
                    {t("about.quality.badge", { defaultValue: "Qualité certifiée" })}
                  </p>
                  <p className="text-[10px] text-gray-400 font-sans">
                    {t("about.quality.badgeSub", { defaultValue: "ISO 9001 — Normes internationales" })}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ VALEURS ═══════════ */}
      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="text-center mb-14">
            <span
              className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1E5EF3]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t("about.values.subtitle")}
            </span>
            <h2
              className="text-4xl font-bold text-[#0A2463] mt-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t("about.values.title")}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((val, i) => (
              <Reveal key={val.title} delay={i * 100}>
                <div className="group bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-xl hover:shadow-[#1E5EF3]/10 hover:border-[#1E5EF3]/40 hover:-translate-y-1.5 transition-all duration-300 h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-[#1E5EF3]/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative inline-flex w-12 h-12 items-center justify-center rounded-xl bg-[#EFF3FB] text-2xl group-hover:bg-[#1E5EF3] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                    {val.icon}
                  </span>
                  <h3
                    className="relative text-lg font-bold text-[#0A2463] mt-4 mb-2 group-hover:text-[#1E5EF3] transition-colors"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {val.title}
                  </h3>
                  <p className="relative text-sm text-gray-500 leading-relaxed font-sans">{val.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ HISTOIRE / TIMELINE ═══════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal className="text-center mb-14">
            <span
              className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1E5EF3]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t("about.history.subtitle")}
            </span>
            <h2
              className="text-4xl font-bold text-[#0A2463] mt-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t("about.history.title")}
            </h2>
          </Reveal>
          <div className="relative">
            {/* Ligne dégradée animée */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-[#1E5EF3]/40 via-[#E2E8F0] to-transparent" />
            <div className="space-y-10">
              {milestones.map((m, i) => {
                const left = i % 2 === 0
                return (
                  <Reveal key={m.year} delay={i * 80}>
                    <div
                      className={`relative flex gap-8 items-start ${
                        i % 2 !== 0 ? "md:flex-row-reverse" : ""
                      }`}
                    >
                      <div className={`flex-1 ${i % 2 !== 0 ? "md:text-right" : ""}`}>
                        <div className="group bg-[#F9FAFB] rounded-2xl border border-gray-100 p-5 hover:border-[#1E5EF3]/40 hover:bg-white hover:shadow-lg hover:shadow-[#1E5EF3]/10 transition-all duration-300">
                          <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#1E5EF3] font-display">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1E5EF3] animate-pulse-dot" />
                            {m.year}
                          </span>
                          <h4 className="font-bold text-[#0A2463] mt-1.5 font-display text-base group-hover:text-[#1E5EF3] transition-colors">
                            {m.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-2 leading-relaxed font-sans">{m.desc}</p>
                        </div>
                      </div>
                      <div className="relative z-10 flex-shrink-0 mt-6 hidden md:block">
                        <div className="w-4 h-4 rounded-full bg-[#1E5EF3] border-4 border-white shadow-md group-hover:scale-125 transition-transform" />
                      </div>
                      <div className="flex-1 hidden md:block" />
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CTA FINAL ═══════════ */}
      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="relative rounded-3xl bg-gradient-to-br from-[#0A2463] to-[#1E5EF3] p-12 lg:p-16 text-center overflow-hidden shadow-2xl shadow-[#0A2463]/30">
              <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#1E5EF3]/40 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
              <div className="relative">
                <h2
                  className="text-3xl lg:text-5xl font-bold text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {t("about.cta.title", {
                    defaultValue: "Prêt à équiper votre foyer ?",
                  })}
                </h2>
                <p className="text-blue-100/80 mt-4 max-w-xl mx-auto font-sans text-sm leading-relaxed">
                  {t("about.cta.desc", {
                    defaultValue: "Découvrez la gamme complète AUREX et trouvez l'appareil parfait pour votre maison.",
                  })}
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                  <Link
                    to="/produits"
                    className="group inline-flex items-center gap-2 bg-white text-[#0A2463] font-semibold px-8 py-4 rounded-xl text-sm font-sans hover:bg-blue-50 hover:-translate-y-0.5 transition-all shadow-xl"
                  >
                    {t("about.cta.button", { defaultValue: "Découvrir le catalogue" })}
                    <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/support"
                    className="inline-flex items-center gap-2 text-white border border-white/40 font-medium px-8 py-4 rounded-xl text-sm font-sans hover:bg-white/10 hover:-translate-y-0.5 transition-all backdrop-blur-sm"
                  >
                    {t("about.cta.support", { defaultValue: "Contacter le SAV" })}
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}