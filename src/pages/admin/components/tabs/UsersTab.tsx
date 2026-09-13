import type { ProfileRow } from "../../../../lib/contentStore"
import { SectionHeading, btnDanger, btnGhostSmall, btnPrimary, cardBase, inputBase } from "../primitives/ui"

export function UsersTab({
  profiles,
  profileBusy,
  newProfileName,
  onNameChange,
  newProfileEmail,
  onEmailChange,
  onRefresh,
  onCreate,
  onChangeRole,
  onRemove,
}: {
  profiles: ProfileRow[]
  profileBusy: boolean
  newProfileName: string
  onNameChange: (value: string) => void
  newProfileEmail: string
  onEmailChange: (value: string) => void
  onRefresh: () => void
  onCreate: () => void
  onChangeRole: (profileId: string, role: "admin" | "editor" | "viewer") => void
  onRemove: (profileId: string) => void
}) {
  return (
    <section className={`p-6 ${cardBase}`}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <SectionHeading title="Utilisateurs" description="Gérez les comptes admin / éditeur / viewer." />
        <button type="button" onClick={onRefresh} className={btnGhostSmall}>
          Rafraîchir
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-[#E4DFD2] bg-[#FBFAF6] p-4">
        <h3 className="text-sm font-semibold text-[#12233F]">Inviter un utilisateur</h3>
        <p className="mt-1 text-xs text-[#8A8474]">
          Un email d'invitation est envoyé. Le rôle par défaut est éditeur (modifiable ensuite).
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            value={newProfileName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Nom complet"
            className={inputBase}
          />
          <input
            type="email"
            value={newProfileEmail}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="Email"
            className={inputBase}
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onCreate}
            disabled={profileBusy || !newProfileEmail.trim()}
            className={btnPrimary}
          >
            {profileBusy ? "Création..." : "Inviter l'utilisateur"}
          </button>
          <p className="text-xs text-[#8A8474]">
            Rôle par défaut : éditeur. Un admin peut le passer en viewer ou admin.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-[#E4DFD2] bg-white p-4">
        <h3 className="text-sm font-semibold text-[#12233F]">Liste des utilisateurs</h3>
        {profiles.length === 0 ? (
          <p className="mt-2 text-sm text-[#8A8474]">Aucun utilisateur enregistré.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="flex flex-col gap-3 rounded-xl border border-[#E4DFD2] bg-[#FBFAF6] p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#12233F]">
                      {profile.full_name || profile.id.slice(0, 8)}
                    </p>
                    <p className="truncate text-xs text-[#9A9585]">{profile.id}</p>
                    {(profile as unknown as { email?: string }).email && (
                      <p className="truncate text-xs text-[#9A9585]">
                        {(profile as unknown as { email?: string }).email}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        profile.role === "admin"
                          ? "bg-[#FBEAEA] text-[#C1443D]"
                          : profile.role === "viewer"
                            ? "bg-[#EDEAE0] text-[#6B6459]"
                            : "bg-[#F0F4FE] text-[#2F5FE8]"
                      }`}
                    >
                      {profile.role}
                    </span>
                    <span className="text-[11px] text-[#9A9585]">
                      {new Date(profile.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-xs text-[#6B6459]">
                    <span>Rôle :</span>
                    <select
                      value={profile.role}
                      onChange={(e) =>
                        onChangeRole(profile.id, e.target.value as "admin" | "editor" | "viewer")
                      }
                      className="rounded-lg border border-[#E4DFD2] bg-white px-2 py-1 text-xs font-normal"
                    >
                      <option value="editor">Éditeur</option>
                      <option value="admin">Admin</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </label>
                  <button type="button" onClick={() => onRemove(profile.id)} className={btnDanger}>
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
