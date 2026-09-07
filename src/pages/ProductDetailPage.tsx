import { useState } from "react"
import { Link, useParams, Navigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { products, categories } from "../data"
import CompareButton from "../components/CompareButton"

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
      className={`${color} text-white text-xs font-bold px-2 py-1 rounded-md font-display tracking-wider shadow-sm`}
    >
      {cls}
    </span>
  )
}

export default function ProductDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string; category: string }>()
  const product = products.find((p) => p.id === id)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState<"features" | "specs" | "docs">(
    "features",
  )
  const [isImageFullscreen, setIsImageFullscreen] = useState(false)

  if (!product) return <Navigate to="/produits" replace />

  const images = product.images ?? [product.image]
  const category = categories.find((c) => c.slug === product.category)
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3)

  const badgeStyle = (badge: string) =>
    badge === "Nouveau"
      ? "bg-[#0A2463] text-white"
      : badge === "Promotion"
        ? "bg-red-500 text-white"
        : badge === "Best Seller"
          ? "bg-amber-400 text-amber-900"
          : "bg-[#1E5EF3] text-white"

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      {/* ══ Breadcrumb ══ */}
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3.5 sm:px-6">
          <nav
            className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="transition-colors hover:text-[#0A2463]">
              {t("products.breadcrumb.home")}
            </Link>
            <svg className="h-3 w-3 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <Link to="/produits" className="transition-colors hover:text-[#0A2463]">
              {t("products.breadcrumb.products")}
            </Link>
            <svg className="h-3 w-3 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <Link
              to={`/produits/${product.category}`}
              className="transition-colors hover:text-[#0A2463]"
            >
              {category?.label}
            </Link>
            <svg className="h-3 w-3 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <span className="font-medium text-[#0A2463]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* ══ Galerie ══ */}
          <div className="space-y-4">
            <div
              className={`overflow-hidden bg-white shadow-sm ${
                isImageFullscreen
                  ? "fixed inset-0 z-[70] flex h-[100dvh] w-screen items-center justify-center rounded-none border-0"
                  : "relative aspect-square rounded-2xl border border-slate-100"
              }`}
            >
              <img
                src={images[selectedImage]}
                alt={product.name}
                draggable={false}
                className={`select-none transition-opacity duration-300 ${
                  isImageFullscreen
                    ? "h-auto max-h-[80vh] w-auto max-w-[80vw] object-contain"
                    : "h-full w-full object-cover"
                }`}
              />
              <button
                type="button"
                aria-label={
                  isImageFullscreen
                    ? t("productDetail.exitFullscreen")
                    : t("productDetail.fullscreen")
                }
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => setIsImageFullscreen((value) => !value)}
                className="absolute right-4 top-4 rounded-xl bg-white/90 p-3 text-[#0A2463] shadow-lg backdrop-blur transition-colors hover:bg-[#1E5EF3] hover:text-white"
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
                    key={badge}
                    className={`rounded-md px-2.5 py-1.5 text-[10px] font-bold tracking-wider shadow-sm ${badgeStyle(badge)}`}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-white transition-all ${
                      selectedImage === i
                        ? "border-[#1E5EF3] shadow-md ring-2 ring-blue-100"
                        : "border-slate-100 hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ══ Fiche ══ */}
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <EnergyBadge cls={product.energyClass} />
              {product.connectivity && (
                <span className="flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#1E5EF3]">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                  </svg>
                  SmartConnect
                </span>
              )}
            </div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-slate-400">
              {product.reference}
            </p>
            <h1 className="text-3xl font-bold leading-tight text-[#0A2463] lg:text-4xl font-display">
              {product.name}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              {product.description}
            </p>

            {/* Specs rapides */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                product.capacity && {
                  label: t("productDetail.capacity"),
                  value: product.capacity,
                },
                {
                  label: t("productDetail.energyClass"),
                  value: product.energyClass,
                },
                product.noiseLevel && {
                  label: t("productDetail.noiseLevel"),
                  value: product.noiseLevel,
                },
                product.dimensions && {
                  label: t("productDetail.dimensions"),
                  value: `${product.dimensions.w} × ${product.dimensions.h} × ${product.dimensions.d} cm`,
                },
                product.color && {
                  label: t("productDetail.color"),
                  value: product.color,
                },
              ]
                .filter(Boolean)
                .map((spec) => (
                  <div
                    key={(spec as { label: string }).label}
                    className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <p className="font-display text-[10px] uppercase tracking-widest text-slate-400">
                      {(spec as { label: string }).label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {(spec as { value: string }).value}
                    </p>
                  </div>
                ))}
            </div>

            {/* Technologies */}
            {product.technologies.length > 0 && (
              <div className="mt-5">
                <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 font-display">
                  {t("productDetail.technologiesTitle")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-blue-100 bg-[#EFF3FB] px-3.5 py-1.5 text-xs font-semibold text-[#0A2463] transition-colors hover:border-blue-200 hover:bg-blue-50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Prix + CTA */}
            <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              {product.price && (
                <div className="mb-5">
                  <p className="font-display text-3xl font-bold text-[#0A2463]">
                    {product.price.toLocaleString("fr-DZ")} DA
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {t("productDetail.priceRecommended")}
                  </p>
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/distributeurs"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0A2463] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-900/20 transition-all hover:-translate-y-0.5 hover:bg-[#12348f] hover:shadow-lg"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {t("common.whereToBuy")}
                </Link>
                <CompareButton
                  productId={product.id}
                  variant="detail"
                  navigateToCompare
                />
              </div>
              <Link
                to="/support"
                className="mt-4 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:text-[#0A2463]"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t("productDetail.downloadNotice")}
              </Link>
            </div>
          </div>
        </div>

        {/* ══ Onglets ══ */}
        <div className="mt-16 rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex overflow-x-auto border-b border-slate-100 px-4 sm:px-6">
            {[
              { key: "features" as const, label: t("productDetail.tabs.features") },
              { key: "specs" as const, label: t("productDetail.tabs.specs") },
              { key: "docs" as const, label: t("productDetail.tabs.docs") },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`-mb-px whitespace-nowrap border-b-2 px-6 py-4 text-sm font-semibold transition-colors ${
                  activeTab === tab.key
                    ? "border-[#1E5EF3] text-[#1E5EF3]"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === "features" && (
              <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {product.features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition-colors hover:border-blue-100 hover:bg-blue-50/40"
                  >
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#1E5EF3]/10">
                      <svg className="h-3 w-3 text-[#1E5EF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-slate-700">{feat}</span>
                  </li>
                ))}
              </ul>
            )}
            {activeTab === "specs" && (
              <div className="overflow-hidden rounded-xl border border-slate-100">
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      { label: t("productDetail.specsTable.reference"), value: product.reference },
                      { label: t("productDetail.specsTable.category"), value: category?.label },
                      product.capacity && { label: t("productDetail.specsTable.capacity"), value: product.capacity },
                      { label: t("productDetail.specsTable.energyClass"), value: product.energyClass },
                      product.noiseLevel && { label: t("productDetail.specsTable.noiseLevel"), value: product.noiseLevel },
                      product.dimensions && { label: t("productDetail.specsTable.width"), value: `${product.dimensions.w} cm` },
                      product.dimensions && { label: t("productDetail.specsTable.height"), value: `${product.dimensions.h} cm` },
                      product.dimensions && { label: t("productDetail.specsTable.depth"), value: `${product.dimensions.d} cm` },
                      product.color && { label: t("productDetail.specsTable.color"), value: product.color },
                      {
                        label: t("productDetail.specsTable.wifi"),
                        value: product.connectivity
                          ? t("productDetail.specsTable.yesSmartConnect")
                          : t("productDetail.specsTable.no"),
                      },
                      { label: t("productDetail.specsTable.technologies"), value: product.technologies.join(", ") },
                    ]
                      .filter(Boolean)
                      .map((row, i) => (
                        <tr
                          key={(row as { label: string }).label}
                          className={i % 2 === 0 ? "bg-white" : "bg-slate-50/70"}
                        >
                          <td className="w-1/2 border-b border-slate-50 px-5 py-3.5 font-medium text-slate-500">
                            {(row as { label: string }).label}
                          </td>
                          <td className="border-b border-slate-50 px-5 py-3.5 font-semibold text-slate-900">
                            {(row as { value: string }).value}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === "docs" && (
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  {
                    name: t("productDetail.docs.userManual", { ref: product.reference }),
                    type: "PDF",
                    size: "2.4 Mo",
                    icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
                  },
                  {
                    name: t("productDetail.docs.techSheet", { ref: product.reference }),
                    type: "PDF",
                    size: "1.1 Mo",
                    icon: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z",
                  },
                  {
                    name: t("productDetail.docs.warrantyCert"),
                    type: "PDF",
                    size: "0.5 Mo",
                    icon: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z",
                  },
                  {
                    name: t("productDetail.docs.troubleshoot"),
                    type: "PDF",
                    size: "3.2 Mo",
                    icon: "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z",
                  },
                ].map((doc) => (
                  <div
                    key={doc.name}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 transition-all hover:border-blue-100 hover:shadow-md hover:shadow-blue-900/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#EFF3FB]">
                        <svg className="h-5 w-5 text-[#1E5EF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={doc.icon} />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{doc.name}</p>
                        <p className="text-xs text-slate-400">
                          {doc.type} · {doc.size}
                        </p>
                      </div>
                    </div>
                    <button className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-[#1E5EF3] transition-colors hover:bg-blue-50 hover:text-[#0A2463]">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      {t("common.download")}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══ Produits similaires ══ */}
        {related.length > 0 && (
          <div className="mt-14">
            <div className="mb-7 flex items-end justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1E5EF3] font-display">
                  {category?.label}
                </p>
                <h2 className="mt-1.5 text-2xl font-bold text-[#0A2463] font-display">
                  {t("productDetail.related")}
                </h2>
              </div>
              {category && (
                <Link
                  to={`/produits/${category.slug}`}
                  className="hidden items-center gap-1.5 text-sm font-semibold text-[#1E5EF3] transition-all hover:gap-2.5 sm:flex"
                >
                  {t("common.viewAll")}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to={`/produits/${p.category}/${p.id}`}
                  className="group overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/10"
                >
                  <div className="aspect-video overflow-hidden bg-slate-100">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">{p.reference}</p>
                    <h3 className="mt-1 text-sm font-semibold text-slate-900 transition-colors group-hover:text-[#0A2463]">
                      {p.name}
                    </h3>
                    {p.price && (
                      <p className="mt-2 font-display text-sm font-bold text-[#0A2463]">
                        {p.price.toLocaleString("fr-DZ")} DA
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}