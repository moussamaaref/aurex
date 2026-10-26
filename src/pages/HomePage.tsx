import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { categories, products, type Product } from "../data"
import { ml } from "../lib/ml"
import { useP } from "../content/lang"
import { categoryContent } from "../content/categories"
import { heroSlides, heroUi, lineUp, why, categoriesSection, sav, promo } from "../content/home"
import { smartTech } from "../content/smartTech"
import Reveal from "../components/Reveal"
import LineUpCard from "../components/LineUpCard"
import SmartTechSection from "../components/SmartTechSection"
import Icon from "../components/Icon"

/** Quatre « Hero Products » représentant la diversité de la gamme : un par catégorie, les plus mis en avant d'abord. */
function pickHeroProducts(list: Product[]): Product[] {
  const score = (p: Product) =>
    (p.badges?.includes("Best Seller") ? 2 : 0) + (p.badges?.includes("Nouveau") || p.isNew ? 1 : 0)
  const picked: Product[] = []
  for (const cat of categoryContent) {
    const best = list
      .filter((p) => p.category === cat.slug)
      .sort((a, b) => score(b) - score(a))[0]
    if (best) picked.push(best)
    if (picked.length === 4) return picked
  }
  for (const p of list) {
    if (picked.length === 4) break
    if (!picked.includes(p)) picked.push(p)
  }
  return picked
}

/* ──────────────── 1. HERO — diaporama de 4 diapositives ──────────────── */
function Hero() {
  const { p } = useP()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  )

  // La préférence peut changer en cours de session.
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)")
    if (!mq) return
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  const playing = !paused && !userPaused && !reduced

  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % heroSlides.length), 7500)
    return () => window.clearInterval(id)
  }, [playing])

  const slide = heroSlides[index]

  return (
    <section
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-[#1d1d1f]"
      aria-roledescription="carousel"
      aria-label="AUREX"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {heroSlides.map((s, i) => (
        <img
          key={s.id}
          src={s.image}
          alt=""
          aria-hidden="true"
          decoding="async"
          fetchPriority={i === 0 ? "high" : "auto"}
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 -z-10 h-full w-full object-cover transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/40 to-transparent rtl:bg-gradient-to-l" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <div className="mx-auto w-full max-w-7xl px-6 pb-24 pt-40">
        <div key={slide.id} className="max-w-4xl animate-text-in" aria-live={playing ? "off" : "polite"}>
          {(slide.badge || slide.tag) && (
            <p className="mb-6 inline-flex flex-wrap items-center gap-x-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/90">
              {slide.badge && <span>{p(slide.badge)}</span>}
              {slide.tag && (
                <span className="inline-flex items-center gap-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-[#4db3e6]">
                  {p(slide.tag)}
                </span>
              )}
            </p>
          )}
          <h1
            className="text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-7xl lg:text-[80px] lg:tracking-[-1.2px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {p(slide.title)}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">{p(slide.subtitle)}</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to={slide.primary.href}
              className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--color-accent)] px-7 text-[15px] font-semibold text-white transition-colors hover:bg-[#00628f] active:scale-[0.98]"
            >
              {p(slide.primary.label)}
              <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" strokeWidth={2} />
            </Link>
            <Link
              to={slide.secondary.href}
              className="inline-flex min-h-12 items-center rounded-full border border-white/60 px-7 text-[15px] font-semibold text-white transition-colors hover:bg-white/10 active:scale-[0.98]"
            >
              {p(slide.secondary.label)}
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 flex items-center rtl:left-6 rtl:right-auto" role="tablist">
        <button
          type="button"
          onClick={() => setUserPaused((v) => !v)}
          aria-pressed={userPaused}
          aria-label={p(heroUi.pause[userPaused ? "play" : "pause"])}
          className="me-1 flex h-11 w-11 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15"
        >
          <Icon name={userPaused || reduced ? "play" : "pause"} className="h-4 w-4" strokeWidth={2} />
        </button>
        {heroSlides.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={i === index}
            aria-label={`${i + 1} / ${heroSlides.length}`}
            onClick={() => setIndex(i)}
            className="group flex min-h-11 min-w-7 items-center justify-center px-1"
          >
            <span className={`block h-1.5 origin-center rounded-full bg-white transition-[transform,opacity] duration-300 ${i === index ? "w-10 opacity-100" : "w-1.5 opacity-50 group-hover:opacity-80"}`} />
          </button>
        ))}
      </div>
    </section>
  )
}

