import { useCallback, useEffect, useMemo, useState } from "react"
import { supabase } from "../../../../lib/supabase"
import { SectionHeading, btnGhostSmall, btnSecondary, cardBase, inputBase } from "../primitives/ui"

type SupportRequestRow = {
  id: string
  reference: string
  full_name: string
  phone: string
  wilaya: string | null
  commune: string | null
  device_class: string | null
  device_reference: string | null
  request_type: string
  message: string | null
  attachment_name: string | null
  attachment_url: string | null
  status: string
  created_at: string
}

type SubscriberRow = { id: string; email: string; lang: string | null; created_at: string }

const STATUSES: Array<[string, string]> = [
  ["new", "Nouvelle"],
  ["in-progress", "En cours"],
  ["done", "Traitée"],
]
const TYPES: Record<string, string> = {
  maintenance: "Maintenance",
  warranty: "Garantie",
  "spare-parts": "Pièces détachées",
  inquiry: "Renseignement",
}

const statusStyle = (s: string) =>
  s === "done" ? "bg-[#E6F4EC] text-[#03873a]" : s === "in-progress" ? "bg-[#f0f7fb] text-[#0077b3]" : "bg-[#fdf1e8] text-[#b64400]"

function downloadCsv(name: string, rows: Array<Record<string, unknown>>) {
  if (rows.length === 0) return
  const headers = Object.keys(rows[0])
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n")
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" })
  const a = document.createElement("a")
  a.href = URL.createObjectURL(blob)
  a.download = name
  a.click()
  URL.revokeObjectURL(a.href)
}

