import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import L from "leaflet"

interface Distributor {
  id: string
  name: string
  address: string
  wilaya: string
  commune: string
  phone: string
  email?: string
  lat: number
  lng: number
}

const distributors: Distributor[] = [
  { id: "alger-centre", name: "AUREX Alger Centre", address: "18 rue Didouche Mourad", wilaya: "Alger", commune: "Alger Centre", phone: "+213 21 63 45 20", email: "alger.centre@aurex.dz", lat: 36.7525, lng: 3.042 },
  { id: "oran", name: "AUREX Oran", address: "12 boulevard de l'Indépendance", wilaya: "Oran", commune: "Oran", phone: "+213 41 29 18 60", email: "oran@aurex.dz", lat: 35.6971, lng: -0.6308 },
  { id: "constantine", name: "AUREX Constantine", address: "7 avenue Aouati Mostefa", wilaya: "Constantine", commune: "Constantine", phone: "+213 31 92 14 40", lat: 36.365, lng: 6.6147 },
  { id: "setif", name: "AUREX Sétif", address: "45 rue des Frères Meslem", wilaya: "Sétif", commune: "Sétif", phone: "+213 36 82 07 15", lat: 36.19, lng: 5.4108 },
  { id: "blida", name: "AUREX Blida", address: "3 rue Larbi Ben M'hidi", wilaya: "Blida", commune: "Blida", phone: "+213 25 41 10 22", lat: 36.47, lng: 2.8277 },
  { id: "tlemcen", name: "AUREX Tlemcen", address: "20 boulevard Pasteur", wilaya: "Tlemcen", commune: "Tlemcen", phone: "+213 43 27 34 80", lat: 34.8828, lng: -1.3167 },
  { id: "annaba", name: "AUREX Annaba", address: "9 cours de la Révolution", wilaya: "Annaba", commune: "Annaba", phone: "+213 38 86 12 10", lat: 36.9, lng: 7.7669 },
  { id: "bejaia", name: "AUREX Béjaïa", address: "11 rue de la Liberté", wilaya: "Béjaïa", commune: "Béjaïa", phone: "+213 34 21 09 30", lat: 36.7509, lng: 5.0567 },
]

const markerIcon = L.divIcon({
  className: "aurex-map-marker",
  html: '<span aria-hidden="true"></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
})

const algeriaBounds = L.latLngBounds(
  [18.9, -8.7],
  [37.3, 12.2],
)

const wilayaCode: Record<string, number> = {
  Alger: 16, Oran: 31, Constantine: 25, "Sétif": 19, Blida: 9,
  Tlemcen: 13, Annaba: 23, "Béjaïa": 6,
}

