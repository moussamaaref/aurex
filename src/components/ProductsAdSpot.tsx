import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { findProduct, productUrl, products, type Product } from "../data"
import { catalogInfoOf } from "../lib/catalog"
import { ml } from "../lib/ml"
import { useP } from "../content/lang"
import { productsAds, productsAdsUi, type ProductAd } from "../content/productsAds"

const SLIDE_MS = 6000

function resolveProduct(ad: ProductAd): Product | undefined {
  if (ad.productId) return findProduct(ad.productId)
  if (ad.sousFamille) return products.find((p) => catalogInfoOf(p).sousFamille === ad.sousFamille)
  return undefined
}

/** Product Advertising Spot : bannière publicitaire horizontale compacte de la page Produits.
 *  Aucun texte, aucun titre, aucun bouton : uniquement des visuels de campagne, animés en 3D
 *  (perspective, profondeur, léger suivi du pointeur). Hauteur contrôlée, adapté Desktop / Tablette / Mobile. */
export default function ProductsAdSpot({ family }: { family?: string }) {
  const { p } = useP()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  )
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)")
    if (!mq) return
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  // Campagnes actives ; sur une page famille, priorité à celles de la famille (sinon toutes).
  const slides = useMemo(() => {
    const active = productsAds.filter((ad) => ad.image).map((ad) => ({ ad, product: resolveProduct(ad) }))
    const ofFamily = family ? active.filter((s) => s.product && catalogInfoOf(s.product).family === family) : []
    return ofFamily.length > 0 ? ofFamily : active
  }, [family])

  useEffect(() => setIndex(0), [family])

  const count = slides.length
  const playing = !paused && !reduced && count > 1

  useEffect(() => {
    if (!playing) return
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % count), SLIDE_MS)
    return () => window.clearTimeout(id)
  }, [playing, index, count])

  // Profondeur : le visuel suit très légèrement le pointeur (3D subtile, désactivée si mouvement réduit).
  const onMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== "mouse") return
    const el = stageRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty("--ad-ry", `${(x * 4).toFixed(2)}deg`)
    el.style.setProperty("--ad-rx", `${(-y * 3).toFixed(2)}deg`)
  }
  const onLeave = () => {
    setPaused(false)
    stageRef.current?.style.setProperty("--ad-ry", "0deg")
    stageRef.current?.style.setProperty("--ad-rx", "0deg")
  }

  if (count === 0) return null
  const current = slides[Math.min(index, count - 1)]
  const href = current.product ? productUrl(current.product) : undefined

  return (
    <section
      aria-roledescription="carousel"
      aria-label={p(productsAdsUi.region)}
      className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 sm:pt-6"
      onPointerMove={onMove}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={onLeave}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="relative isolate h-32 overflow-hidden rounded-[24px] bg-[#e8e8ed] [clip-path:inset(0_round_24px)] sm:h-44 sm:rounded-[28px] sm:[clip-path:inset(0_round_28px)] lg:h-56"
        style={{ perspective: "1100px" }}
      >
        <div
          ref={stageRef}
          className="absolute inset-0 [transform-style:preserve-3d] transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: "rotateX(var(--ad-rx,0deg)) rotateY(var(--ad-ry,0deg)) scale(1.03)" }}
        >
          {slides.map(({ ad }, i) => {
            const state = i === index ? "active" : i < index ? "past" : "next"
            const transform =
              state === "active"
                ? "translateZ(0) rotateY(0deg)"
                : state === "past"
                  ? "translateZ(-140px) rotateY(-16deg) translateX(-8%)"
                  : "translateZ(-140px) rotateY(16deg) translateX(8%)"
            return (
              <img
                key={ad.image + i}
                src={ad.image}
                alt={i === index ? p(ad.imageAlt) : ""}
                aria-hidden={i !== index}
                decoding="async"
                fetchPriority={i === 0 ? "high" : "auto"}
                loading={i === 0 ? "eager" : "lazy"}
                draggable={false}
                className={`absolute inset-0 h-full w-full object-cover ${reduced ? "" : "transition-[transform,opacity] duration-[1100ms] ease-[cubic-bezier(0.22,0.8,0.2,1)]"} ${
                  state === "active" ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                style={{ transform: reduced ? undefined : transform, objectPosition: ad.position || "center" }}
              />
            )
          })}
        </div>

        {/* Lien discret : la bannière entière mène à la fiche, sans texte ni bouton visible */}
        {href && current.product && (
          <Link to={href} className="absolute inset-0 z-10 rounded-[inherit] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white">
            <span className="sr-only">{ml(current.product.name)}</span>
          </Link>
        )}

        {count > 1 && (
          <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center" role="group">
            <div className="flex items-center rounded-full bg-black/25 px-1.5 backdrop-blur-md">
              {slides.map((s, i) => (
                <button
                  key={s.ad.image + i}
                  type="button"
                  aria-label={`${i + 1} / ${count}`}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                  className="group flex h-8 min-w-6 items-center justify-center px-0.5 sm:h-11"
                >
                  <span className={`block h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-7 bg-white" : "w-1.5 bg-white/60 group-hover:bg-white"}`} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
