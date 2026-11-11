import { useP } from "../content/lang"
import { specUi, docUi } from "../content/products"
import { catalogInfoOf } from "../lib/catalog"
import { energyClassOf, productFacts } from "../lib/catalogView"
import { useEffect, useRef, useState } from "react"
import { Link, useParams, Navigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  products,
  categories,
  productUrl,
  findProduct,
} from "../data"
import { ml } from "../lib/ml"
import CompareButton from "../components/CompareButton"
import Reveal from "../components/Reveal"

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
      className={`${color} text-white text-xs font-bold px-2 py-1 rounded-[10px] font-display tracking-wider shadow-sm`}
    >
      {cls}
    </span>
  )
}

/** Vidéo de présentation : fichier (mp4/webm) ou lien YouTube / Vimeo. */
function ProductVideo({ url, poster, title }: { url: string; poster: string; title: string }) {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{6,})/)
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  const embed = yt ? `https://www.youtube-nocookie.com/embed/${yt[1]}` : vimeo ? `https://player.vimeo.com/video/${vimeo[1]}` : null
  return embed ? (
    <iframe src={embed} title={title} loading="lazy" allowFullScreen className="aspect-video w-full rounded-[10px] border border-[#d6d6d6]" />
  ) : (
    <video src={url} poster={poster} controls preload="metadata" playsInline className="aspect-video w-full rounded-[10px] border border-[#d6d6d6] bg-black" />
  )
}

// Temporaire : masque le bouton « Où acheter » (comme dans le header)
const hideWhereToBuy = false

