import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { categories, products, technologies, newsItems } from "../data"

/* ─────────────────────────────────────────────
   CSS à ajouter dans index.css (si absent) :

   @keyframes ken-burns { 0%{transform:scale(1)} 100%{transform:scale(1.12)} }
   .animate-ken-burns{ animation:ken-burns 8s ease-out forwards; }
   @keyframes fade-in { from{opacity:0} to{opacity:1} }
   .animate-fade-in{ animation:fade-in .6s ease-out both; }
   @keyframes slide-up { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
   .animate-slide-up{ animation:slide-up .7s cubic-bezier(.22,1,.36,1) both; }
   .delay-200{animation-delay:.2s} .delay-400{animation-delay:.4s}
   @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
   .animate-float{ animation:float 6s ease-in-out infinite; }
   @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
   .animate-marquee{ animation:marquee 30s linear infinite; }
   @keyframes pulse-dot { 0%,100%{box-shadow:0 0 0 0 rgba(30,94,243,.5)} 50%{box-shadow:0 0 0 8px rgba(30,94,243,0)} }
   .animate-pulse-dot{ animation:pulse-dot 2s ease-in-out infinite; }
───────────────────────────────────────────── */

const heroSlidesData = [
  {
    tagKey: "home.hero.0.tag",
    titleKey: "home.hero.0.title",
    subKey: "home.hero.0.subtitle",
    ctaKey: "home.hero.0.cta",
    ctaSecKey: "home.hero.0.ctaSec",
    ctaHref: "/produits",
    ctaSecHref: "/smart-home",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1600&h=900&fit=crop&auto=format",
  },
  {
    tagKey: "home.hero.1.tag",
    titleKey: "home.hero.1.title",
    subKey: "home.hero.1.subtitle",
    ctaKey: "home.hero.1.cta",
    ctaSecKey: "home.hero.1.ctaSec",
    ctaHref: "/smart-home",
    ctaSecHref: "/produits",
    image:
      "https://images.unsplash.com/photo-1639405069836-f82aa6dcb900?w=1600&h=900&fit=crop&auto=format",
  },
  {
    tagKey: "home.hero.2.tag",
    titleKey: "home.hero.2.title",
    subKey: "home.hero.2.subtitle",
    ctaKey: "home.hero.2.cta",
    ctaSecKey: "home.hero.2.ctaSec",
    ctaHref: "/produits/refrigerateurs",
    ctaSecHref: "/technologies",
    image:
      "https://images.unsplash.com/photo-1588854337115-1c67d9247e4d?w=1600&h=900&fit=crop&auto=format",
  },
]

