import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { findProduct, productUrl, products, type Product } from "../data"
import { catalogInfoOf } from "../lib/catalog"
import { ml } from "../lib/ml"
import { useP } from "../content/lang"
import { productsAds, productsAdsUi, type ProductAd } from "../content/productsAds"
import Icon from "./Icon"

const SLIDE_MS = 6500

function resolveProduct(ad: ProductAd): Product | undefined {
  if (ad.productId) return findProduct(ad.productId)
  if (ad.sousFamille) return products.find((p) => catalogInfoOf(p).sousFamille === ad.sousFamille)
  return undefined
}

/** Product Advertising Spot : hero visuel de la page Produits (aucun texte de présentation).
 *  Slider fluide, CTA « Découvrir le produit » vers la fiche, adapté Desktop / Tablette / Mobile. */
export default function ProductsAdSpot({ family }: { family?: string }) {
  const { p } = useP()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  )

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)")
    if (!mq) return
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  // Campagnes actives ; sur une page famille, priorité à celles de la famille (sinon toutes).
  const slides = useMemo(() => {
    const active = productsAds
      .filter((ad) => ad.image)
      .map((ad) => ({ ad, product: resolveProduct(ad) }))
    const ofFamily = family ? active.filter((s) => s.product && catalogInfoOf(s.product).family === family) : []
    return ofFamily.length > 0 ? ofFamily : active
  }, [family])

  useEffect(() => setIndex(0), [family])

  const count = slides.length
  const playing = !paused && !userPaused && !reduced && count > 1

  useEffect(() => {
    if (!playing) return
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % count), SLIDE_MS)
    return () => window.clearTimeout(id)
  }, [playing, index, count])

  if (count === 0) return null
  const current = slides[Math.min(index, count - 1)]
  const href = current.product ? productUrl(current.product) : undefined

  return (
    <section
      aria-roledescription="carousel"
      aria-label={p(productsAdsUi.region)}
      className="relative isolate overflow-hidden bg-[#f5f5f7]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative mx-auto aspect-[4/3] max-h-[78vh] w-full max-w-[1600px] sm:aspect-[16/9] lg:aspect-[21/9]">
        {slides.map(({ ad }, i) => (
          <img
            key={ad.image + i}
            src={ad.image}
            alt={i === index ? p(ad.imageAlt) : ""}
            aria-hidden={i !== index}
            decoding="async"
            fetchPriority={i === 0 ? "high" : "auto"}
            loading={i === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[900ms] ease-out motion-reduce:transition-none ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

        {/* CTA : directement vers la fiche du produit concerné */}
        {href && (
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-8 lg:p-10">
            <Link
              to={href}
              className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7] active:scale-[0.98]"
            >
              {p(productsAdsUi.cta)}
              <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" strokeWidth={2} />
            </Link>
            {current.product && <span className="sr-only">{ml(current.product.name)}</span>}
          </div>
        )}

        {/* Commandes */}
        {count > 1 && (
          <div className="absolute bottom-4 end-4 flex items-center gap-1 rounded-full bg-black/40 px-2 backdrop-blur-md sm:bottom-8 sm:end-8 lg:bottom-10 lg:end-10" role="group">
            <button type="button" aria-label={p(productsAdsUi.prev)} onClick={() => setIndex((i) => (i - 1 + count) % count)} className="flex h-11 w-9 items-center justify-center rounded-full text-white hover:bg-white/15">
              <Icon name="chevronLeft" className="h-4 w-4 rtl:-scale-x-100" strokeWidth={2} />
            </button>
            <button type="button" aria-pressed={userPaused} aria-label={p(userPaused ? productsAdsUi.play : productsAdsUi.pause)} onClick={() => setUserPaused((v) => !v)} className="flex h-11 w-9 items-center justify-center rounded-full text-white hover:bg-white/15">
              <Icon name={userPaused || reduced ? "play" : "pause"} className="h-4 w-4" strokeWidth={2} />
            </button>
            {slides.map((s, i) => (
              <button
                key={s.ad.image + i}
                type="button"
                aria-label={`${i + 1} / ${count}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className="group flex min-h-11 min-w-5 items-center justify-center px-0.5"
              >
                <span className={`block h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-8 bg-white" : "w-1.5 bg-white/55 group-hover:bg-white"}`} />
              </button>
            ))}
            <button type="button" aria-label={p(productsAdsUi.next)} onClick={() => setIndex((i) => (i + 1) % count)} className="flex h-11 w-9 items-center justify-center rounded-full text-white hover:bg-white/15">
              <Icon name="chevronRight" className="h-4 w-4 rtl:-scale-x-100" strokeWidth={2} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