export default function ProductDetailPage() {
  const { t } = useTranslation()
  const { p, lang } = useP()
  const { id, slug } = useParams<{ id?: string; slug?: string }>()
  const product = findProduct(id ?? slug)
  const [selectedImage, setSelectedImage] = useState(0)
  const galleryRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<"features" | "specs" | "media" | "docs">(
    "features",
  )
  const [isImageFullscreen, setIsImageFullscreen] = useState(false)

  // Plein écran : Échap pour fermer, défilement de la page verrouillé.
  useEffect(() => {
    if (!isImageFullscreen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsImageFullscreen(false)
    }
    document.addEventListener("keydown", onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = overflow
    }
  }, [isImageFullscreen])

  useEffect(() => {
    if (product) document.title = `${ml(product.name)} — AUREX`
  }, [product])

  if (!product) return <Navigate to="/produits" replace />

  const images = product.images ?? [product.image]
  const category = categories.find((c) => String(c.slug ?? "").toLowerCase() === String(product.category ?? "").toLowerCase())
  // Classification officielle AUREX (src/lib/catalog.ts) : famille, sous-famille, gamme, capacités, couleurs, connectivité
  const info = catalogInfoOf(product)
  const facts = productFacts(product, lang)
  const categoryLabel = category ? ml(category.label) : facts.family

  // Produits similaires : même gamme → même sous-famille → même famille
  const simScore = (other: (typeof products)[number]): number => {
    if (other.id === product.id) return -1
    const o = catalogInfoOf(other)
    if (info.range && o.range === info.range) return 4
    if (info.sousFamille && o.sousFamille === info.sousFamille) return 3
    if (info.family && o.family === info.family) return 2
    return 0
  }
  const related = products
    .map((other) => ({ other, score: simScore(other) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.other)
    .slice(0, 3)

  // Fil d'Ariane : Accueil > Produits > Famille > Sous-famille > Gamme > Produit
  const crumbs: Array<{ label: string; to?: string }> = [
    { label: t("products.breadcrumb.home"), to: "/" },
    { label: t("products.breadcrumb.products"), to: "/produits" },
  ]
  if (info.family) crumbs.push({ label: facts.family, to: `/produits/${info.family}` })
  if (info.sousFamille) crumbs.push({ label: facts.subFamily, to: `/produits/${info.family}?sousFamille=${info.sousFamille}` })
  if (info.range) crumbs.push({ label: facts.range, to: `/produits/${info.family}?sousFamille=${info.sousFamille}&gamme=${info.range}` })
  crumbs.push({ label: ml(product.name) })

  const selectImage = (index: number) => {
    setSelectedImage(index)
    galleryRef.current?.scrollTo({
      left: index * galleryRef.current.clientWidth,
      behavior: "smooth",
    })
  }

  const badgeStyle = (badge: string) =>
    badge === "Nouveau"
      ? "bg-[var(--color-primary)] text-white"
      : badge === "Promotion"
        ? "bg-red-500 text-white"
        : badge === "Best Seller"
          ? "bg-amber-400 text-amber-900"
          : "bg-[var(--color-accent)] text-white"

  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-24 pt-24 lg:pb-0">
      {/* ══ Breadcrumb ══ */}
      <div className="border-b border-[#d6d6d6] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3.5 sm:px-6">
          <nav
            className="flex flex-wrap items-center gap-1.5 text-xs text-[#5a5a5e]"
            aria-label="Breadcrumb"
          >
            {crumbs.map((crumb, i) => (
              <span key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
                {i > 0 && (
                  <svg className="h-3 w-3 text-[#d6d6d6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                )}
                {crumb.to ? (
                  <Link to={crumb.to} className="transition-colors hover:text-[var(--color-primary)]">
                    {crumb.label}
                  </Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
              </span>
            ))}
            <svg className="h-3 w-3 text-[#d6d6d6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <span className="font-medium text-[var(--color-primary)]">{ml(product.name)}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* ══ Galerie ══ */}
          {/* Pas de Reveal ici : un parent transformé casserait le plein écran (position: fixed). */}
          <div className="space-y-4">
            <div
              className={`overflow-hidden bg-white shadow-sm ${
                isImageFullscreen
                  ? "fixed inset-0 z-[70] flex h-[100dvh] w-screen items-center justify-center rounded-none border-0"
                  : "relative aspect-square rounded-[28px] border border-[#d6d6d6]"
              }`}
            >
              <div
                ref={galleryRef}
                onScroll={(event) => {
                  const element = event.currentTarget
                  const index = Math.round(element.scrollLeft / element.clientWidth)
                  if (index !== selectedImage) setSelectedImage(index)
                }}
                className={`flex h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain ${
                  isImageFullscreen ? "items-center" : ""
                }`}
                style={{ scrollbarWidth: "none" }}
              >
                {images.map((img, index) => (
                  <div
                    key={`${img}-${index}`}
                    className={`flex min-w-full snap-center snap-always items-center justify-center ${
                      isImageFullscreen ? "cursor-zoom-out bg-black/90" : "cursor-zoom-in"
                    }`}
                    onClick={() => setIsImageFullscreen((value) => !value)}
                  >
                    <img fetchPriority="high" decoding="async"
                      src={img}
                      alt={`${ml(product.name)} ${index + 1}`}
                      draggable={false}
                      className={
                        isImageFullscreen
                          ? "max-h-[92vh] max-w-[94vw] object-contain"
                          : "h-full w-full object-cover"
                      }
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                aria-label={
                  isImageFullscreen
                    ? t("productDetail.exitFullscreen")
                    : t("productDetail.fullscreen")
                }
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => setIsImageFullscreen((value) => !value)}
                className="absolute right-4 top-4 rounded-[10px] bg-white/90 p-3 text-[var(--color-primary)] shadow-lg backdrop-blur transition-colors hover:bg-[var(--color-accent)] hover:text-white"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  {isImageFullscreen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9 4 4m0 0v4m0-4h4m7 7 5 5m0 0v-4m0 4h-4" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 9V4h5M20 9V4h-5M4 15v5h5m11-5v5h-5" />
                  )}
                </svg>
              </button>
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                {product.badges.map((badge) => (
                  <span
                    key={ml(badge)}
                    className={`rounded-[10px] px-2.5 py-1.5 text-[10px] font-bold tracking-wider shadow-sm ${badgeStyle(ml(badge))}`}
                  >
                    {ml(badge)}
                  </span>
                ))}
              </div>
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => selectImage(i)}
                    className={`relative aspect-square overflow-hidden rounded-[10px] border-2 bg-white transition-all ${
                      selectedImage === i
                        ? "border-[var(--color-accent)] shadow-md ring-2 ring-blue-100"
                        : "border-[#d6d6d6] hover:border-[#d6d6d6] hover:shadow-sm"
                    }`}
                  >
                    <img loading="lazy" decoding="async" src={img} alt={`${ml(product.name)} ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ══ Fiche ══ */}
          <Reveal variant="right" delay={120}>
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {facts.family && <span className="rounded-full border border-[#d6d6d6] bg-[#f5f5f7] px-2.5 py-1 text-xs font-semibold text-[#333336]">{facts.family}</span>}
              {facts.subFamily && <span className="rounded-full border border-[#d6d6d6] bg-[#f5f5f7] px-2.5 py-1 text-xs font-semibold text-[#333336]">{facts.subFamily}</span>}
              {energyClassOf(product) && <EnergyBadge cls={energyClassOf(product)} />}
              {/* Wi-Fi / Bluetooth : uniquement si le produit les possède réellement */}
              {facts.connectivity.map((c) => (
                <span key={c} className="flex items-center gap-1.5 rounded-full border border-[#d6d6d6] bg-[#f5f5f7] px-2.5 py-1 text-xs font-semibold text-[#006a9e]">
                  {c}
                </span>
              ))}
            </div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#5a5a5e]">
              {product.reference}
            </p>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[var(--color-primary)] lg:text-4xl font-display">
              {ml(product.name)}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[#333336]">
              {ml(product.short_description) || ml(product.description)}
            </p>

            {/* Caractéristiques principales (valeurs officielles du produit) */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                facts.capacities.length > 0 && { label: t("productDetail.capacity"), value: facts.capacities.join(" · ") },
                facts.range && { label: specUi.range.fr && p(specUi.range), value: facts.range },
                facts.classifications.length > 0 && { label: p(specUi.classification), value: facts.classifications.join(" · ") },
                facts.colors.length > 0 && { label: t("productDetail.color"), value: facts.colors.join(" · ") },
                ml(product.noiseLevel) && { label: t("productDetail.noiseLevel"), value: ml(product.noiseLevel) },
                product.dimensions && { label: t("productDetail.dimensions"), value: `${product.dimensions.w} × ${product.dimensions.h} × ${product.dimensions.d} cm` },
              ]
                .filter(Boolean)
                .map((spec) => (
                  <div key={(spec as { label: string }).label} className="rounded-[10px] border border-[#d6d6d6] bg-white p-3.5">
                    <p className="font-display text-[10px] uppercase tracking-widest text-[#5a5a5e]">{(spec as { label: string }).label}</p>
                    <p className="mt-1 text-sm font-semibold text-[#1d1d1f]">{(spec as { value: string }).value}</p>
                  </div>
                ))}
            </div>

            {/* Technologies */}
            {product.technologies.length > 0 && (
              <div className="mt-5">
                <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#5a5a5e] font-display">
                  {t("productDetail.technologiesTitle")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.technologies.map((tech) => (
                    <span
                      key={ml(tech)}
                      className="rounded-full border border-[#d6d6d6] bg-[#f5f5f7] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-primary)] transition-colors hover:border-blue-200 hover:bg-[#f5f5f7]"
                    >
                      {ml(tech)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-8 rounded-[28px] border border-[#d6d6d6] bg-white p-6 shadow-sm">
              <div className="flex flex-wrap gap-3">
                {!hideWhereToBuy && (
                  <Link
                    to="/distributeurs"
                    className="flex flex-1 items-center justify-center gap-2 rounded-[10px] bg-[var(--color-primary)] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-900/20 transition-all hover:-translate-y-0.5 hover:bg-[#00628f] hover:shadow-lg"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {p(docUi.findDistributor)}
                  </Link>
                )}
                <CompareButton
                  productId={product.id}
                  variant="detail"
                  navigateToCompare
                />
              </div>
              <Link
                to="/support#demande"
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-[10px] px-2 py-1 text-xs font-medium text-[#474747] transition-colors hover:text-[var(--color-primary)]"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {p(docUi.question)}
              </Link>
            </div>
          </div>
          </Reveal>
        </div>

        {/* ══ Onglets ══ */}
        <Reveal>
        <div className="mt-16 rounded-[28px] border border-[#d6d6d6] bg-white shadow-sm">
          <div className="flex overflow-x-auto border-b border-[#d6d6d6] px-4 sm:px-6">
            {[
              { key: "features" as const, label: p(specUi.features) },
              { key: "specs" as const, label: p(specUi.specs) },
              ...(product.video || product.view360 ? [{ key: "media" as const, label: p(docUi.media) }] : []),
              { key: "docs" as const, label: t("productDetail.tabs.docs") },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`-mb-px whitespace-nowrap border-b-2 px-6 py-4 text-sm font-semibold transition-colors ${
                  activeTab === tab.key
                    ? "border-[var(--color-accent)] text-[#006a9e]"
                    : "border-transparent text-[#5a5a5e] hover:text-[#333336]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === "features" && (
              <div className="space-y-5">
                {product.short_description && ml(product.description) && (
                  <p className="max-w-3xl whitespace-pre-line text-sm leading-relaxed text-[#333336]">{ml(product.description)}</p>
                )}
                {product.features.length === 0 && !ml(product.description) && <p className="text-sm text-[#5a5a5e]">{p(docUi.soon)}</p>}
              <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {product.features.map((feat) => (
                  <li
                    key={ml(feat)}
                    className="flex items-start gap-3 rounded-[10px] border border-[#d6d6d6] bg-[#f5f5f7]/60 p-4 transition-colors hover:border-[#d6d6d6] hover:bg-[#f5f5f7]/40"
                  >
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/10">
                      <svg className="h-3 w-3 text-[#006a9e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-[#333336]">{ml(feat)}</span>
                  </li>
                ))}
              </ul>
              </div>
            )}
            {activeTab === "specs" && (
              <div className="overflow-hidden rounded-[10px] border border-[#d6d6d6]">
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      { label: p(specUi.reference), value: product.reference },
                      facts.family && { label: p(specUi.family), value: facts.family },
                      facts.subFamily && { label: p(specUi.subFamily), value: facts.subFamily },
                      facts.range && { label: p(specUi.range), value: facts.range },
                      ...(product.specs ?? []).map((row) => ({ label: ml(row.label), value: ml(row.value) })),
                      facts.capacities.length > 0 && { label: p(specUi.capacity), value: facts.capacities.join(", ") },
                      facts.classifications.length > 0 && { label: p(specUi.classification), value: facts.classifications.join(", ") },
                      energyClassOf(product) && { label: p(specUi.energyClass), value: energyClassOf(product) },
                      product.dimensions && { label: p(specUi.dimensions), value: `${product.dimensions.w} × ${product.dimensions.h} × ${product.dimensions.d} cm` },
                      facts.colors.length > 0 && { label: p(specUi.color), value: facts.colors.join(", ") },
                      facts.connectivity.length > 0 && { label: p(specUi.connectivity), value: facts.connectivity.join(" · ") },
                      ml(product.noiseLevel) && { label: p(specUi.noise), value: ml(product.noiseLevel) },
                    ]
                      .filter((row) => row && (row as { value: string }).value)
                      .map((row, i) => (
                        <tr key={(row as { label: string }).label + i} className={i % 2 === 0 ? "bg-white" : "bg-[#f5f5f7]/70"}>
                          <td className="w-1/2 border-b border-[#d6d6d6] px-5 py-3.5 font-medium text-[#474747]">{(row as { label: string }).label}</td>
                          <td className="border-b border-[#d6d6d6] px-5 py-3.5 font-semibold text-[#1d1d1f]">{(row as { value: string }).value}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === "media" && (
              <div className="space-y-6">
                {product.video && <ProductVideo url={product.video} poster={product.image} title={ml(product.name)} />}
                {product.view360 && (
                  <div>
                    <p className="mb-2 text-sm font-semibold text-[#1d1d1f]">{p(docUi.view360)}</p>
                    <iframe src={product.view360} title={`${p(docUi.view360)} — ${ml(product.name)}`} loading="lazy" className="aspect-video w-full rounded-[10px] border border-[#d6d6d6]" allowFullScreen />
                  </div>
                )}
              </div>
            )}
            {activeTab === "docs" && (
              (product.documents ?? []).filter((d) => d.url).length === 0 ? (
                <p className="text-sm text-[#5a5a5e]">{p(docUi.soon)}</p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {(product.documents ?? [])
                    .filter((d) => d.url)
                    .map((doc) => (
                      <a
                        key={doc.type + doc.url}
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className="flex items-center justify-between gap-3 rounded-[10px] border border-[#d6d6d6] bg-white p-4 transition-colors hover:bg-[#fafafc]"
                      >
                        <span className="text-sm font-semibold text-[#1d1d1f]">{doc.label ? ml(doc.label) : p(docUi.types[doc.type])}</span>
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-[#006a9e]">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          {t("common.download")}
                        </span>
                      </a>
                    ))}
                </div>
              )
            )}
          </div>
        </div>
        </Reveal>

        {/* ══ Produits similaires ══ */}
        {related.length > 0 && (
          <div className="mt-14">
            <div className="mb-7 flex items-end justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#006a9e] font-display">
              {facts.range || facts.subFamily || categoryLabel}
                </p>
                <h2 className="mt-1.5 text-2xl font-bold text-[var(--color-primary)] font-display">
                  {t("productDetail.related")}
                </h2>
              </div>
              {category && (
                <Link
                  to={`/produits/${category.slug}`}
                  className="hidden items-center gap-1.5 text-sm font-semibold text-[#006a9e] transition-all hover:gap-2.5 sm:flex"
                >
                  {t("common.viewAll")}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {related.map((p, ri) => (
                <Reveal key={p.id} delay={Math.min(ri, 2) * 80} className="h-full">
                <Link
                  to={productUrl(p)}
                  className="group overflow-hidden rounded-[28px] border border-[#d6d6d6] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#d6d6d6] hover:shadow-xl hover:shadow-blue-900/10 h-full block"
                >
                  <div className="aspect-video overflow-hidden bg-white">
                    <img loading="lazy" decoding="async"
                      src={p.image}
                      alt={ml(p.name)}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#5a5a5e]">{p.reference}</p>
                    <h3 className="mt-1 text-sm font-semibold text-[#1d1d1f] transition-colors group-hover:text-[var(--color-primary)]">
                      {ml(p.name)}
                    </h3>
                  </div>
                </Link>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Barre d'action fixe : le chemin d'achat reste visible pendant la lecture de la fiche (mobile / tablette) */}
      <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-[#d6d6d6] bg-white/95 p-3 backdrop-blur lg:hidden">
        <Link
          to="/distributeurs"
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] text-sm font-semibold text-white transition-colors hover:bg-[#00628f] active:scale-[0.98]"
        >
          {p(docUi.findDistributor)}
        </Link>
      </div>
    </div>
  )
}