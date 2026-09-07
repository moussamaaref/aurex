import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import type { TFunction } from "i18next"
import { categories, products, type Product } from "../data"
import { useCompare } from "../context/CompareContext"

function EnergyBadge({ cls }: { cls: string }) {
  const color =
    cls === "A+++"
      ? "bg-green-500"
      : cls === "A++"
        ? "bg-green-400"
        : cls === "A+"
          ? "bg-lime-500"
          : "bg-yellow-500"
  return (
    <span
      className={`${color} text-white text-[10px] font-bold px-1.5 py-0.5 rounded font-display tracking-wider`}
    >
      {cls}
    </span>
  )
}

function ScaleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "w-5 h-5"}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a3 3 0 01-3-3V6a3 3 0 013-3h14a3 3 0 013 3v7a3 3 0 01-3 3h-4l-4 4v-4z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18h6" />
    </svg>
  )
}

interface Row {
  key: string
  label: string
  raw: (p: Product) => string
  render: (p: Product) => React.ReactNode
  best?: "max" | "min" | "energy"
}

const EMPTY = "—"

const ENERGY_RANK = ["A+++", "A++", "A+", "A", "B", "C", "D", "E", "F", "G"]

export default function ComparePage() {
  const { t } = useTranslation()
  const { ids, remove, clear, replace, max, notify } = useCompare()
  const [searchParams, setSearchParams] = useSearchParams()
  const [copied, setCopied] = useState(false)
  const [hideIdentical, setHideIdentical] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [replacingId, setReplacingId] = useState<string | null>(null)

  useEffect(() => {
    const urlIds = searchParams.get("ids")
    if (urlIds) {
      const parsed = urlIds
        .split(",")
        .map((s) => s.trim())
        .filter((id) => products.some((p) => p.id === id))
      if (parsed.length > 0) replace(parsed)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const next = new URLSearchParams(searchParams)
    if (ids.length > 0) next.set("ids", ids.join(","))
    else next.delete("ids")
    const nextStr = next.toString()
    const curStr = searchParams.toString()
    if (nextStr !== curStr) setSearchParams(next, { replace: true })
  }, [ids, searchParams, setSearchParams])

  const selected = useMemo(
    () =>
      ids
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p)),
    [ids],
  )

  const rows = useMemo<Row[]>(() => {
    const catLabel = (p: Product) =>
      categories.find((c) => c.slug === p.category)?.label ?? p.category
    const dim = (p: Product, part: "w" | "h" | "d") =>
      p.dimensions ? `${p.dimensions[part]} cm` : ""
    const defs: Row[] = [
      {
        key: "reference",
        label: t("comparator.rows.reference"),
        raw: (p) => p.reference,
        render: (p) => (
          <span className="font-mono text-xs text-gray-500">{p.reference}</span>
        ),
      },
      {
        key: "category",
        label: t("comparator.rows.category"),
        raw: (p) => catLabel(p),
        render: (p) => (
          <span className="text-sm font-medium text-gray-700">
            {catLabel(p)}
          </span>
        ),
      },
      {
        key: "availability",
        label: t("comparator.rows.availability"),
        raw: (p) => p.badges.join(" / "),
        render: (p) =>
          p.badges.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {p.badges.map((badge) => (
                <span
                  key={badge}
                  className="text-[10px] font-bold px-2 py-0.5 rounded font-display tracking-wider bg-[#0A2463] text-white"
                >
                  {badge}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-sm text-gray-400 font-sans">
              {t("comparator.rows.noStatus")}
            </span>
          ),
      },
      {
        key: "price",
        label: t("comparator.rows.price"),
        best: "min",
        raw: (p) => (p.price ? String(p.price) : ""),
        render: (p) =>
          p.price ? (
            <span className="text-base font-bold text-[#0A2463] font-display">
              {p.price.toLocaleString("fr-DZ")} DA
            </span>
          ) : (
            <span className="text-xs text-gray-400 font-sans">
              {t("common.priceOnRequest")}
            </span>
          ),
      },
      {
        key: "capacity",
        label: t("comparator.rows.capacity"),
        best: "max",
        raw: (p) => p.capacity ?? "",
        render: (p) => (
          <span className="text-sm font-medium text-gray-800">
            {p.capacity ?? EMPTY}
          </span>
        ),
      },
      {
        key: "energyClass",
        label: t("comparator.rows.energyClass"),
        best: "energy",
        raw: (p) => p.energyClass,
        render: (p) => (
          <span className="flex items-center gap-2">
            <EnergyBadge cls={p.energyClass} />
            <span className="text-sm text-gray-700">{p.energyClass}</span>
          </span>
        ),
      },
      {
        key: "connectivity",
        label: t("comparator.rows.connectivity"),
        raw: (p) => (p.connectivity ? "1" : "0"),
        render: (p) =>
          p.connectivity ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-800">
              <svg
                className="w-4 h-4 text-[#1E5EF3]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                />
              </svg>
              {t("comparator.rows.connected")}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
              {t("comparator.rows.disconnected")}
            </span>
          ),
      },
      {
        key: "noiseLevel",
        label: t("comparator.rows.noiseLevel"),
        best: "min",
        raw: (p) => p.noiseLevel ?? "",
        render: (p) => (
          <span className="text-sm font-medium text-gray-800">
            {p.noiseLevel ?? EMPTY}
          </span>
        ),
      },
      {
        key: "width",
        label: t("comparator.rows.width"),
        raw: (p) => dim(p, "w"),
        render: (p) => (
          <span className="text-sm font-medium text-gray-800">
            {dim(p, "w") || EMPTY}
          </span>
        ),
      },
      {
        key: "height",
        label: t("comparator.rows.height"),
        raw: (p) => dim(p, "h"),
        render: (p) => (
          <span className="text-sm font-medium text-gray-800">
            {dim(p, "h") || EMPTY}
          </span>
        ),
      },
      {
        key: "depth",
        label: t("comparator.rows.depth"),
        raw: (p) => dim(p, "d"),
        render: (p) => (
          <span className="text-sm font-medium text-gray-800">
            {dim(p, "d") || EMPTY}
          </span>
        ),
      },
      {
        key: "color",
        label: t("comparator.rows.color"),
        raw: (p) => p.color ?? "",
        render: (p) => (
          <span className="text-sm font-medium text-gray-800">
            {p.color ?? EMPTY}
          </span>
        ),
      },
      {
        key: "technologies",
        label: t("comparator.rows.technologies"),
        raw: (p) => p.technologies.join(", "),
        render: (p) =>
          p.technologies.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {p.technologies.map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-medium text-[#0A2463] bg-[#EFF3FB] border border-blue-100 rounded-full px-2 py-0.5 font-sans"
                >
                  {tech}
                </span>
              ))}
            </div>
          ) : (
            EMPTY
          ),
      },
    ]
    return defs.filter((r) => selected.some((p) => r.raw(p) !== ""))
  }, [selected, t])

  const diffRow = (row: Row) =>
    new Set(selected.map((p) => row.raw(p))).size > 1

  const bestFor = (row: Row): Product | null => {
    const kind = row.best
    if (!kind || selected.length < 2) return null
    const parse = (p: Product): number | null => {
      if (kind === "energy") {
        const rank = ENERGY_RANK.indexOf(row.raw(p))
        return rank === -1 ? null : rank
      }
      const m = row.raw(p).match(/\d+(?:[.,]\d+)?/)
      return m ? Number(m[0].replace(",", ".")) : null
    }
    const nums = selected.map(parse)
    if (nums.some((n) => n === null)) return null
    const target =
      kind === "max"
        ? Math.max(...(nums as number[]))
        : Math.min(...(nums as number[]))
    const idx = (nums as number[]).findIndex((n) => n === target)
    return selected[idx] ?? null
  }

  const bestLabelKey = (row: Row) =>
    row.key === "capacity"
      ? "comparator.best.capacity"
      : row.key === "noiseLevel"
        ? "comparator.best.noise"
        : row.key === "price"
          ? "comparator.best.price"
          : "comparator.best.energy"

  const recommendation = useMemo(() => {
    if (selected.length < 2) return null
    const numeric = (value?: string) => {
      const match = value?.match(/\d+(?:[.,]\d+)?/)
      return match ? Number(match[0].replace(",", ".")) : null
    }
    const scores = selected.map((product) => {
      let score = 0
      const price = product.price
      const capacity = numeric(product.capacity)
      const noise = numeric(product.noiseLevel)
      if (price !== undefined && price === Math.min(...selected.map((p) => p.price ?? Infinity)))
        score += 2
      if (
        ENERGY_RANK.indexOf(product.energyClass) ===
        Math.min(...selected.map((p) => ENERGY_RANK.indexOf(p.energyClass)))
      )
        score += 2
      if (capacity !== null && capacity === Math.max(...selected.map((p) => numeric(p.capacity) ?? -Infinity)))
        score += 1
      if (noise !== null && noise === Math.min(...selected.map((p) => numeric(p.noiseLevel) ?? Infinity)))
        score += 1
      if (product.connectivity) score += 1
      return score
    })
    const winnerIndex = scores.indexOf(Math.max(...scores))
    const winner = selected[winnerIndex]
    if (!winner) return null
    const reasons = [
      winner.price !== undefined &&
      winner.price === Math.min(...selected.map((p) => p.price ?? Infinity))
        ? "price"
        : null,
      ENERGY_RANK.indexOf(winner.energyClass) ===
      Math.min(...selected.map((p) => ENERGY_RANK.indexOf(p.energyClass)))
        ? "energy"
        : null,
      winner.capacity &&
      numeric(winner.capacity) ===
        Math.max(...selected.map((p) => numeric(p.capacity) ?? -Infinity))
        ? "capacity"
        : null,
      winner.connectivity ? "connectivity" : null,
    ].filter((reason): reason is string => reason !== null)
    return { winner, reasons }
  }, [selected])

  const visibleRows = hideIdentical ? rows.filter(diffRow) : rows
  const hiddenCount = rows.length - visibleRows.length

  const mobileGroupFor = (key: string) => {
    if (["reference", "category", "availability", "price"].includes(key))
      return "overview"
    if (["capacity", "energyClass", "connectivity", "noiseLevel"].includes(key))
      return "performance"
    if (["width", "height", "depth", "color"].includes(key))
      return "dimensions"
    return "technologies"
  }

  const categorySet = new Set(selected.map((p) => p.category))

  const shareUrl = useMemo(() => {
    if (ids.length === 0) return ""
    return `${window.location.origin}${window.location.pathname}?ids=${encodeURIComponent(
      ids.join(","),
    )}`
  }, [ids])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
    } catch {
      const ta = document.createElement("textarea")
      ta.value = shareUrl
      ta.style.position = "fixed"
      ta.style.opacity = "0"
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  const applyReplace = (newId: string) => {
    if (!replacingId) return
    replace(ids.map((id) => (id === replacingId ? newId : id)))
    const name = products.find((p) => p.id === newId)?.name ?? ""
    notify(
      t("comparator.toastReplaced", { name }),
      t("comparator.toastView"),
      "/comparateur",
    )
    setReplacingId(null)
  }

  const doClear = () => {
    clear()
    setConfirmClear(false)
  }

  const replacingProduct = replacingId
    ? selected.find((p) => p.id === replacingId) ?? null
    : null
  const replaceCandidates: Product[] =
    replacingProduct && replacingProduct.category
      ? products.filter(
          (p) =>
            p.category === replacingProduct.category && !ids.includes(p.id),
        )
      : []

  if (selected.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] pt-28">
        {/* Hero header — empty state */}
        <div className="relative overflow-hidden bg-[#0A2463]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(30,94,243,0.5),transparent_40%),linear-gradient(120deg,#061540,#0A2463)]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#1E5EF3]/10 blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          <div className="relative max-w-7xl mx-auto px-6 py-14 lg:py-20">
            <EmptyBreadcrumb t={t} light />
            <h1
              className="text-4xl lg:text-5xl font-bold text-white mt-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t("comparator.title")}
            </h1>
            <p className="text-blue-100/80 mt-3 max-w-xl font-sans text-sm leading-relaxed">
              {t("comparator.subtitle")}
            </p>
          </div>
          <div className="relative h-8 overflow-hidden">
            <svg viewBox="0 0 1440 32" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
              <path d="M0,32 C360,0 1080,0 1440,32 L1440,32 L0,32 Z" fill="#F9FAFB" />
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16">
          <EmptyState t={t} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-28">
      {/* Hero header — with products */}
      <div className="relative overflow-hidden bg-[#0A2463]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(30,94,243,0.5),transparent_40%),linear-gradient(120deg,#061540,#0A2463)]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#1E5EF3]/10 blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 py-14 lg:py-20">
          <EmptyBreadcrumb t={t} light />
          <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
            <div>
              <h1
                className="text-4xl lg:text-5xl font-bold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {t("comparator.title")}
              </h1>
              <p className="text-blue-100/80 mt-3 max-w-xl font-sans text-sm leading-relaxed">
                {t("comparator.subtitle")}
              </p>
            </div>
            <span
              className="inline-flex items-center gap-2 text-sm text-white font-sans bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2"
              role="status"
            >
              <span className="w-2 h-2 rounded-full bg-[#1E5EF3] animate-pulse" />
              <strong className="font-semibold">{selected.length}</strong>
              {" "}{selected.length === 1 ? t("comparator.countOne") : t("comparator.count", { count: selected.length })}
            </span>
          </div>
          {selected.length === 1 && (
            <p className="text-xs text-blue-200/70 mt-3 font-sans">
              {t("comparator.needsTwo")}
            </p>
          )}
        </div>
        <div className="relative h-8 overflow-hidden">
          <svg viewBox="0 0 1440 32" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
            <path d="M0,32 C360,0 1080,0 1440,32 L1440,32 L0,32 Z" fill="#F9FAFB" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-wrap items-center gap-2.5 mb-5 sm:mb-6 no-print bg-white rounded-2xl border border-gray-100 shadow-sm px-3 py-3 sm:px-4">
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 bg-gray-50 rounded-xl px-4 py-2 hover:bg-[#EFF3FB] hover:border-[#1E5EF3]/30 hover:text-[#1E5EF3] transition-all duration-200 font-sans"
          >
            {copied ? (
              <>
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {t("comparator.actions.copied")}
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                {t("comparator.actions.share")}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 bg-gray-50 rounded-xl px-4 py-2 hover:bg-[#EFF3FB] hover:border-[#1E5EF3]/30 hover:text-[#1E5EF3] transition-all duration-200 font-sans"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7a2 2 0 00-2 2v4a2 2 0 002 2zm0-10V5a2 2 0 012-2h6a2 2 0 012 2v2"
              />
            </svg>
            {t("comparator.actions.print")}
          </button>

          <button
            type="button"
            onClick={() => setHideIdentical((v) => !v)}
            aria-pressed={hideIdentical}
            title={t("comparator.hideIdenticalTitle")}
            className={`inline-flex items-center gap-2 text-sm font-medium rounded-xl px-4 py-2 transition-all duration-200 font-sans ${
              hideIdentical
                ? "bg-[#0A2463] text-white border border-[#0A2463] shadow-lg shadow-[#0A2463]/20"
                : "text-gray-700 border border-gray-200 bg-gray-50 hover:bg-[#EFF3FB] hover:border-[#1E5EF3]/30 hover:text-[#1E5EF3]"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              {hideIdentical ? (
                <>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.364-6.364l-1.414 1.414M8.05 15.95l-1.414 1.414m0-10.728l1.414 1.414m10.728 10.728l-1.414 1.414M8 12a4 4 0 118 0 4 4 0 01-8 0z"
                  />
                </>
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
              )}
            </svg>
            {hideIdentical
              ? t("comparator.showIdentical")
              : t("comparator.hideIdentical")}
            {hideIdentical && hiddenCount > 0 && (
              <span className="text-[10px] font-bold bg-white/20 rounded-full px-1.5 py-0.5">
                {t("comparator.hiddenRows", { count: hiddenCount })}
              </span>
            )}
          </button>

          <div className="flex-1" />

          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            className="inline-flex items-center gap-2 text-sm font-medium text-red-600 border border-red-100 bg-red-50 rounded-xl px-4 py-2 hover:bg-red-100 hover:border-red-200 transition-all duration-200 font-sans"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            {t("comparator.actions.clear")}
          </button>
        </div>

        {categorySet.size > 1 && (
          <div
            className="flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6 font-sans no-print"
            role="note"
          >
            <svg
              className="w-4 h-4 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="leading-relaxed">{t("comparator.categoryMismatch")}</p>
          </div>
        )}

        <p className="text-xs text-gray-500 mb-3 md:hidden font-sans">
          {t("comparator.mobileHint")}
        </p>

        <div className="md:hidden space-y-3">
          <div className="sticky top-[104px] z-20 -mx-4 bg-[#F9FAFB]/95 px-4 py-2 backdrop-blur-sm sm:-mx-6 sm:px-6">
            <div className="overflow-x-auto overscroll-x-contain pb-1">
              <div className="flex gap-3">
                {selected.map((p) => (
                  <div
                    key={p.id}
                    className="w-[calc((100vw-3.5rem)/2)] min-w-[150px] max-w-[190px] shrink-0 rounded-2xl border border-gray-100 bg-white p-2.5 shadow-md sm:w-[220px] sm:p-3"
                  >
                    <Link to={`/produits/${p.category}/${p.id}`} className="block">
                      <div className="mb-2.5 aspect-[4/3] overflow-hidden rounded-xl bg-gray-50 sm:mb-3 sm:aspect-square">
                        <img
                          src={p.image}
                          alt={p.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-[9px] text-gray-400 font-mono tracking-wider uppercase">
                        {p.reference}
                      </p>
                      <p className="mt-1 line-clamp-2 text-[11px] font-semibold leading-snug text-gray-900 sm:text-xs">
                        {p.name}
                      </p>
                    </Link>
                    {p.price && (
                      <p className="mt-2 text-sm font-bold text-[#0A2463] font-display sm:text-base">
                        {p.price.toLocaleString("fr-DZ")} DA
                      </p>
                    )}
                    <div className="flex gap-1.5 mt-3">
                      <button
                        type="button"
                        onClick={() => setReplacingId(p.id)}
                        className="flex-1 rounded-lg bg-[#EFF3FB] px-1.5 py-2 text-[10px] font-semibold text-[#1E5EF3] sm:px-2 sm:text-[11px]"
                      >
                        {t("comparator.replace")}
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(p.id)}
                        aria-label={t("comparator.remove")}
                        className="w-9 text-gray-500 border border-gray-200 rounded-lg flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {selected.length === 1 && (
            <Link
              to={`/produits/${selected[0].category}`}
              className="flex items-center justify-center gap-2 bg-white border border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold text-[#1E5EF3]"
            >
              <ScaleIcon className="w-4 h-4" />
              {t("comparator.addMoreCta")}
            </Link>
          )}

          {visibleRows.length > 0 ? (
            visibleRows.map((row, index) => {
              const isDiff = diffRow(row)
              const best = isDiff ? bestFor(row) : null
              const group = mobileGroupFor(row.key)
              const previousGroup =
                index > 0 ? mobileGroupFor(visibleRows[index - 1].key) : null
              return (
                <div key={row.key}>
                  {group !== previousGroup && (
                    <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#0A2463] px-1 pt-5 pb-2">
                      {t(`comparator.groups.${group}`)}
                    </h2>
                  )}
                  <section
                    className={`bg-white rounded-xl border overflow-hidden ${
                      isDiff ? "border-amber-200" : "border-gray-100"
                    }`}
                  >
                    <h3
                      className={`px-4 py-3 text-[11px] font-bold uppercase tracking-wider ${
                        isDiff
                          ? "bg-amber-50 text-amber-800"
                          : "bg-[#F8FAFC] text-gray-500"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isDiff && (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-400 text-white text-[11px]">
                            ≠
                          </span>
                        )}
                        {row.label}
                      </span>
                    </h3>
                    <div
                      className={`grid ${
                        selected.length === 3 ? "grid-cols-3" : "grid-cols-2"
                      } divide-x divide-gray-100`}
                    >
                      {selected.map((p) => (
                        <div key={p.id} className="p-4 min-w-0">
                          <p className="text-[10px] text-gray-400 font-medium truncate mb-2">
                            {p.name}
                          </p>
                          <div className="min-h-6">{row.render(p)}</div>
                          {isDiff && best?.id === p.id && (
                            <span className="mt-2 inline-flex items-center text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-1">
                              {t(bestLabelKey(row))}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )
            })
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-500">
              {t("comparator.allIdentical")}
            </div>
          )}
        </div>

        <div className="hidden md:block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto overscroll-x-contain">
            <table className="w-full min-w-[860px] text-sm font-sans border-collapse">
              <thead>
                <tr>
                  <th
                    className="sticky start-0 z-20 bg-white w-44 min-w-44 p-5 text-start align-top border-b border-gray-100"
                    scope="col"
                  >
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 font-display">
                      {t("comparator.attributes")}
                    </span>
                  </th>
                  {selected.map((p) => (
                    <th
                      key={p.id}
                      scope="col"
                      className="min-w-[210px] w-[210px] p-5 text-start align-top border-b border-gray-100 bg-white"
                    >
                      <div className="flex flex-col gap-3">
                        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                          <Link
                            to={`/produits/${p.category}/${p.id}`}
                            aria-label={p.name}
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                          </Link>
                          <div className="absolute top-2 left-2 flex flex-col gap-1">
                            {p.badges.slice(0, 1).map((badge) => (
                              <span
                                key={badge}
                                className="text-[9px] font-bold px-2 py-0.5 rounded font-display tracking-wider bg-[#0A2463] text-white"
                              >
                                {badge}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase -mt-1">
                          {p.reference}
                        </p>
                        <Link
                          to={`/produits/${p.category}/${p.id}`}
                          className="text-sm font-semibold text-gray-900 hover:text-[#0A2463] transition-colors font-sans line-clamp-2 leading-snug"
                        >
                          {p.name}
                        </Link>
                        {p.price && (
                          <span className="text-lg font-bold text-[#0A2463] font-display">
                            {p.price.toLocaleString("fr-DZ")} DA
                          </span>
                        )}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setReplacingId(p.id)}
                            aria-label={t("comparator.replace", {
                              name: p.name,
                            })}
                            title={t("comparator.replaceTitle")}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1E5EF3] hover:text-[#0A2463] border border-blue-100 bg-[#EFF3FB] rounded-lg px-2.5 py-1.5 hover:bg-[#E4ECFB] transition-colors font-sans"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                            {t("comparator.replace")}
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(p.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-red-600 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:border-red-200 transition-colors font-sans"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            {t("comparator.remove")}
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}
                  {selected.length === 1 && (
                    <th
                      scope="col"
                      className="min-w-[190px] p-5 align-top border-b border-gray-100 bg-white"
                    >
                      <div className="border-2 border-dashed border-gray-200 rounded-xl h-full min-h-[300px] flex flex-col items-center justify-center gap-3 p-4 text-center">
                        <ScaleIcon className="w-6 h-6 text-gray-300" />
                        <p className="text-xs text-gray-500 font-sans">
                          {t("comparator.addMoreCta")}
                        </p>
                        <Link
                          to={`/produits/${selected[0].category}`}
                          className="text-xs font-medium text-[#1E5EF3] hover:underline font-sans"
                        >
                          {t("comparator.browse")}
                        </Link>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => {
                  const isDiff = diffRow(row)
                  const best = isDiff ? bestFor(row) : null
                  return (
                    <tr
                      key={row.key}
                      className={isDiff ? "bg-amber-50/60" : "bg-white"}
                    >
                      <th
                        scope="row"
                        className={`sticky start-0 z-10 w-44 min-w-44 p-5 text-start align-top text-xs font-display uppercase tracking-wide border-b border-gray-50 ${
                          isDiff
                            ? "bg-amber-50 text-amber-800 border-s-4 border-s-amber-400"
                            : "bg-white text-gray-500"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isDiff && (
                            <>
                              <span
                                className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-400 text-white text-[11px] font-bold flex-shrink-0"
                                aria-hidden="true"
                                title={t("comparator.diffTooltip")}
                              >
                                ≠
                              </span>
                              <span className="sr-only">
                                {t("comparator.diffSr")}
                              </span>
                            </>
                          )}
                          {row.label}
                        </span>
                      </th>
                      {selected.map((p) => (
                        <td
                          key={p.id}
                          className={`p-5 align-top border-b border-gray-50 ${
                            isDiff ? "bg-amber-50/40" : "bg-white"
                          }`}
                        >
                          {row.render(p)}
                          {isDiff && best?.id === p.id && (
                            <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5 font-sans">
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8 7l4-4 4 4m-4-4v18"
                                />
                              </svg>
                              {t(bestLabelKey(row))}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  )
                })}
                {visibleRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={selected.length + 1}
                      className="p-8 text-center text-sm text-gray-500 font-sans"
                    >
                      {t("comparator.allIdentical")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {recommendation && (
          <section className="mt-8 relative overflow-hidden rounded-3xl bg-[#0A2463] p-5 sm:p-8">
            {/* Décors */}
            <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-[#1E5EF3]/20 blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-[#1E5EF3]/10 blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A9C4FF] font-display">
                  {t("comparator.recommendation.title")}
                </p>
                <h2 className="mt-2 text-xl font-bold text-white font-display">
                  {recommendation.winner.name}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100/80 font-sans">
                  {t("comparator.recommendation.description")}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {recommendation.reasons.map((reason) => (
                    <span
                      key={reason}
                      className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white font-sans"
                    >
                      {t(`comparator.recommendation.reasons.${reason}`)}
                    </span>
                  ))}
                </div>
              </div>
              <Link
                to={`/produits/${recommendation.winner.category}/${recommendation.winner.id}`}
                className="relative inline-flex flex-shrink-0 items-center gap-2 justify-center rounded-xl bg-white text-[#0A2463] px-6 py-3.5 text-sm font-semibold transition-all hover:bg-blue-50 hover:shadow-lg hover:-translate-y-0.5 font-sans"
              >
                {t("comparator.recommendation.viewProduct")}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>
        )}

        <div
          className="mt-4 flex items-center gap-2 text-xs text-gray-500 font-sans no-print"
          aria-label={t("comparator.legend")}
        >
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-400 text-white text-[11px] font-bold">
            ≠
          </span>
          {t("comparator.legend")}
        </div>

        {ids.length >= max && (
          <p className="mt-3 text-xs text-gray-500 font-sans no-print">
            {t("comparator.maxReached", { max })}
          </p>
        )}

        <div className="mt-10 no-print">
          <Link
            to="/produits"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1E5EF3] hover:text-[#0A2463] transition-colors font-sans"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
            {t("comparator.addProducts")}
          </Link>
        </div>
      </div>

      {confirmClear && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print"
          role="alertdialog"
          aria-modal="true"
          aria-label={t("comparator.clearConfirm.title")}
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setConfirmClear(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <h2
              className="text-lg font-bold text-gray-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t("comparator.clearConfirm.title")}
            </h2>
            <p className="text-sm text-gray-500 mt-2 font-sans leading-relaxed">
              {t("comparator.clearConfirm.message")}
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="text-sm font-medium text-gray-600 border border-gray-200 rounded-lg px-4 py-2.5 hover:bg-gray-50 transition-colors font-sans"
              >
                {t("comparator.clearConfirm.cancel")}
              </button>
              <button
                type="button"
                onClick={doClear}
                className="text-sm font-semibold text-white bg-red-600 rounded-lg px-4 py-2.5 hover:bg-red-700 transition-colors font-sans"
              >
                {t("comparator.clearConfirm.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {replacingProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print"
          role="dialog"
          aria-modal="true"
          aria-label={t("comparator.replaceModal.title", {
            name: replacingProduct.name,
          })}
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setReplacingId(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[80vh]">
            <div className="flex items-start justify-between gap-4 p-6 pb-4 border-b border-gray-100">
              <div>
                <h2
                  className="text-lg font-bold text-gray-900"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {t("comparator.replaceModal.title", {
                    name: replacingProduct.name,
                  })}
                </h2>
                <p className="text-sm text-gray-500 mt-1 font-sans">
                  {t("comparator.replaceModal.subtitle")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReplacingId(null)}
                aria-label={t("comparator.close")}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto p-6">
              {replaceCandidates.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500 font-sans">
                    {t("comparator.replaceModal.empty")}
                  </p>
                  <Link
                    to="/produits"
                    onClick={() => setReplacingId(null)}
                    className="inline-block mt-4 text-sm font-medium text-[#1E5EF3] hover:text-[#0A2463] font-sans"
                  >
                    {t("comparator.replaceModal.browse")}
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {replaceCandidates.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => applyReplace(c.id)}
                      className="group flex items-center gap-3 border border-gray-100 rounded-xl p-3 text-start hover:border-[#1E5EF3]/40 hover:bg-[#F7FAFF] transition-colors"
                    >
                      <img
                        src={c.image}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover bg-gray-50 flex-shrink-0"
                      />
                      <span className="flex-1 min-w-0">
                        <span className="block text-xs font-medium text-gray-900 line-clamp-2 leading-snug font-sans">
                          {c.name}
                        </span>
                        {c.price && (
                          <span className="block text-sm font-bold text-[#0A2463] mt-1 font-display">
                            {c.price.toLocaleString("fr-DZ")} DA
                          </span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyBreadcrumb({ t, light }: { t: TFunction; light?: boolean }) {
  const base = light ? "text-white/50" : "text-gray-400"
  const hover = light ? "hover:text-white/80" : "hover:text-gray-600"
  const active = light ? "text-white/80" : "text-gray-700"
  return (
    <nav
      className={`flex items-center gap-2 text-xs mb-4 font-sans ${base}`}
      aria-label="Breadcrumb"
    >
      <Link to="/" className={`transition-colors ${hover}`}>
        {t("products.breadcrumb.home")}
      </Link>
      <span>/</span>
      <Link to="/produits" className={`transition-colors ${hover}`}>
        {t("products.breadcrumb.products")}
      </Link>
      <span>/</span>
      <span className={active}>{t("comparator.title")}</span>
    </nav>
  )
}

function EmptyState({ t }: { t: TFunction }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      {/* Icône centrale */}
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 rounded-2xl bg-[#1E5EF3]/10 blur-lg" />
        <div className="relative w-20 h-20 bg-[#EFF3FB] rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
          <ScaleIcon className="w-10 h-10 text-[#1E5EF3]" />
        </div>
      </div>
      <h2
        className="text-2xl font-bold text-[#0A2463]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {t("comparator.empty.title")}
      </h2>
      <p className="text-gray-500 mt-3 text-sm font-sans leading-relaxed max-w-md mx-auto">
        {t("comparator.empty.desc")}
      </p>
      <Link
        to="/produits"
        className="inline-flex items-center gap-2 mt-7 bg-[#0A2463] text-white font-semibold px-7 py-3.5 rounded-xl text-sm font-sans hover:bg-[#061540] transition-all hover:shadow-xl hover:shadow-[#0A2463]/20 hover:-translate-y-0.5"
      >
        {t("comparator.empty.browse")}
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>

      <p className="mt-14 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-5 font-display">
        {t("comparator.empty.suggestions")}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.slice(0, 4).map((p) => (
          <SuggestionCard key={p.id} product={p} t={t} />
        ))}
      </div>
    </div>
  )
}

function SuggestionCard({ product, t }: { product: Product; t: TFunction }) {
  const { add, has, ids, max, remove } = useCompare()
  const added = has(product.id)
  const full = ids.length >= max && !added

  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-4 text-start hover:border-[#1E5EF3]/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="relative flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-16 h-16 rounded-xl object-cover bg-gray-50"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-900 font-sans line-clamp-2 leading-snug">
          {product.name}
        </p>
        {product.price && (
          <p className="text-sm font-bold text-[#0A2463] mt-1 font-display">
            {product.price.toLocaleString("fr-DZ")} DA
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => (added ? remove(product.id) : add(product.id))}
        aria-pressed={added}
        title={
          full
            ? t("comparator.maxReached", { max })
            : added
              ? t("comparator.inCompare")
              : t("comparator.addToCompare")
        }
        className={`flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold rounded-xl px-3 py-2 border transition-all duration-200 font-sans ${
          added
            ? "bg-[#0A2463] text-white border-[#0A2463] shadow-lg shadow-[#0A2463]/20"
            : full
              ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
              : "bg-white text-[#1E5EF3] border-[#1E5EF3]/25 hover:bg-[#EFF3FB] hover:border-[#1E5EF3]/60"
        }`}
      >
        {added ? t("comparator.added") : t("comparator.compare")}
      </button>
    </div>
  )
}
