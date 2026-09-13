import { useMemo, useState } from "react"
import type { AuditLog } from "../../../../lib/contentStore"
import { SectionHeading, btnGhostSmall, cardBase, inputBase } from "../primitives/ui"

export function HistoryTab({
  auditLogs,
  auditLoading,
  onRefresh,
}: {
  auditLogs: AuditLog[]
  auditLoading: boolean
  onRefresh: () => void
}) {
  const [query, setQuery] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return auditLogs
    return auditLogs.filter((l) =>
      [l.action, l.entity, l.entity_id ?? "", JSON.stringify(l.payload)]
        .join(" ")
        .toLowerCase()
        .includes(q),
    )
  }, [auditLogs, query])
  return (
    <section className={`p-6 ${cardBase}`}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <SectionHeading
          title="Historique & Audit"
          description="Journal des actions (audit_logs) — visible par tous les rôles, écriture réservée aux éditeurs/admins."
        />
        <div className="flex items-center gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher (action, entité, payload)..."
            className={`w-56 ${inputBase}`}
          />
          <button type="button" onClick={onRefresh} className={btnGhostSmall}>
            {auditLoading ? "..." : "Rafraîchir"}
          </button>
        </div>
      </div>
      <p className="mt-3 text-xs text-[#9A9585]">
        {filtered.length} / {auditLogs.length} évènement(s)
      </p>

      {filtered.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-[#D9D2BF] bg-[#FBFAF6] p-6 text-center text-sm text-[#8A8474]">
          {auditLogs.length === 0 ? "Aucun évènement d'audit pour l'instant." : "Aucun résultat pour cette recherche."}
        </p>
      ) : (
        <div className="mt-6 overflow-auto rounded-2xl border border-[#E4DFD2]">
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead className="bg-[#FBFAF6] text-[#9A9585]">
              <tr>
                <th className="px-3 py-2.5">Date</th>
                <th className="px-3 py-2.5">Acteur</th>
                <th className="px-3 py-2.5">Action</th>
                <th className="px-3 py-2.5">Entité</th>
                <th className="px-3 py-2.5">ID</th>
                <th className="px-3 py-2.5">Payload</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => {
                const expanded = expandedId === l.id
                return (
                  <tr
                    key={l.id}
                    onClick={() => setExpandedId(expanded ? null : l.id)}
                    className="cursor-pointer border-t border-[#E4DFD2] hover:bg-[#FBFAF6]"
                    title="Cliquer pour voir le payload complet"
                  >
                    <td className="px-3 py-2.5 text-[#6B6459]">
                      {new Date(l.created_at).toLocaleString("fr-FR")}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[11px] text-[#4A4438]">
                      {l.actor_id ? l.actor_id.slice(0, 8) : "—"}
                    </td>
                    <td className="px-3 py-2.5 font-semibold text-[#12233F]">{l.action}</td>
                    <td className="px-3 py-2.5 text-[#4A4438]">{l.entity}</td>
                    <td className="px-3 py-2.5 font-mono text-[11px] text-[#8A8474]">
                      {l.entity_id ?? "—"}
                    </td>
                    <td className="max-w-[240px] px-3 py-2.5 font-mono text-[11px] text-[#8A8474]">
                      {expanded ? (
                        <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-all">
                          {JSON.stringify(l.payload, null, 2)}
                        </pre>
                      ) : (
                        <span className="block truncate">{JSON.stringify(l.payload)}</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