export default function DistributorsPage() {
  const { t } = useTranslation()
  const [wilaya, setWilaya] = useState("")
  const [commune, setCommune] = useState("")
  const [selected, setSelected] = useState<Distributor | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const mapShellRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const wilayas = useMemo(
    () => [...new Set(distributors.map((d) => d.wilaya))].sort(),
    [],
  )
  const communes = useMemo(
    () =>
      [...new Set(distributors.filter((d) => !wilaya || d.wilaya === wilaya).map((d) => d.commune))].sort(),
    [wilaya],
  )
  const filtered = useMemo(
    () =>
      distributors.filter(
        (d) => (!wilaya || d.wilaya === wilaya) && (!commune || d.commune === commune),
      ),
    [wilaya, commune],
  )

  useEffect(() => {
    if (commune && !communes.includes(commune)) setCommune("")
  }, [commune, communes])

  useEffect(() => {
    const map = L.map("distributors-map", {
      center: [28.2, 2.6],
      zoom: 5.5,
      minZoom: 5.5,
      maxZoom: 18,
      scrollWheelZoom: false,
      maxBounds: algeriaBounds,
      maxBoundsViscosity: 1,
    })
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    filtered.forEach((distributor) => {
      const marker = L.marker([distributor.lat, distributor.lng], {
        icon: markerIcon,
        title: distributor.name,
      }).addTo(map)
      marker.on("click", () => setSelected(distributor))
    })

    if (filtered.length > 0) {
      map.fitBounds(
        L.latLngBounds(filtered.map((d) => [d.lat, d.lng])),
        {
          padding: [40, 40],
          maxZoom: filtered.length === 1 ? 12 : 7,
        },
      )
    } else {
      map.fitBounds(algeriaBounds, { padding: [12, 12] })
    }
    return () => {
      map.remove()
    }
  }, [filtered])

  const handleSelect = (distributor: Distributor) => {
    setSelected(distributor)
    listRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }

  const directionsUrl = selected
    ? `https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`
    : ""

  const toggleFullscreen = async () => {
    if (!mapShellRef.current) return
    if (document.fullscreenElement) await document.exitFullscreen()
    else await mapShellRef.current.requestFullscreen()
  }

  useEffect(() => {
    const syncFullscreen = () =>
      setIsFullscreen(document.fullscreenElement === mapShellRef.current)
    document.addEventListener("fullscreenchange", syncFullscreen)
    return () => document.removeEventListener("fullscreenchange", syncFullscreen)
  }, [])

  const resetFilters = () => {
    setWilaya("")
    setCommune("")
  }

  const hasFilters = wilaya !== "" || commune !== ""

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      {/* ══ Header ══ */}
      <section className="relative overflow-hidden bg-[#0A2463] px-6 pb-24 pt-14 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#1E5EF3]/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-300 font-display">
            {t("distributors.eyebrow")}
          </p>
          <h1 className="mt-3 text-4xl font-bold lg:text-5xl font-display">
            {t("distributors.title")}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-blue-100/90 font-sans">
            {t("distributors.description")}
          </p>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 backdrop-blur-sm">
              <span className="text-2xl font-bold font-display">{distributors.length}</span>
              <span className="text-xs font-medium text-blue-200">{t("distributors.statsPoints")}</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 backdrop-blur-sm">
              <span className="text-2xl font-bold font-display">{wilayas.length}</span>
              <span className="text-xs font-medium text-blue-200">{t("distributors.statsWilayas")}</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 backdrop-blur-sm">
              <span className="text-2xl font-bold font-display">
                {distributors.filter((d) => d.email).length}
              </span>
              <span className="text-xs font-medium text-blue-200">{t("distributors.statsAgencies")}</span>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        {/* ══ Filtres (carte flottante) ══ */}
        <div className="relative z-10 -mt-12 mb-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-lg shadow-slate-900/5 sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto_auto]">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans">
              {t("distributors.wilaya")}
              <select
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-3 text-sm font-medium normal-case tracking-normal text-slate-800 outline-none transition focus:border-[#1E5EF3] focus:bg-white focus:ring-4 focus:ring-blue-100 font-sans"
              >
                <option value="">{t("distributors.allWilayas")}</option>
                {wilayas.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans">
              {t("distributors.commune")}
              <select
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-3 text-sm font-medium normal-case tracking-normal text-slate-800 outline-none transition focus:border-[#1E5EF3] focus:bg-white focus:ring-4 focus:ring-blue-100 font-sans"
              >
                <option value="">{t("distributors.allCommunes")}</option>
                {communes.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>
            <div className="flex items-end">
              <p className="whitespace-nowrap rounded-xl bg-[#0A2463] px-5 py-3 text-sm font-bold text-white font-sans">
                {filtered.length} {t("distributors.results")}
              </p>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={resetFilters}
                disabled={!hasFilters}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 font-sans"
              >
                {t("distributors.reset")}
              </button>
            </div>
          </div>
        </div>

        {/* ══ Carte + Panneau ══ */}
        <div className="grid gap-5 lg:grid-cols-[1.45fr_0.55fr]">
          {/* Carte */}
          <div
            ref={mapShellRef}
            className={`aurex-map-fullscreen relative min-h-[420px] overflow-hidden border border-slate-200 bg-[#DCEAF5] shadow-sm sm:min-h-[560px] ${
              isFullscreen ? "rounded-none" : "rounded-2xl"
            }`}
          >
            <div id="distributors-map" className="absolute inset-0" />
            <div className="pointer-events-none absolute left-4 top-4 z-[400] flex items-center gap-2 rounded-xl bg-white/95 px-3.5 py-2.5 text-xs font-semibold text-[#0A2463] shadow-md backdrop-blur-sm font-sans">
              <svg className="h-4 w-4 text-[#1E5EF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {t("distributors.mapHint")}
            </div>
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={
                isFullscreen
                  ? t("distributors.exitFullscreen")
                  : t("distributors.fullscreen")
              }
              className="absolute right-4 top-4 z-[500] inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-xs font-bold text-[#0A2463] shadow-md transition hover:bg-[#EFF3FB] font-sans"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={isFullscreen
                    ? "M9 3v6H3m12 12v-6h6M3 15h6v6M21 9h-6V3"
                    : "M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"}
                />
              </svg>
              <span className="hidden sm:inline">
                {isFullscreen
                  ? t("distributors.exitFullscreen")
                  : t("distributors.fullscreen")}
              </span>
            </button>
            {isFullscreen && selected && (
              <div className="absolute bottom-4 left-4 right-4 z-[500] max-w-md rounded-2xl border border-white/60 bg-white/95 p-4 shadow-2xl backdrop-blur-md sm:left-auto sm:right-6 sm:w-[360px]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-bold text-[#0A2463] font-display">
                        {selected.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 font-sans">
                        {selected.commune} · {selected.wilaya}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      aria-label={t("distributors.closeDetails")}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                    >
                      ×
                    </button>
                  </div>
                  <div className="mt-3 space-y-1.5 text-xs text-slate-600 font-sans">
                    <p>{selected.address}</p>
                    <a href={`tel:${selected.phone}`} className="block text-[#1E5EF3]">
                      {selected.phone}
                    </a>
                    {selected.email && (
                      <a href={`mailto:${selected.email}`} className="block break-all text-[#1E5EF3]">
                        {selected.email}
                      </a>
                    )}
                    <p className="text-[11px] text-slate-400">
                      GPS · {selected.lat.toFixed(5)}, {selected.lng.toFixed(5)}
                    </p>
                  </div>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-[#0A2463] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#12348f] font-sans"
                  >
                    {t("distributors.directions")}
                  </a>
              </div>
            )}
          </div>

          {/* Panneau latéral */}
          <aside className="flex max-h-[560px] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            {selected ? (
              <>
                {/* En-tête détail */}
                <div className="relative bg-gradient-to-br from-[#0A2463] to-[#12348f] px-5 pb-8 pt-5 text-white">
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="mb-4 inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100 transition hover:bg-white/20"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    {t("distributors.backToList")}
                  </button>
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-xl font-bold leading-snug font-display">{selected.name}</h2>
                    <span className="shrink-0 rounded-lg bg-white/15 px-2.5 py-1 text-xs font-bold">
                      {String(wilayaCode[selected.wilaya] ?? "").padStart(2, "0")}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-blue-200">{selected.commune} · {selected.wilaya}</p>
                </div>

                {/* Corps détail */}
                <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5 text-sm text-slate-600 font-sans">
                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                    <svg className="mt-0.5 h-4.5 w-4.5 h-5 w-5 shrink-0 text-[#1E5EF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <p className="leading-relaxed">{selected.address}</p>
                  </div>
                  <a href={`tel:${selected.phone}`} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-blue-50">
                    <svg className="h-5 w-5 shrink-0 text-[#1E5EF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    <span className="font-semibold text-slate-700">{selected.phone}</span>
                  </a>
                  {selected.email && (
                    <a href={`mailto:${selected.email}`} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-blue-50">
                      <svg className="h-5 w-5 shrink-0 text-[#1E5EF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      <span className="break-all text-slate-700">{selected.email}</span>
                    </a>
                  )}
                  <p className="px-1 pt-1 text-[11px] font-medium tracking-wide text-slate-400">
                    GPS · {selected.lat.toFixed(5)}, {selected.lng.toFixed(5)}
                  </p>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A2463] px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-900/20 transition hover:-translate-y-0.5 hover:bg-[#12348f] hover:shadow-lg font-sans"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                    </svg>
                    {t("distributors.directions")}
                  </a>
                </div>
              </>
            ) : (
              <>
                <div className="border-b border-slate-100 px-5 pb-4 pt-5">
                  <h2 className="text-lg font-bold text-[#0A2463] font-display">
                    {t("distributors.listTitle")}
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">{t("distributors.listHint")}</p>
                </div>
                <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto p-4">
                  {filtered.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-12 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-slate-600">{t("distributors.empty")}</p>
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="text-xs font-bold text-[#1E5EF3] hover:underline"
                      >
                        {t("distributors.reset")}
                      </button>
                    </div>
                  ) : (
                    filtered.map((distributor) => {
                      const isActive = selected === distributor
                      return (
                        <button
                          key={distributor.id}
                          type="button"
                          onClick={() => handleSelect(distributor)}
                          className={`group w-full rounded-xl border p-3.5 text-start transition-all ${
                            isActive
                              ? "border-[#1E5EF3] bg-blue-50/60 ring-2 ring-blue-100"
                              : "border-slate-100 hover:border-blue-200 hover:bg-slate-50 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-slate-800 transition-colors group-hover:text-[#0A2463] font-sans">
                              {distributor.name}
                            </span>
                            <svg className="h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-[#1E5EF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                          </div>
                          <span className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 font-sans">
                            <svg className="h-3.5 w-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            {distributor.commune}, {distributor.wilaya}
                          </span>
                        </button>
                      )
                    })
                  )}
                </div>
              </>
            )}
          </aside>
        </div>
      </main>
    </div>
  )
}