/* ──────────────── 2. PRODUCT LINE-UP 2026 ──────────────── */
function LineUp() {
  const { p } = useP()
  const heroProducts = useMemo(() => pickHeroProducts(products), [])
  return (
    <section className="bg-white py-20 lg:py-[90px]" aria-labelledby="lineup-title">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="lineup-title" className="text-4xl font-semibold leading-none tracking-tight text-[#1d1d1f] lg:text-[40px]" style={{ fontFamily: "var(--font-display)" }}>
                {p(lineUp.title)}
              </h2>
              <p className="mt-3 text-[17px] text-[#474747]">{p(lineUp.subtitle)}</p>
            </div>
            <Link to="/produits" className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-[#0077b3] hover:underline">
              {p(lineUp.seeAll)}
              <Icon name="arrow" className="h-4 w-4 rtl:-scale-x-100" strokeWidth={2} />
            </Link>
          </div>
        </Reveal>
        {/* Quatre cartes sur une seule ligne (desktop), mêmes dimensions, espacement régulier */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {heroProducts.map((product, i) => (
            <Reveal key={product.id} delay={i * 80} className="h-full">
              <LineUpCard product={product} cta={p(lineUp.cardCta)} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────── 3. POURQUOI AUREX ──────────────── */
function WhyAurex() {
  const { p } = useP()
  return (
    <section id="pourquoi-aurex" className="scroll-mt-24 bg-[#f5f5f7] py-20 lg:py-[90px]" aria-labelledby="why-title">
      <div className="mx-auto max-w-7xl px-6">
        {/* Composition éditoriale asymétrique : texte d'un côté, grande image lifestyle de l'autre */}
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0077b3]">{p(why.heading)}</p>
              <h2 id="why-title" className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-[#1d1d1f] lg:text-[48px]" style={{ fontFamily: "var(--font-display)" }}>
                {p(why.headline)}
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-6 text-[17px] leading-relaxed text-[#474747]">{p(why.intro)}</p>
              <Link to="/a-propos" className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-[#0077b3] hover:underline">
                {p(why.cta)}
                <Icon name="arrow" className="h-4 w-4 rtl:-scale-x-100" strokeWidth={2} />
              </Link>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal variant="scale" delay={100}>
              <img
                loading="lazy"
                decoding="async"
                src={why.image}
                alt={p(why.imageAlt)}
                width={1400}
                height={1100}
                className="aspect-[5/4] w-full rounded-[28px] object-cover"
              />
            </Reveal>
          </div>
        </div>

        {/* Quatre piliers : liste éditoriale secondaire, pas une grille de cartes produit */}
        <div className="mt-16 grid gap-x-10 gap-y-10 border-t border-[#d6d6d6] pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {why.pillars.map((pillar, i) => (
            <Reveal key={pillar.icon} delay={i * 90}>
              <div className="text-[#0077b3]">
                <Icon name={pillar.icon} className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-[19px] font-semibold leading-snug text-[#1d1d1f]" style={{ fontFamily: "var(--font-display)" }}>
                {p(pillar.title)}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#474747]">{p(pillar.text)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────── 4. NOS CATÉGORIES ──────────────── */
function Categories() {
  const { p } = useP()
  return (
    <section className="bg-white py-20 lg:py-[90px]" aria-labelledby="cats-title">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0077b3]">{p(categoriesSection.eyebrow)}</p>
          <h2 id="cats-title" className="mt-3 text-4xl font-semibold leading-none tracking-tight text-[#1d1d1f] lg:text-[40px]" style={{ fontFamily: "var(--font-display)" }}>
            {p(categoriesSection.title)}
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categoryContent.map((cat, i) => {
            const image = categories.find((c) => c.slug === cat.slug)?.image || cat.image
            return (
              <Reveal key={cat.slug} delay={Math.min(i, 4) * 70} className="h-full">
                <Link
                  to={`/produits/${cat.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-[#f5f5f7] transition-colors hover:bg-[#ececf0]"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      loading="lazy"
                      decoding="async"
                      src={image}
                      alt={p(cat.name)}
                      width={800}
                      height={1000}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-xs font-semibold text-[#5a5a5e]">{cat.num}</span>
                    <h3 className="mt-1 text-[19px] font-semibold leading-snug text-[#1d1d1f]" style={{ fontFamily: "var(--font-display)" }}>
                      {p(cat.name)}
                    </h3>
                    <p className="mt-2 text-[15px] leading-snug text-[#474747]">{p(cat.highlight)}</p>
                    <span className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-4 text-[15px] font-semibold text-[#0077b3]">
                      {p(cat.cta)}
                      <Icon name="arrow" className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" strokeWidth={2} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ──────────────── 5. SERVICE APRÈS-VENTE ──────────────── */
function AfterSales() {
  const { p } = useP()
  return (
    <section className="bg-[#f5f5f7] py-20 lg:py-[90px]" aria-labelledby="sav-title">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0077b3]">{p(sav.eyebrow)}</p>
            <h2 id="sav-title" className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-[#1d1d1f] lg:text-[48px]" style={{ fontFamily: "var(--font-display)" }}>
              {p(sav.headline)}
            </h2>
            <p className="mt-4 text-[17px] font-medium italic text-[#333336]">{p(sav.principle)}</p>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-5">
            <p className="text-[15px] leading-relaxed text-[#474747]">{p(sav.text)}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={sav.primary.href} className="inline-flex min-h-12 items-center rounded-full bg-[var(--color-accent)] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#00628f] active:scale-[0.98]">
                {p(sav.primary.label)}
              </Link>
              <Link to={sav.secondary.href} className="inline-flex min-h-12 items-center rounded-full border border-[#86868b] px-6 text-[15px] font-semibold text-[#1d1d1f] transition-colors hover:bg-white active:scale-[0.98]">
                {p(sav.secondary.label)}
              </Link>
            </div>
          </Reveal>
        </div>
        {/* Présentation à quatre cartes conservée */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sav.cards.map((card, i) => (
            <Reveal key={card.num} delay={i * 80} className="h-full">
              <Link to={card.href} className="group flex h-full flex-col rounded-[28px] bg-white p-7 transition-colors hover:bg-[#fafafc]">
                <div className="flex items-center justify-between">
                  <span className="text-[#0077b3]">
                    <Icon name={card.icon} className="h-7 w-7" />
                  </span>
                  <span className="text-xs font-semibold text-[#5a5a5e]">{card.num}</span>
                </div>
                <h3 className="mt-6 text-[19px] font-semibold leading-snug text-[#1d1d1f]" style={{ fontFamily: "var(--font-display)" }}>
                  {p(card.title)}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#474747]">{p(card.text)}</p>
                <span className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-5 text-[15px] font-semibold text-[#0077b3]">
                  {p(card.cta)}
                  <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" strokeWidth={2} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────── 6. PROMOTIONAL & HIGHLIGHTS GRID ──────────────── */
function Highlights() {
  const { p } = useP()
  return (
    <section className="bg-white py-20 lg:py-[90px]" aria-label="Highlights">
      <div className="mx-auto grid max-w-7xl gap-5 px-6 lg:grid-cols-2 lg:grid-rows-2">
        {/* Grande carte : Offre exclusive */}
        <Reveal className="lg:row-span-2">
          <Link
            to={promo.exclusive.href}
            className="group relative isolate flex min-h-[420px] h-full flex-col justify-end overflow-hidden rounded-[28px] bg-[#1d1d1f] p-8 lg:min-h-[560px] lg:p-10"
          >
            <img
              loading="lazy"
              decoding="async"
              src={promo.exclusive.image}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 -z-10 h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <span className="text-xs font-semibold tracking-[0.18em] text-white/90">{p(promo.exclusive.label)}</span>
            <h3 className="mt-3 max-w-md text-4xl font-semibold leading-[1.05] tracking-tight text-white lg:text-[40px]" style={{ fontFamily: "var(--font-display)" }}>
              {p(promo.exclusive.title)}
            </h3>
            <p className="mt-3 max-w-md text-base text-white/85">{p(promo.exclusive.text)}</p>
            <span className="mt-5 inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-[#1d1d1f] transition-colors group-hover:bg-[#f5f5f7]">
              {p(promo.exclusive.cta)}
              <Icon name="arrow" className="h-4 w-4 rtl:-scale-x-100" strokeWidth={2} />
            </span>
          </Link>
        </Reveal>

        {/* Deux cartes plus petites, empilées verticalement */}
        {[promo.fresh, promo.best].map((card, i) => (
          <Reveal key={i} delay={(i + 1) * 100}>
            <Link to={card.href} className="group flex h-full min-h-[260px] flex-col justify-between rounded-[28px] bg-[#f5f5f7] p-8 transition-colors hover:bg-[#ececf0]">
              <span className="inline-flex w-fit text-xs font-semibold tracking-[0.18em] text-[#b64400]">{p(card.label)}</span>
              <div>
                <h3 className="mt-6 text-[28px] font-semibold leading-tight tracking-tight text-[#1d1d1f]" style={{ fontFamily: "var(--font-display)" }}>
                  {p(card.title)}
                </h3>
                <p className="mt-2 text-[15px] text-[#474747]">{p(card.text)}</p>
                <span className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-[#0077b3]">
                  {p(card.cta)}
                  <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" strokeWidth={2} />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export default function HomePage() {
  const { p } = useP()
  return (
    <>
      <Hero />
      <LineUp />
      <WhyAurex />
      <Categories />
      <AfterSales />
      <Highlights />
      <section className="bg-[#f5f5f7] py-20 lg:py-[90px]" aria-label={p(smartTech.label)}>
        <SmartTechSection />
      </section>
      {/* La newsletter est rendue dans le pied de page (Footer). */}
    </>
  )
}