/* ── Compteur animé au scroll ── */
function CountUp({ target, suffix = "", duration = 1400 }: { target: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const t0 = performance.now()
          const tick = (now: number) => {
            const p = Math.min((now - t0) / duration, 1)
            setValue(Math.round(target * (1 - Math.pow(1 - p, 3))))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  )
}

function EnergyBadge({ cls }: { cls: string }) {
  const color =
    cls === "A+++"
      ? "bg-gradient-to-r from-green-500 to-emerald-500"
      : cls === "A++"
        ? "bg-green-500"
        : cls === "A+"
          ? "bg-lime-500"
          : "bg-yellow-500"
  return (
    <span
      className={`${color} text-white text-[10px] font-bold px-2 py-0.5 rounded-md font-display tracking-wider shadow-sm`}
    >
      {cls}
    </span>
  )
}

function ProductCard({ product, index = 0 }: { product: (typeof products)[0]; index?: number }) {
  const { t } = useTranslation()
  const [liked, setLiked] = useState(false)
  const imageAt = (width: number) =>
    product.image
      .replace(/w=\d+/, `w=${width}`)
      .replace("auto=format", "auto=format&q=90&fm=webp")

  return (
    <Link
      to={`/produits/${product.category}/${product.id}`}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-[#0A2463]/10 hover:-translate-y-1.5 hover:border-gray-200 transition-all duration-300 flex flex-col"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 aspect-square overflow-hidden">
        <img
          src={product.image}
          srcSet={`${imageAt(800)} 1x, ${imageAt(1200)} 2x`}
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 42vw, 90vw"
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {/* Vignette douce */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A2463]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badges.map((badge) => (
            <span
              key={badge}
              className={`text-[10px] font-bold px-2 py-1 rounded-md font-display tracking-wider shadow-md backdrop-blur-sm
                ${badge === "Nouveau"
                  ? "bg-[#0A2463]/90 text-white"
                  : badge === "Promotion"
                    ? "bg-red-500 text-white"
                    : badge === "Best Seller"
                      ? "bg-amber-400 text-amber-900"
                      : "bg-[#1E5EF3]/90 text-white"
                }`}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Favori */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setLiked((v) => !v)
          }}
          aria-label="Favori"
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
        >
          <svg
            className={`w-4 h-4 transition-colors ${liked ? "text-red-500 fill-red-500" : "text-gray-400"}`}
            fill={liked ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {product.connectivity && (
          <div className="absolute bottom-3 right-3">
            <div
              className="flex items-center gap-1.5 bg-[#0A2463]/85 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-full shadow-md"
              title="SmartConnect"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse-dot" />
              SmartConnect
            </div>
          </div>
        )}

        {/* CTA flottant au survol */}
        <div className="absolute inset-x-3 bottom-3 translate-y-14 group-hover:translate-y-0 transition-transform duration-300">
          <div className="bg-[#1E5EF3] text-white text-xs font-semibold text-center py-2.5 rounded-lg shadow-lg shadow-[#1E5EF3]/40">
            {t("common.view")}
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase mb-1">
          {product.reference}
        </p>
        <h3 className="text-sm font-semibold text-gray-900 font-sans leading-snug mb-2 group-hover:text-[#0A2463] transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <EnergyBadge cls={product.energyClass} />
          {product.capacity && (
            <span className="text-xs text-gray-500 font-sans bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">
              {product.capacity}
            </span>
          )}
          {product.noiseLevel && (
            <span className="text-xs text-gray-500 font-sans bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">
              {product.noiseLevel}
            </span>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
          {product.price ? (
            <span className="text-base font-bold text-[#0A2463] font-display">
              {product.price.toLocaleString("fr-DZ")} DA
            </span>
          ) : (
            <span className="text-xs text-gray-400 font-sans">
              {t("common.priceOnRequest")}
            </span>
          )}
          <span className="w-7 h-7 rounded-full bg-[#1E5EF3]/10 text-[#1E5EF3] flex items-center justify-center group-hover:bg-[#1E5EF3] group-hover:text-white transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}

/* ── Flèche animée réutilisable ── */
function ArrowIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

export default function HomePage() {
  const { t } = useTranslation()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isPlaying) {
      setProgress(0)
      return
    }
    const start = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      setProgress(Math.min(elapsed / 6000, 1))
    }, 50)
    const t2 = setInterval(() => {
      setCurrentSlide((s) => (s + 1) % heroSlidesData.length)
      setProgress(0)
    }, 6000)
    return () => {
      clearInterval(interval)
      clearInterval(t2)
    }
  }, [isPlaying])

  const slide = heroSlidesData[currentSlide]

  const stats = [
    { value: 120, suffix: "+", label: t("home.stats.products") },
    { value: 6, suffix: "", label: t("home.stats.ranges") },
    { value: 48, suffix: "", label: t("home.stats.pointsOfSale") },
    { value: 10, suffix: " ans", label: t("home.stats.warranty") },
  ]

  return (
    <div className="bg-[#F9FAFB]">
      {/* ═══════════ HERO ═══════════ */}
      <section
        className="relative min-h-[680px] h-[min(100svh,900px)] flex items-end overflow-hidden"
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        <div className="absolute inset-0">
          {heroSlidesData.map((s, i) => (
            <img
              key={i}
              src={s.image}
              srcSet={`${s.image.replace("w=1600", "w=2400").replace("auto=format", "auto=format&q=90&fm=webp")} 1x, ${s.image.replace("w=1600", "w=3200").replace("auto=format", "auto=format&q=90&fm=webp")} 2x`}
              sizes="100vw"
              alt=""
              aria-hidden="true"
              fetchPriority={i === 0 ? "high" : "auto"}
              decoding="async"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                i === currentSlide ? "opacity-100 animate-ken-burns" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[#061540]/90 via-[#0A2463]/55 to-[#0A2463]/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061540]/80 via-transparent to-transparent" />
          {/* Grille décorative */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24 pt-40 w-full">
          <div className="max-w-2xl">
            <div key={currentSlide + "-tag"} className="animate-fade-in">
              <span
                className="inline-flex items-center gap-2.5 text-[10px] font-bold tracking-[0.2em] uppercase text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6 shadow-lg"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E5EF3] animate-pulse-dot" />
                {t(slide.tagKey)}
              </span>
            </div>

            <h1
              key={currentSlide + "-title"}
              className="text-5xl sm:text-7xl font-bold text-white leading-[0.95] tracking-tight mb-6 drop-shadow-md animate-slide-up"
              style={{ fontFamily: "var(--font-display)", whiteSpace: "pre-line" }}
            >
              {t(slide.titleKey)}
            </h1>

            <p
              key={currentSlide + "-sub"}
              className="text-base sm:text-lg text-white/70 leading-relaxed mb-8 delay-200 animate-slide-up"
              style={{ fontFamily: "var(--font-sans)", whiteSpace: "pre-line" }}
            >
              {t(slide.subKey)}
            </p>

            <div
              key={currentSlide + "-cta"}
              className="flex items-center gap-3 flex-wrap delay-400 animate-slide-up"
            >
              <Link
                to={slide.ctaHref}
                className="group/btn inline-flex items-center gap-2 bg-[#1E5EF3] hover:bg-[#1a51d4] text-white font-semibold px-7 py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-[#1E5EF3]/40 hover:-translate-y-0.5 text-sm"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {t(slide.ctaKey)}
                <ArrowIcon className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
              <Link
                to={slide.ctaSecHref}
                className="inline-flex items-center gap-2 text-white/90 hover:text-white border border-white/30 hover:border-white/70 font-medium px-7 py-4 rounded-xl transition-all text-sm backdrop-blur-md hover:bg-white/10"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {t(slide.ctaSecKey)}
              </Link>
            </div>
          </div>
        </div>

        {/* Indicateurs avec barre de progression */}
        <div className="absolute bottom-8 right-8 z-10 flex items-center gap-3">
          {heroSlidesData.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentSlide(i)
                setIsPlaying(false)
              }}
              className="group flex flex-col items-start gap-1"
              aria-label={`Slide ${i + 1}`}
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  i === currentSlide ? "w-10 h-1.5 bg-white/30" : "w-1.5 h-1.5 bg-white/40 group-hover:bg-white/70"
                }`}
              >
                {i === currentSlide && (
                  <span
                    className="block h-full rounded-full bg-white origin-left"
                    style={{ width: `${progress * 100}%` }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-fade-in">
          <span
            className="text-[10px] font-medium text-white/50 tracking-widest uppercase"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("home.scrollLabel")}
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </section>

      {/* ═══════════ STATS BAR ═══════════ */}
      <section className="bg-white border-b border-[#E8EDF4] relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#1E5EF3]/40 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 py-9 grid grid-cols-2 md:grid-cols-4 gap-6 md:divide-x md:divide-[#E8EDF4]">
          {stats.map((stat) => (
            <div key={stat.label} className="md:pl-8 first:pl-0 group">
              <p
                className="text-3xl lg:text-4xl font-bold text-[#0A2463] font-display transition-colors group-hover:text-[#1E5EF3]"
              >
                <CountUp target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs text-[#64748B] mt-1.5 font-sans flex items-center gap-2">
                <span className="w-3 h-px bg-[#1E5EF3] transition-all group-hover:w-6" />
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ MARQUEE PARTENAIRES / PROMESSES ═══════════ */}
      <section className="py-5 bg-[#0A2463] overflow-hidden border-y border-[#1E5EF3]/20">
        <div className="animate-marquee flex gap-12 whitespace-nowrap w-max">
          {[...Array(2)].map((_, dup) => (
            <div key={dup} className="flex gap-12 items-center">
              {["Garantie 10 ans", "Livraison 48h", "Installation offerte", "SmartConnect", "Classe A+++", "SAV national", "Paiement en 3x"].map((txt) => (
                <span
                  key={txt + dup}
                  className="flex items-center gap-3 text-[11px] font-bold tracking-[0.2em] uppercase text-white/60"
                >
                  <span className="w-1 h-1 rounded-full bg-[#1E5EF3]" />
                  {txt}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ CAMPAIGN ═══════════ */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Grande carte climatisation */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0A2463] via-[#0d2f7e] to-[#1E5EF3] p-10 flex flex-col justify-between min-h-72 group">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#1E5EF3]/30 blur-3xl group-hover:scale-125 transition-transform duration-700" />
            <div className="absolute -bottom-24 -left-16 w-56 h-56 rounded-full bg-white/5 blur-2xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-blue-200 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1.5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse-dot" />
                {t("home.campaign.exclusiveOffer")}
              </span>
              <h2
                className="text-4xl font-bold text-white mt-4 leading-tight"
                style={{ fontFamily: "var(--font-display)", whiteSpace: "pre-line" }}
              >
                {t("home.campaign.acTitle")}
              </h2>
              <p className="text-sm text-blue-100/80 mt-3 max-w-md" style={{ fontFamily: "var(--font-sans)" }}>
                {t("home.campaign.acDesc")}
              </p>
            </div>
            <Link
              to="/produits/climatisation"
              className="relative self-start inline-flex items-center gap-2 mt-8 bg-white text-[#0A2463] font-semibold px-6 py-3.5 rounded-xl hover:bg-blue-50 hover:gap-3.5 transition-all text-sm shadow-lg"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {t("home.campaign.actNow")}
              <ArrowIcon />
            </Link>
          </div>

          <div className="flex flex-col gap-6">
            {/* Carte sombre */}
            <div className="flex-1 relative rounded-3xl overflow-hidden bg-[#0D1117] flex items-center p-7 gap-6 min-h-32 group border border-white/5 hover:border-[#1E5EF3]/40 transition-colors">
              <div className="relative flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=200&h=200&fit=crop&auto=format"
                  alt=""
                  className="w-24 h-24 object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1"
                />
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#1E5EF3] border-2 border-[#0D1117]" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#1E5EF3]" style={{ fontFamily: "var(--font-display)" }}>
                  {t("home.newWashing")}
                </span>
                <h3 className="text-xl font-bold text-white mt-1" style={{ fontFamily: "var(--font-display)" }}>
                  {t("home.ex9000Washing")}
                </h3>
                <p className="text-xs text-gray-400 mt-1 font-sans">{t("home.ex9000Specs")}</p>
                <Link to="/produits/lavage/ex9000-wm" className="inline-flex items-center gap-1.5 text-xs text-[#1E5EF3] hover:text-white mt-3 font-sans transition-colors group/l">
                  {t("home.discoverMore")}
                  <ArrowIcon className="w-3 h-3 transition-transform group-hover/l:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Carte claire */}
            <div className="flex-1 relative rounded-3xl overflow-hidden bg-[#F1F5FB] flex items-center p-7 gap-6 min-h-32 group border border-[#E2E8F0] hover:border-[#1E5EF3]/40 transition-colors">
              <div className="relative flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1484154218962-a197022b5858?w=200&h=200&fit=crop&auto=format"
                  alt=""
                  className="w-24 h-24 object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1"
                />
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 border-2 border-[#F1F5FB]" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#0A2463]" style={{ fontFamily: "var(--font-display)" }}>
                  {t("home.bestSeller")}
                </span>
                <h3 className="text-xl font-bold text-[#0D1117] mt-1" style={{ fontFamily: "var(--font-display)" }}>
                  {t("home.ex7000Fridge")}
                </h3>
                <p className="text-xs text-gray-500 mt-1 font-sans">{t("home.ex7000Specs")}</p>
                <Link to="/produits/refrigerateurs/ex7000-fridge" className="inline-flex items-center gap-1.5 text-xs text-[#1E5EF3] hover:text-[#0A2463] mt-3 font-sans transition-colors group/l">
                  {t("home.discoverMore")}
                  <ArrowIcon className="w-3 h-3 transition-transform group-hover/l:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CATEGORIES ═══════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1E5EF3]" style={{ fontFamily: "var(--font-display)" }}>
                {t("home.categories.subtitle")}
              </span>
              <h2 className="text-4xl font-bold text-[#0A2463] mt-2" style={{ fontFamily: "var(--font-display)" }}>
                {t("home.categories.title")}
              </h2>
            </div>
            <Link
              to="/produits"
              className="text-sm text-[#1E5EF3] hover:text-[#0A2463] font-medium transition-colors hidden md:flex items-center gap-1.5 group font-sans"
            >
              {t("common.seeAll")}
              <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/produits/${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden bg-gray-100 aspect-[3/4] shadow-sm hover:shadow-xl hover:shadow-[#0A2463]/15 hover:-translate-y-1.5 transition-all duration-300"
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2463]/90 via-[#0A2463]/25 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-sm leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                    {cat.label}
                  </h3>
                  <p className="text-blue-200 text-[10px] mt-0.5" style={{ fontFamily: "var(--font-sans)" }}>
                    {cat.count} {t("common.products")}
                  </p>
                </div>
                {/* Flèche flottante */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                  <svg className="w-3.5 h-3.5 text-[#0A2463]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 17L7 7M7 7v8M7 7h8" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ PRODUCT LINE-UP ═══════════ */}
      <section className="bg-[#F5F8FD] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-4xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#1E5EF3]">
              {t("products.lineup.eyebrow")}
            </p>
            <h2
              className="mt-2 text-3xl font-bold leading-tight text-[#0A2463] sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t("products.lineup.title")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              {t("products.lineup.intro")}
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(["washing", "smallAppliances", "waterHeating", "homeCare", "waterFountains", "cooking"] as const).map(
              (key) => (
                <div key={key} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-[#0A2463]">
                    {t(`products.lineup.categories.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    {t(`products.lineup.categories.${key}.description`)}
                  </p>
                </div>
              ),
            )}
          </div>
          <p className="mt-8 border-t border-[#DCE6F8] pt-5 text-sm font-medium leading-relaxed text-slate-600">
            {t("products.lineup.outro")}
          </p>
        </div>
      </section>

      {/* ═══════════ FEATURED PRODUCTS ═══════════ */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1E5EF3]" style={{ fontFamily: "var(--font-display)" }}>
              {t("home.featured.subtitle")}
            </span>
            <h2 className="text-4xl font-bold text-[#0A2463] mt-2" style={{ fontFamily: "var(--font-display)" }}>
              {t("home.featured.title")}
            </h2>
          </div>
          <Link
            to="/produits"
            className="text-sm text-[#1E5EF3] hover:text-[#0A2463] font-medium transition-colors hidden md:flex items-center gap-1.5 group font-sans"
          >
            {t("home.featured.allCatalog")}
            <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.slice(0, 4).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* ═══════════ SMART HOME ═══════════ */}
      <section className="py-24 bg-[#0A2463] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#1E5EF3] blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#1E5EF3] blur-2xl" />
        </div>
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
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1E5EF3]" style={{ fontFamily: "var(--font-display)" }}>
              AUREX SmartConnect
            </span>
            <h2
              className="text-5xl font-bold text-white mt-3 leading-tight"
              style={{ fontFamily: "var(--font-display)", whiteSpace: "pre-line" }}
            >
              {t("home.smartHomeSection.title")}
            </h2>
            <p className="text-blue-100/80 mt-5 leading-relaxed text-base" style={{ fontFamily: "var(--font-sans)" }}>
              {t("home.smartHomeSection.desc")}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { icon: "📱", titleKey: "home.smartHomeSection.features.mobileApp", descKey: "home.smartHomeSection.features.iosAndroid" },
                { icon: "🎙️", titleKey: "home.smartHomeSection.features.voiceControl", descKey: "home.smartHomeSection.features.alexaGoogle" },
                { icon: "⚡", titleKey: "home.smartHomeSection.features.automations", descKey: "home.smartHomeSection.features.customScenarios" },
                { icon: "📊", titleKey: "home.smartHomeSection.features.energyTracking", descKey: "home.smartHomeSection.features.realtimeConsumption" },
              ].map((feat) => (
                <div
                  key={feat.titleKey}
                  className="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 hover:border-[#1E5EF3]/50 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span className="text-xl">{feat.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-sans)" }}>
                      {t(feat.titleKey)}
                    </p>
                    <p className="text-xs text-blue-200 mt-0.5" style={{ fontFamily: "var(--font-sans)" }}>
                      {t(feat.descKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/smart-home"
              className="group/btn inline-flex items-center gap-2 mt-8 bg-[#1E5EF3] hover:bg-[#1a51d4] text-white font-semibold px-7 py-4 rounded-xl transition-all text-sm shadow-lg shadow-[#1E5EF3]/30 hover:-translate-y-0.5"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {t("home.smartHomeSection.cta")}
              <ArrowIcon className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-[#1E5EF3]/40 to-transparent blur-xl" />
            <img
              src="https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=700&fit=crop&auto=format"
              alt=""
              className="relative rounded-3xl w-full object-cover shadow-2xl animate-float"
            />
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl p-4 shadow-2xl flex items-center gap-3 animate-float" style={{ animationDelay: "1.5s" }}>
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900 font-sans">{t("home.smartHomeSection.ex9000Name")}</p>
                <p className="text-xs text-green-600 font-sans">{t("home.smartHomeSection.cycleComplete")}</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-[#1E5EF3] text-white rounded-2xl px-4 py-3 shadow-2xl animate-float" style={{ animationDelay: "3s" }}>
              <p className="text-[10px] font-bold tracking-widest uppercase text-blue-200">Énergie</p>
              <p className="text-lg font-bold font-display">-32%</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ TECHNOLOGIES ═══════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1E5EF3]" style={{ fontFamily: "var(--font-display)" }}>
                {t("home.technologies.subtitle")}
              </span>
              <h2 className="text-4xl font-bold text-[#0A2463] mt-2" style={{ fontFamily: "var(--font-display)" }}>
                {t("home.technologies.title")}
              </h2>
            </div>
            <Link
              to="/technologies"
              className="text-sm text-[#1E5EF3] hover:text-[#0A2463] font-medium transition-colors hidden md:flex items-center gap-1.5 group font-sans"
            >
              {t("home.technologies.allTechs")}
              <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.slice(0, 3).map((tech) => (
              <Link
                key={tech.id}
                to="/technologies"
                className="group relative rounded-2xl overflow-hidden bg-gray-900 aspect-video shadow-md hover:shadow-2xl hover:shadow-[#0A2463]/20 hover:-translate-y-1 transition-all duration-300"
              >
                <img
                  src={tech.image}
                  alt={tech.name}
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2463] via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-blue-300 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20" style={{ fontFamily: "var(--font-display)" }}>
                    {tech.category}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                      {tech.name}
                    </h3>
                    <p className="text-sm text-blue-100 mt-1 font-sans">{tech.benefit}</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#1E5EF3] text-white flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex-shrink-0 shadow-lg">
                    <ArrowIcon className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ NEWS ═══════════ */}
      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1E5EF3]" style={{ fontFamily: "var(--font-display)" }}>
                {t("home.news.subtitle")}
              </span>
              <h2 className="text-4xl font-bold text-[#0A2463] mt-2" style={{ fontFamily: "var(--font-display)" }}>
                {t("home.news.title")}
              </h2>
            </div>
            <Link
              to="/actualites"
              className="text-sm text-[#1E5EF3] hover:text-[#0A2463] font-medium transition-colors hidden md:flex items-center gap-1.5 group font-sans"
            >
              {t("home.news.allNews")}
              <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsItems.map((news) => (
              <article
                key={news.id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-[#0A2463]/10 hover:-translate-y-1 hover:border-gray-200 transition-all duration-300"
              >
                <div className="relative overflow-hidden aspect-video">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-white bg-[#0A2463]/85 backdrop-blur-sm px-3 py-1.5 rounded-full" style={{ fontFamily: "var(--font-display)" }}>
                      {news.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <time className="text-xs text-gray-400 font-sans">{news.date}</time>
                  <h3 className="text-sm font-semibold text-gray-900 mt-2 leading-snug group-hover:text-[#0A2463] transition-colors font-sans line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed font-sans line-clamp-2">
                    {news.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-[#1E5EF3] group-hover:gap-3 transition-all font-sans">
                    {t("common.seeMore")}
                    <ArrowIcon className="w-3 h-3" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SUPPORT CTA ═══════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-3xl bg-gradient-to-br from-[#EFF3FB] to-white border border-[#E2E8F0] p-10 lg:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#1E5EF3]/5 blur-3xl" />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1E5EF3]" style={{ fontFamily: "var(--font-display)" }}>
                  {t("home.support.subtitle")}
                </span>
                <h2
                  className="text-4xl font-bold text-[#0A2463] mt-3"
                  style={{ fontFamily: "var(--font-display)", whiteSpace: "pre-line" }}
                >
                  {t("home.support.title")}
                </h2>
                <p className="text-gray-600 mt-4 leading-relaxed font-sans">{t("home.support.desc")}</p>
                <div className="flex flex-wrap gap-3 mt-8">
                  <Link
                    to="/support"
                    className="group inline-flex items-center gap-2 bg-[#0A2463] text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-[#061540] hover:-translate-y-0.5 transition-all text-sm font-sans shadow-lg shadow-[#0A2463]/20"
                  >
                    {t("home.support.accessSupport")}
                    <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/support#notices"
                    className="inline-flex items-center gap-2 text-[#0A2463] border border-[#0A2463]/20 font-medium px-6 py-3.5 rounded-xl hover:bg-[#EFF3FB] hover:-translate-y-0.5 transition-all text-sm font-sans"
                  >
                    {t("home.support.downloadNotice")}
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "📋", titleKey: "home.support.features.notices.title", descKey: "home.support.features.notices.desc", href: "/support#notices" },
                  { icon: "🔧", titleKey: "home.support.features.assistance.title", descKey: "home.support.features.assistance.desc", href: "/support" },
                  { icon: "⚙️", titleKey: "home.support.features.parts.title", descKey: "home.support.features.parts.desc", href: "/support#pieces" },
                  { icon: "❓", titleKey: "home.support.features.faq.title", descKey: "home.support.features.faq.desc", href: "/support#faq" },
                ].map((item) => (
                  <Link
                    key={item.titleKey}
                    to={item.href}
                    className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#1E5EF3]/50 hover:shadow-lg hover:shadow-[#1E5EF3]/10 hover:-translate-y-1 transition-all duration-300"
                  >
                    <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-[#EFF3FB] text-xl group-hover:bg-[#1E5EF3] group-hover:scale-110 transition-all duration-300">
                      {item.icon}
                    </span>
                    <h4 className="text-sm font-semibold text-gray-900 mt-3 group-hover:text-[#0A2463] transition-colors font-sans">
                      {t(item.titleKey)}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 font-sans">{t(item.descKey)}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}