/** Demandes de support (formulaire « Request Support ») et abonnés newsletter. */
export function RequestsTab({ isViewer }: { isViewer: boolean }) {
  const [requests, setRequests] = useState<SupportRequestRow[]>([])
  const [subscribers, setSubscribers] = useState<SubscriberRow[]>([])
  const [filter, setFilter] = useState("")
  const [type, setType] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [openId, setOpenId] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!supabase) {
      setError("Supabase n'est pas configuré.")
      return
    }
    setLoading(true)
    setError("")
    const [r, s] = await Promise.all([
      supabase.from("support_requests").select("*").order("created_at", { ascending: false }).limit(500),
      supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }).limit(2000),
    ])
    if (r.error || s.error) {
      setError(
        "Tables introuvables ou accès refusé. Exécutez supabase/add-newsletter-support.sql dans Supabase (" +
          (r.error?.message ?? s.error?.message) +
          ").",
      )
    } else {
      setRequests((r.data ?? []) as SupportRequestRow[])
      setSubscribers((s.data ?? []) as SubscriberRow[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const visible = useMemo(
    () => requests.filter((x) => (!filter || x.status === filter) && (!type || x.request_type === type)),
    [requests, filter, type],
  )

  const setStatus = async (id: string, status: string) => {
    if (!supabase || isViewer) return
    const { error: err } = await supabase.from("support_requests").update({ status }).eq("id", id)
    if (err) setError(err.message)
    else setRequests((list) => list.map((x) => (x.id === id ? { ...x, status } : x)))
  }

  const count = (s: string) => requests.filter((x) => x.status === s).length

  return (
    <section className="space-y-6">
      <div className={`p-6 ${cardBase}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <SectionHeading
            title="Demandes de support"
            description="Demandes envoyées depuis la page Support. Changez leur statut au fil du traitement ; le numéro de référence est communiqué au client."
          />
          <div className="flex gap-2">
            <button type="button" onClick={() => void load()} className={btnSecondary} disabled={loading}>
              {loading ? "Chargement…" : "Actualiser"}
            </button>
            <button
              type="button"
              className={btnSecondary}
              disabled={requests.length === 0}
              onClick={() =>
                downloadCsv(
                  "demandes-support.csv",
                  requests.map((x) => ({
                    reference: x.reference,
                    date: x.created_at,
                    statut: x.status,
                    type: TYPES[x.request_type] ?? x.request_type,
                    nom: x.full_name,
                    telephone: x.phone,
                    wilaya: x.wilaya,
                    commune: x.commune,
                    categorie: x.device_class,
                    reference_appareil: x.device_reference,
                    message: x.message,
                  })),
                )
              }
            >
              Exporter CSV
            </button>
          </div>
        </div>

        {error && <p className="mt-4 rounded-xl bg-[#FBEAEA] px-4 py-3 text-xs font-medium text-[#C1443D]">{error}</p>}

        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-[#fdf1e8] px-3 py-1 font-semibold text-[#b64400]">Nouvelles : {count("new")}</span>
          <span className="rounded-full bg-[#f0f7fb] px-3 py-1 font-semibold text-[#0077b3]">En cours : {count("in-progress")}</span>
          <span className="rounded-full bg-[#E6F4EC] px-3 py-1 font-semibold text-[#03873a]">Traitées : {count("done")}</span>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className={`${inputBase} !w-auto`}>
            <option value="">Tous les statuts</option>
            {STATUSES.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
          <select value={type} onChange={(e) => setType(e.target.value)} className={`${inputBase} !w-auto`}>
            <option value="">Tous les types</option>
            {Object.entries(TYPES).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <ul className="mt-5 divide-y divide-[#e6e6e8] overflow-hidden rounded-2xl border border-[#d6d6d6]">
          {visible.length === 0 && <li className="p-6 text-sm text-[#5a5a5e]">Aucune demande.</li>}
          {visible.map((x) => (
            <li key={x.id} className="bg-white">
              <button
                type="button"
                onClick={() => setOpenId(openId === x.id ? null : x.id)}
                className="flex w-full flex-wrap items-center justify-between gap-3 px-4 py-3 text-left hover:bg-[#fafafc]"
                aria-expanded={openId === x.id}
              >
                <span className="min-w-0">
                  <span className="block font-mono text-xs text-[#5a5a5e]">{x.reference}</span>
                  <span className="block truncate text-sm font-semibold text-[#1d1d1f]">
                    {x.full_name} — {TYPES[x.request_type] ?? x.request_type}
                  </span>
                </span>
                <span className="flex items-center gap-3 text-xs text-[#5a5a5e]">
                  {new Date(x.created_at).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                  <span className={`rounded-full px-2.5 py-1 font-semibold ${statusStyle(x.status)}`}>
                    {STATUSES.find(([v]) => v === x.status)?.[1] ?? x.status}
                  </span>
                </span>
              </button>
              {openId === x.id && (
                <div className="space-y-3 border-t border-[#e6e6e8] bg-[#fafafc] px-4 py-4 text-sm text-[#333336]">
                  <dl className="grid gap-2 sm:grid-cols-2">
                    <div><dt className="text-xs text-[#5a5a5e]">Téléphone</dt><dd><a className="font-semibold text-[#0077b3]" href={`tel:${x.phone}`}>{x.phone}</a></dd></div>
                    <div><dt className="text-xs text-[#5a5a5e]">Localisation</dt><dd>{[x.wilaya, x.commune].filter(Boolean).join(" — ") || "—"}</dd></div>
                    <div><dt className="text-xs text-[#5a5a5e]">Appareil</dt><dd>{[x.device_class, x.device_reference].filter(Boolean).join(" · ") || "—"}</dd></div>
                    <div><dt className="text-xs text-[#5a5a5e]">Pièce jointe</dt><dd>{x.attachment_name ?? "—"}{x.attachment_url ? ` (stockée : ${x.attachment_url})` : ""}</dd></div>
                  </dl>
                  <p className="whitespace-pre-wrap rounded-xl bg-white p-3">{x.message || "—"}</p>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map(([v, l]) => (
                      <button
                        key={v}
                        type="button"
                        disabled={isViewer || x.status === v}
                        onClick={() => void setStatus(x.id, v)}
                        className={btnGhostSmall}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className={`p-6 ${cardBase}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <SectionHeading title={`Abonnés newsletter (${subscribers.length})`} description="Adresses inscrites depuis le pied de page du site." />
          <button
            type="button"
            className={btnSecondary}
            disabled={subscribers.length === 0}
            onClick={() => downloadCsv("abonnes-newsletter.csv", subscribers.map((s) => ({ email: s.email, langue: s.lang, date: s.created_at })))}
          >
            Exporter CSV
          </button>
        </div>
        <ul className="mt-4 max-h-72 divide-y divide-[#e6e6e8] overflow-auto rounded-2xl border border-[#d6d6d6] bg-white text-sm">
          {subscribers.length === 0 && <li className="p-4 text-[#5a5a5e]">Aucun abonné.</li>}
          {subscribers.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
              <span className="truncate font-medium text-[#1d1d1f]">{s.email}</span>
              <span className="shrink-0 text-xs text-[#5a5a5e]">
                {(s.lang ?? "fr").toUpperCase()} · {new Date(s.created_at).toLocaleDateString("fr-FR")}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
