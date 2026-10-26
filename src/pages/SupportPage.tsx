import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { categories, products, productUrl } from "../data"
import { ml } from "../lib/ml"
import { useP } from "../content/lang"
import { support, wilayas } from "../content/support"
import { useSiteSettings } from "../context/SiteSettingsContext"
import { submitSupportRequest, type SupportRequest } from "../lib/forms"
import Reveal from "../components/Reveal"
import Icon from "../components/Icon"

const eyebrow = "text-xs font-semibold uppercase tracking-[0.18em] text-[#0077b3]"
const h2 = "text-4xl font-semibold leading-[1.05] tracking-tight text-[#1d1d1f] lg:text-[40px]"
const btnPrimary =
  "group inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--color-accent)] px-7 text-[15px] font-semibold text-white transition-colors hover:bg-[#00628f] active:scale-[0.98] disabled:opacity-60"
const field =
  "min-h-12 w-full rounded-[14px] border border-[#86868b] bg-white px-4 text-[15px] text-[#1d1d1f] outline-none transition-colors placeholder:text-[#707070] focus:border-[var(--color-accent)]"

const norm = (v: string) => v.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim()

/* ───────── Mon appareil AUREX : recherche par nom ou référence ───────── */
function MyAppliance() {
  const { p } = useP()
  const c = support.myAppliance
  const [query, setQuery] = useState("")
  const [submitted, setSubmitted] = useState("")

  const results = useMemo(() => {
    const q = norm(submitted)
    if (!q) return []
    return products
      .filter((x) => norm(ml(x.name)).includes(q) || norm(String(x.reference ?? "")).includes(q))
      .slice(0, 6)
  }, [submitted])

  return (
    <section id="mon-appareil" className="scroll-mt-24 bg-[#f5f5f7] py-20 lg:py-[90px]" aria-labelledby="myapp-title">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <p className={eyebrow}>{p(c.title)}</p>
          <h2 id="myapp-title" className={`mt-3 ${h2}`} style={{ fontFamily: "var(--font-display)" }}>
            {p(c.headline)}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[17px] text-[#474747]">{p(c.intro)}</p>
          <p className="mx-auto mt-2 max-w-2xl text-[15px] text-[#5a5a5e]">{p(c.text)}</p>
          <form
            role="search"
            className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault()
              setSubmitted(query)
            }}
          >
            <label htmlFor="myapp-q" className="sr-only">
              {p(c.placeholder)}
            </label>
            <input
              id="myapp-q"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={p(c.placeholder)}
              className={`${field} rounded-full px-6`}
            />
            <button type="submit" className={btnPrimary}>
              <Icon name="search" className="h-4 w-4" strokeWidth={2} />
              {p(c.cta)}
            </button>
          </form>
        </Reveal>

        <div className="mt-8 text-start" aria-live="polite">
          {submitted && results.length === 0 && (
            <p className="rounded-[20px] bg-white p-6 text-center text-[15px] text-[#474747]">{p(c.noResult)}</p>
          )}
          {results.length > 0 && (
            <ul className="grid gap-4 sm:grid-cols-2">
              {results.map((x) => (
                <li key={x.id}>
                  <Link
                    to={productUrl(x)}
                    className="flex items-center gap-4 rounded-[20px] bg-white p-4 transition-colors hover:bg-[#fafafc]"
                  >
                    <img loading="lazy" decoding="async" src={x.image} alt="" width={80} height={80} className="h-20 w-20 shrink-0 rounded-[14px] object-cover" />
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] font-semibold text-[#1d1d1f]">{ml(x.name)}</span>
                      <span className="block font-mono text-xs text-[#5a5a5e]">{x.reference}</span>
                      <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[#0077b3]">
                        {p(c.openDocs)}
                        <Icon name="arrow" className="h-3.5 w-3.5 rtl:-scale-x-100" strokeWidth={2} />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

/* ───────── Trouver ma notice : par catégorie ou référence ───────── */
function Manuals() {
  const { p } = useP()
  const m = support.manuals
  const [cat, setCat] = useState("")
  const [q, setQ] = useState("")
  const list = useMemo(() => {
    const nq = norm(q)
    return products
      .filter((x) => (!cat || x.category === cat) && (!nq || norm(ml(x.name)).includes(nq) || norm(String(x.reference ?? "")).includes(nq)))
      .slice(0, 8)
  }, [cat, q])

  return (
    <section id="notices" className="scroll-mt-24 bg-white py-20 lg:py-[90px]" aria-labelledby="manuals-title">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <h2 id="manuals-title" className={h2} style={{ fontFamily: "var(--font-display)" }}>
            {p(m.title)}
          </h2>
          <p className="mt-3 max-w-2xl text-[17px] text-[#474747]">{p(m.text)}</p>
        </Reveal>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="man-cat">
            {p(m.allCategories)}
          </label>
          <select id="man-cat" value={cat} onChange={(e) => setCat(e.target.value)} className={`${field} sm:max-w-xs`}>
            <option value="">{p(m.allCategories)}</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {ml(c.label)}
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="man-q">
            {p(support.myAppliance.placeholder)}
          </label>
          <input id="man-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={p(support.myAppliance.placeholder)} className={field} />
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((x) => (
            <li key={x.id}>
              <Link to={productUrl(x)} className="block rounded-[20px] bg-[#f5f5f7] p-5 transition-colors hover:bg-[#ececf0]">
                <span className="block text-[15px] font-semibold text-[#1d1d1f]">{ml(x.name)}</span>
                <span className="mt-1 block font-mono text-xs text-[#5a5a5e]">{x.reference}</span>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#0077b3]">
                  {p(m.open)}
                  <Icon name="arrow" className="h-3.5 w-3.5 rtl:-scale-x-100" strokeWidth={2} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ───────── Request Support ───────── */
function RequestForm({ presetType }: { presetType: string }) {
  const { p, lang } = useP()
  const f = support.form
  const [type, setType] = useState(presetType || "maintenance")
  const [state, setState] = useState<"idle" | "sending" | "invalid" | "error" | "done">("idle")
  const [result, setResult] = useState<{ reference?: string; mode?: string }>({})
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (presetType) setType(presetType)
  }, [presetType])

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const get = (k: string) => String(data.get(k) ?? "").trim()
    if (!get("full_name") || !get("phone") || !get("message")) {
      setState("invalid")
      return
    }
    setState("sending")
    const req: SupportRequest = {
      full_name: get("full_name"),
      phone: get("phone"),
      wilaya: get("wilaya"),
      commune: get("commune"),
      device_class: get("device_class"),
      device_reference: get("device_reference"),
      request_type: type as SupportRequest["request_type"],
      message: get("message"),
      lang,
    }
    const file = fileRef.current?.files?.[0] ?? null
    const res = await submitSupportRequest(req, file)
    if (res.ok) {
      setResult({ reference: res.reference, mode: res.mode })
      setState("done")
    } else setState("error")
  }

  return (
    <section id="demande" className="scroll-mt-24 bg-[#f5f5f7] py-20 lg:py-[90px]" aria-labelledby="form-title">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <h2 id="form-title" className={h2} style={{ fontFamily: "var(--font-display)" }}>
            {p(f.title)}
          </h2>
          <p className="mt-3 text-[17px] text-[#474747]">{p(f.text)}</p>
        </Reveal>

        {state === "done" ? (
          <div role="status" className="mt-8 rounded-[28px] bg-white p-8">
            <p className="text-2xl font-semibold text-[#1d1d1f]" style={{ fontFamily: "var(--font-display)" }}>
              {p(f.successTitle)}
            </p>
            <p className="mt-4 text-sm font-semibold text-[#5a5a5e]">{p(f.referenceLabel)}</p>
            <p className="font-mono text-2xl font-semibold text-[#0077b3]">{result.reference}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-[#474747]">{p(f.nextStep)}</p>
            {result.mode === "local" && <p className="mt-3 text-xs text-[#5a5a5e]">{p(f.localNote)}</p>}
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-8 grid gap-5 rounded-[28px] bg-white p-6 sm:grid-cols-2 sm:p-8">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-semibold text-[#333336]">{p(f.fields.name)} *</span>
              <input name="full_name" required autoComplete="name" className={field} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-[#333336]">{p(f.fields.phone)} *</span>
              <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" className={field} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-[#333336]">{p(f.fields.type)} *</span>
              <select value={type} onChange={(e) => setType(e.target.value)} className={field}>
                {f.types.map((t) => (
                  <option key={t.value} value={t.value}>
                    {p(t.label)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-[#333336]">{p(f.fields.wilaya)}</span>
              <select name="wilaya" defaultValue="" className={field}>
                <option value="">{p(f.select)}</option>
                {wilayas.map((w, i) => (
                  <option key={w} value={w}>
                    {String(i + 1).padStart(2, "0")} — {w}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-[#333336]">{p(f.fields.commune)}</span>
              <input name="commune" className={field} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-[#333336]">{p(f.fields.deviceClass)}</span>
              <select name="device_class" defaultValue="" className={field}>
                <option value="">{p(f.select)}</option>
                {categories.map((c) => (
                  <option key={c.slug} value={ml(c.label)}>
                    {ml(c.label)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-[#333336]">{p(f.fields.reference)}</span>
              <input name="device_reference" className={field} />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-semibold text-[#333336]">{p(f.fields.message)} *</span>
              <textarea name="message" required rows={5} className={`${field} py-3`} />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-semibold text-[#333336]">{p(f.fields.file)}</span>
              <input ref={fileRef} type="file" accept="image/*,video/*" className="block w-full text-sm text-[#474747] file:me-4 file:rounded-full file:border-0 file:bg-[#f5f5f7] file:px-5 file:py-3 file:text-sm file:font-semibold file:text-[#1d1d1f]" />
            </label>
            {(state === "invalid" || state === "error") && (
              <p role="alert" className="text-sm text-[#b64400] sm:col-span-2">
                {state === "invalid" ? p(f.required) : p(f.error)}
              </p>
            )}
            <div className="sm:col-span-2">
              <button type="submit" disabled={state === "sending"} className={btnPrimary}>
                {state === "sending" ? p(f.sending) : p(f.submit)}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

/* ───────── Contact : uniquement les moyens réellement disponibles ───────── */
function ContactChannels() {
  const { p } = useP()
  const { settings } = useSiteSettings()
  const c = support.contact
  const real = (v?: string | null) => (v && !/x{2}/i.test(v) ? v : "")
  const rows = [
    { label: c.phone, value: real(settings.contactPhone), href: real(settings.contactPhone) ? `tel:${real(settings.contactPhone).replace(/\s/g, "")}` : "" },
    { label: c.email, value: real(settings.contactEmail), href: real(settings.contactEmail) ? `mailto:${real(settings.contactEmail)}` : "" },
    { label: c.address, value: real(settings.contactAddress), href: "" },
  ].filter((r) => r.value)

  return (
    <section id="contact" className="scroll-mt-24 bg-white py-20 lg:py-[90px]" aria-labelledby="contact-title">
      <div className="mx-auto max-w-7xl px-6">
        <h2 id="contact-title" className={h2} style={{ fontFamily: "var(--font-display)" }}>
          {p(c.title)}
        </h2>
        <p className="mt-3 text-[17px] text-[#474747]">{p(c.text)}</p>
        {rows.length > 0 ? (
          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            {rows.map((r) => (
              <div key={r.value} className="rounded-[20px] bg-[#f5f5f7] p-6">
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5a5a5e]">{p(r.label)}</dt>
                <dd className="mt-2 text-[17px] font-semibold text-[#1d1d1f]">
                  {r.href ? (
                    <a href={r.href} className="hover:text-[#0077b3]">
                      {r.value}
                    </a>
                  ) : (
                    r.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-6 rounded-[20px] bg-[#f5f5f7] p-6 text-[15px] text-[#474747]">{p(c.none)}</p>
        )}
      </div>
    </section>
  )
}

function Faq() {
  const { p } = useP()
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="scroll-mt-24 bg-[#f5f5f7] py-20 lg:py-[90px]" aria-labelledby="faq-title">
      <div className="mx-auto max-w-3xl px-6">
        <h2 id="faq-title" className={h2} style={{ fontFamily: "var(--font-display)" }}>
          {p(support.faq.title)}
        </h2>
        <div className="mt-8 divide-y divide-[#d6d6d6] rounded-[28px] bg-white px-6">
          {support.faq.items.map((item, i) => (
            <div key={i}>
              <h3>
                <button
                  type="button"
                  aria-expanded={open === i}
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-start text-[17px] font-semibold text-[#1d1d1f]"
                >
                  {p(item.q)}
                  <Icon name={open === i ? "close" : "sparkle"} className="h-4 w-4 shrink-0 text-[#0077b3]" strokeWidth={2} />
                </button>
              </h3>
              {open === i && <p className="pb-5 text-[15px] leading-relaxed text-[#474747]">{p(item.a)}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function SupportPage() {
  const { p } = useP()
  const { hash } = useLocation()
  const [presetType, setPresetType] = useState("")

  // Ancres internes (#notices, #faq, #pieces, #contact…) : défilement après rendu.
  useEffect(() => {
    if (!hash) return
    const id = hash.slice(1)
    const target = id === "pieces" || id === "sav" ? "demande" : id === "centres" ? "centres" : id
    const timer = window.setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }), 80)
    if (id === "pieces") setPresetType("spare-parts")
    return () => window.clearTimeout(timer)
  }, [hash])

  return (
    <div>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#1d1d1f] pb-20 pt-36 lg:pb-28 lg:pt-44">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_85%_10%,rgba(0,119,179,0.45),transparent_70%)]" />
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4db3e6]">{p(support.hero.eyebrow)}</p>
          <h1 className="mt-4 text-5xl font-semibold leading-[1.05] tracking-tight text-white lg:text-[80px] lg:tracking-[-1.2px]" style={{ fontFamily: "var(--font-display)" }}>
            {p(support.hero.title)}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">{p(support.hero.text)}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#demande" className={btnPrimary}>
              {p(support.hero.cta1)}
              <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" strokeWidth={2} />
            </a>
            <a href="#garantie" className="inline-flex min-h-12 items-center rounded-full border border-white/60 px-7 text-[15px] font-semibold text-white transition-colors hover:bg-white/10 active:scale-[0.98]">
              {p(support.hero.cta2)}
            </a>
          </div>
        </div>
      </section>

      {/* Warranty & Peace of Mind */}
      <section id="garantie" className="scroll-mt-24 bg-white py-20 lg:py-[90px]" aria-labelledby="warranty-title">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 id="warranty-title" className={h2} style={{ fontFamily: "var(--font-display)" }}>
              {p(support.warranty.title)}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {support.warranty.items.map((item, i) => (
              <Reveal key={item.icon} delay={i * 90} className="h-full">
                <div className="h-full rounded-[28px] bg-[#f5f5f7] p-8">
                  <span className="text-[#0077b3]">
                    <Icon name={item.icon} className="h-9 w-9" />
                  </span>
                  <h3 className="mt-6 text-[21px] font-semibold leading-snug text-[#1d1d1f]" style={{ fontFamily: "var(--font-display)" }}>
                    {p(item.title)}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#474747]">{p(item.text)}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={150}>
            <div className="mt-8 rounded-[28px] border border-[#d6d6d6] p-8">
              <h3 className="text-[19px] font-semibold text-[#1d1d1f]" style={{ fontFamily: "var(--font-display)" }}>
                {p(support.warranty.detailsTitle)}
              </h3>
              <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-[#474747]">{p(support.warranty.detailsText)}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How can we help you? */}
      <section id="sav" className="scroll-mt-24 bg-[#f5f5f7] py-20 lg:py-[90px]" aria-labelledby="help-title">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <p className={eyebrow}>{p(support.help.eyebrow)}</p>
            <h2 id="help-title" className={`mt-3 ${h2}`} style={{ fontFamily: "var(--font-display)" }}>
              {p(support.help.title)}
            </h2>
            <p className="mt-3 text-[17px] text-[#474747]">{p(support.help.text)}</p>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {support.help.cards.map((card, i) => (
              <Reveal key={card.num} delay={Math.min(i, 5) * 70} className="h-full">
                <a
                  href={card.href}
                  onClick={() => card.requestType && setPresetType(card.requestType)}
                  className="group flex h-full flex-col rounded-[28px] bg-white p-7 transition-colors hover:bg-[#fafafc]"
                >
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
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Manuals />
      <MyAppliance />
      <RequestForm presetType={presetType} />
      <ContactChannels />
      <Faq />

      <section id="centres" className="scroll-mt-24 bg-white py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]" style={{ fontFamily: "var(--font-display)" }}>
              {p(support.centres.title)}
            </h2>
            <p className="mt-2 text-[17px] text-[#474747]">{p(support.centres.text)}</p>
          </div>
          <Link to="/distributeurs" className={btnPrimary}>
            {p(support.centres.cta)}
          </Link>
        </div>
      </section>

      {/* Section finale */}
      <section className="bg-[#fafafc] py-24 text-center lg:py-[110px]" aria-labelledby="support-final">
        <div className="mx-auto max-w-4xl px-6">
          <Reveal>
            <h2 id="support-final" className="text-5xl font-semibold leading-[1.05] tracking-tight text-[#1d1d1f] lg:text-[64px] lg:tracking-[-0.96px]" style={{ fontFamily: "var(--font-display)" }}>
              {p(support.final.title)}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-[#474747]">{p(support.final.text)}</p>
            <a href="#contact" className={`${btnPrimary} mt-9`}>
              {p(support.final.cta)}
              <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" strokeWidth={2} />
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
