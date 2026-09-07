import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { products } from "../data"

const compatibleProducts = products.filter((p) => p.connectivity)

function ArrowIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

export default function SmartHomePage() {
  const { t } = useTranslation()

  const features = t("smartHome.features.items", {
    returnObjects: true,
  }) as Array<{ title: string; desc: string }>

  const featureIcons = ["📱", "🎙️", "⚡", "📊", "🔔", "🛡️"]

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-24">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative bg-[#0A2463] overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#1E5EF3] blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#1E5EF3] blur-2xl translate-y-1/2 -translate-x-1/4" />
        </div>
        {/* Grille décorative */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2.5 bg-[#1E5EF3]/20 border border-[#1E5EF3]/30 rounded-full px-4 py-2 mb-8 shadow-lg backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E5EF3] animate-pulse-dot" />
              <span
                className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#4d8dff]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                AUREX SmartConnect
              </span>
            </div>
            <h1
              className="text-5xl lg:text-7xl font-bold text-white leading-tight"
              style={{ fontFamily: "var(--font-display)", whiteSpace: "pre-line" }}
            >
              {t("smartHome.hero.title")}
            </h1>
            <p
              className="text-blue-100/80 text-base leading-relaxed mt-6 max-w-lg"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {t("smartHome.hero.desc")}
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href="#app"
                className="group inline-flex items-center gap-2 bg-[#1E5EF3] hover:bg-[#1a51d4] text-white font-semibold px-7 py-4 rounded-xl transition-all text-sm font-sans shadow-lg shadow-[#1E5EF3]/30 hover:-translate-y-0.5"
              >
                {t("smartHome.hero.downloadApp")}
                <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              <Link
                to="/produits"
                className="inline-flex items-center gap-2 text-white/80 border border-white/30 font-medium px-7 py-4 rounded-xl hover:bg-white/10 hover:border-white/60 hover:-translate-y-0.5 transition-all text-sm font-sans backdrop-blur-sm"
              >
                {t("smartHome.hero.compatibleProducts")}
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-[#1E5EF3]/40 to-transparent blur-xl" />
            <img
              src="https://images.unsplash.com/photo-1558002038-1055907df827?w=700&h=800&fit=crop&auto=format"
              alt=""
              className="relative w-full rounded-3xl shadow-2xl object-cover animate-float"
            />
            {/* Carte machine terminée */}
            <div className="absolute -left-6 top-1/4 bg-white rounded-2xl p-4 shadow-2xl flex items-center gap-3 animate-float" style={{ animationDelay: "1.2s" }}>
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900 font-sans">{t("smartHome.hero.washerDone")}</p>
                <p className="text-xs text-green-600 font-sans">{t("smartHome.hero.cycle60")}</p>
              </div>
            </div>
            {/* Carte consommation */}
            <div className="absolute -right-4 bottom-1/4 bg-white rounded-2xl p-4 shadow-2xl animate-float" style={{ animationDelay: "2.4s" }}>
              <p className="text-xs text-gray-500 font-sans mb-2">{t("smartHome.hero.todayConsumption")}</p>
              <div className="flex items-end gap-1">
                {[30, 55, 40, 70, 45, 85, 60].map((h, i) => (
                  <div
                    key={i}
                    className="w-3 rounded-t transition-all duration-300 hover:opacity-80"
                    style={{
                      height: `${h * 0.4}px`,
                      background: i === 5 ? "#1E5EF3" : "#E2E8F0",
                    }}
                  />
                ))}
              </div>
              <p className="text-xs font-bold text-[#0A2463] mt-2 font-display">{t("smartHome.hero.kwh")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 3 ÉTAPES ═══════════ */}
      <section className="py-16 bg-white border-b border-[#E8EDF4]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", icon: "📲", title: t("smartHome.app.subtitle") && t("smartHome.steps.scan", { defaultValue: "Scannez le QR code" }), desc: t("smartHome.steps.scanDesc", { defaultValue: "Sur votre appareil AUREX, scannez pour connecter en 30 secondes" }) },
            { step: "02", icon: "🔗", title: t("smartHome.steps.connect", { defaultValue: "Connectez votre Wi-Fi" }), desc: t("smartHome.steps.connectDesc", { defaultValue: "Vos appareils rejoignent votre foyer numérique automatiquement" }) },
            { step: "03", icon: "🎛️", title: t("smartHome.steps.control", { defaultValue: "Pilotez tout" }), desc: t("smartHome.steps.controlDesc", { defaultValue: "Programmes, automatisations et suivi énergie depuis l'app" }) },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-5 group">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-[#EFF3FB] flex items-center justify-center text-2xl group-hover:bg-[#1E5EF3] group-hover:scale-110 transition-all duration-300 shadow-sm">
                  {s.icon}
                </div>
                <span className="absolute -top-2 -right-2 text-[10px] font-bold text-[#1E5EF3] bg-white border border-[#E2E8F0] rounded-full px-1.5 py-0.5 shadow-sm">
                  {s.step}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0A2463] font-display">{s.title}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed font-sans">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span
            className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1E5EF3]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("smartHome.features.subtitle")}
          </span>
          <h2
            className="text-4xl font-bold text-[#0A2463] mt-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("smartHome.features.title")}
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto font-sans text-sm leading-relaxed">
            {t("smartHome.features.desc")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-xl hover:shadow-[#1E5EF3]/10 hover:border-[#1E5EF3]/40 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-[#1E5EF3]/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <span className="inline-flex w-12 h-12 items-center justify-center rounded-xl bg-[#EFF3FB] text-2xl group-hover:bg-[#1E5EF3] group-hover:scale-110 transition-all duration-300 shadow-sm">
                  {featureIcons[idx]}
                </span>
                <h3
                  className="text-base font-bold text-[#0A2463] mt-4 mb-2 group-hover:text-[#1E5EF3] transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {feat.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed font-sans">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ PRODUITS COMPATIBLES ═══════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span
                className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1E5EF3]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                SmartConnect
              </span>
              <h2
                className="text-4xl font-bold text-[#0A2463] mt-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {t("smartHome.compatible.title")}
              </h2>
            </div>
            <Link
              to="/produits"
              className="group text-sm text-[#1E5EF3] font-medium font-sans hidden md:flex items-center gap-1.5 hover:text-[#0A2463] transition-colors"
            >
              {t("smartHome.compatible.seeAll")}
              <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {compatibleProducts.map((p) => (
              <Link
                key={p.id}
                to={`/produits/${p.category}/${p.id}`}
                className="group flex gap-4 bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-xl hover:shadow-[#0A2463]/10 hover:border-[#1E5EF3]/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                    {p.reference}
                  </p>
                  <h3 className="text-sm font-semibold text-gray-900 mt-1 group-hover:text-[#0A2463] transition-colors font-sans line-clamp-2">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-2 bg-[#1E5EF3]/10 rounded-full px-2.5 py-1 w-fit">
                    <svg
                      className="w-3 h-3 text-[#1E5EF3]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                      />
                    </svg>
                    <span className="text-[10px] text-[#1E5EF3] font-semibold font-sans">
                      {t("common.smartConnect")}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ TÉMOIGNAGE ═══════════ */}
      <section className="py-20 max-w-4xl mx-auto px-6">
        <div className="relative bg-gradient-to-br from-[#0A2463] to-[#1E5EF3] rounded-3xl p-10 lg:p-14 text-center overflow-hidden shadow-2xl shadow-[#0A2463]/30">
          <div className="absolute top-0 left-0 text-8xl text-white/10 font-display select-none leading-none px-6">"</div>
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <div className="flex justify-center gap-1 mb-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="w-5 h-5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.539 1.118l-3.975-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.075 10.1c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              ))}
            </div>
            <blockquote
              className="text-xl lg:text-2xl font-semibold text-white leading-relaxed font-sans"
            >
              {t("smartHome.testimonial.quote", {
                defaultValue: "J'ai réduit ma facture d'énergie de 25% et je lance la lessive depuis le bureau. SmartConnect a vraiment changé mon quotidien.",
              })}
            </blockquote>
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg font-bold text-white font-display">
                A
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-white font-sans">
                  {t("smartHome.testimonial.author", { defaultValue: "Amine B." })}
                </p>
                <p className="text-xs text-blue-200 font-sans">
                  {t("smartHome.testimonial.city", { defaultValue: "Alger — Client AUREX depuis 2024" })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ APP CTA ═══════════ */}
      <section id="app" className="py-24 bg-[#0A2463] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#1E5EF3] blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-[#1E5EF3] blur-2xl" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <span
            className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#4d8dff]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("smartHome.app.subtitle")}
          </span>
          <h2
            className="text-4xl font-bold text-white mt-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("smartHome.app.title")}
          </h2>
          <p className="text-blue-100/80 mt-4 text-sm leading-relaxed font-sans max-w-xl mx-auto">
            {t("smartHome.app.desc")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <a
              href="#"
              className="group flex items-center gap-3 bg-white text-[#0A2463] px-6 py-3 rounded-2xl hover:bg-blue-50 hover:-translate-y-1 transition-all duration-300 shadow-xl"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z" />
              </svg>
              <div className="text-left">
                <p className="text-[9px] text-gray-500 font-sans leading-none">Télécharger sur</p>
                <p className="text-sm font-bold font-sans leading-tight">App Store</p>
              </div>
            </a>
            <a
              href="#"
              className="group flex items-center gap-3 bg-white text-[#0A2463] px-6 py-3 rounded-2xl hover:bg-blue-50 hover:-translate-y-1 transition-all duration-300 shadow-xl"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.6 1.8 13.7 12 3.6 22.2c-.4-.2-.6-.6-.6-1.1V2.9c0-.5.2-.9.6-1.1Zm12.5 8.7 2.8-2.8L5.8 1.9l10.3 8.6Zm0 3-10.3 8.6 13.1-6.2-2.8-2.4Zm4.2-3.2c.8.4.8 1.7 0 2.1l-2.6 1.2-3-2.7 3-2.7 2.6 2.1Z" />
              </svg>
              <div className="text-left">
                <p className="text-[9px] text-gray-500 font-sans leading-none">Disponible sur</p>
                <p className="text-sm font-bold font-sans leading-tight">Google Play</p>
              </div>
            </a>
          </div>
          <p className="text-xs text-blue-200/60 mt-6 font-sans flex items-center justify-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {t("smartHome.app.secure", { defaultValue: "Compatible iOS 14+ et Android 10+ — Connexion chiffrée" })}
          </p>
        </div>
      </section>
    </div>
  )
}