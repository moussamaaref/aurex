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
      <p className="mt-3 text-xs text-[#707070]">
        {filtered.length} / {auditLogs.length} évènement(s)
      </p>

      {filtered.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-[#d6d6d6] bg-[#fafafc] p-6 text-center text-sm text-[#5a5a5e]">
          {auditLogs.length === 0 ? "Aucun évènement d'audit pour l'instant." : "Aucun résultat pour cette recherche."}
        </p>
      ) : (
        <div className="mt-6 overflow-auto rounded-2xl border border-[#d6d6d6]">
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead className="bg-[#fafafc] text-[#707070]">
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
                    className="cursor-pointer border-t border-[#d6d6d6] hover:bg-[#fafafc]"
                    title="Cliquer pour voir le payload complet"
                  >
                    <td className="px-3 py-2.5 text-[#474747]">
                      {new Date(l.created_at).toLocaleString("fr-FR")}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[11px] text-[#333336]">
                      {l.actor_id ? l.actor_id.slice(0, 8) : "—"}
                    </td>
                    <td className="px-3 py-2.5 font-semibold text-[#1d1d1f]">{l.action}</td>
                    <td className="px-3 py-2.5 text-[#333336]">{l.entity}</td>
                    <td className="px-3 py-2.5 font-mono text-[11px] text-[#5a5a5e]">
                      {l.entity_id ?? "—"}
                    </td>
                    <td className="max-w-[240px] px-3 py-2.5 font-mono text-[11px] text-[#5a5a5e]">
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
