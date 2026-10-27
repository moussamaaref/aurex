import { useId, useState } from "react"
import { MIN_PASSWORD_LENGTH, type ProfileRow } from "../../../../lib/contentStore"
import { SectionHeading, btnDanger, btnGhostSmall, btnPrimary, btnSecondary, cardBase, inputBase } from "../primitives/ui"

type Role = "admin" | "editor" | "viewer"

/** Mot de passe aléatoire fort (sans caractères ambigus). */
function generatePassword(length = 16): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*?"
  const bytes = new Uint32Array(length)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => chars[b % chars.length]).join("")
}

function PasswordField({
  value,
  onChange,
  placeholder,
  id,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  id: string
}) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="flex gap-2">
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="new-password"
        className={inputBase}
      />
      <button type="button" onClick={() => setVisible((v) => !v)} className={btnGhostSmall} aria-pressed={visible}>
        {visible ? "Masquer" : "Afficher"}
      </button>
      <button type="button" onClick={() => { onChange(generatePassword()); setVisible(true) }} className={btnGhostSmall}>
        Générer
      </button>
    </div>
  )
}

function PasswordChange({ onSubmit }: { onSubmit: (password: string) => Promise<void> }) {
  const pwId = useId()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [busy, setBusy] = useState(false)

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={btnGhostSmall}>
        Changer le mot de passe
      </button>
    )
  }
  return (
    <div className="w-full space-y-2 rounded-xl border border-[#d6d6d6] bg-white p-3">
      <PasswordField value={value} onChange={setValue} placeholder={`Nouveau mot de passe (${MIN_PASSWORD_LENGTH} caractères min.)`} id={pwId} />
      <div className="flex gap-2">
        <button
          type="button"
          disabled={busy || value.length < MIN_PASSWORD_LENGTH}
          onClick={async () => {
            setBusy(true)
            try {
              await onSubmit(value)
              setValue("")
              setOpen(false)
            } catch {
              // message affiché par la console
            } finally {
              setBusy(false)
            }
          }}
          className={btnPrimary}
        >
          {busy ? "Enregistrement…" : "Enregistrer"}
        </button>
        <button type="button" onClick={() => { setOpen(false); setValue("") }} className={btnSecondary}>
          Annuler
        </button>
      </div>
    </div>
  )
}

export function UsersTab({
  profiles,
  profileBusy,
  newProfileName,
  onNameChange,
  newProfileEmail,
  onEmailChange,
  newProfilePassword,
  onPasswordChange,
  newProfileRole,
  onNewRoleChange,
  onRefresh,
  onCreate,
  onCreateWithPassword,
  onSetPassword,
  onChangeRole,
  onRemove,
  userEmails,
  currentUserId,
}: {
  profiles: ProfileRow[]
  profileBusy: boolean
  newProfileName: string
  onNameChange: (value: string) => void
  newProfileEmail: string
  onEmailChange: (value: string) => void
  newProfilePassword: string
  onPasswordChange: (value: string) => void
  newProfileRole: Role
  onNewRoleChange: (role: Role) => void
  onRefresh: () => void
  onCreate: () => void
  onCreateWithPassword: () => void
  onSetPassword: (profileId: string, password: string) => Promise<void>
  onChangeRole: (profileId: string, role: Role) => void
  onRemove: (profileId: string) => void
  userEmails: Record<string, { email: string | null; last: string | null }>
  currentUserId: string | null
}) {
  const canCreate =
    !profileBusy && newProfileEmail.trim() !== "" && newProfilePassword.length >= MIN_PASSWORD_LENGTH

  return (
    <section className={`p-6 ${cardBase}`}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <SectionHeading title="Utilisateurs" description="Créez des comptes avec leur mot de passe et gérez leurs rôles : admin, éditeur ou viewer (lecture seule)." />
        <button type="button" onClick={onRefresh} className={btnGhostSmall}>
          Rafraîchir
        </button>
      </div>

      <form
        className="mt-5 rounded-2xl border border-[#d6d6d6] bg-[#fafafc] p-4"
        onSubmit={(e) => {
          e.preventDefault()
          if (canCreate) onCreateWithPassword()
        }}
      >
        <h3 className="text-sm font-semibold text-[#1d1d1f]">Créer un utilisateur</h3>
        <p className="mt-1 text-xs text-[#5a5a5e]">
          Le compte est actif immédiatement (e-mail confirmé). Transmettez le mot de passe de manière sécurisée ; l'utilisateur pourra se connecter sur /admin.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input type="text" value={newProfileName} onChange={(e) => onNameChange(e.target.value)} placeholder="Nom complet" autoComplete="off" className={inputBase} />
          <input type="email" value={newProfileEmail} onChange={(e) => onEmailChange(e.target.value)} placeholder="Email" autoComplete="off" required className={inputBase} />
          <div className="sm:col-span-2">
            <PasswordField value={newProfilePassword} onChange={onPasswordChange} placeholder={`Mot de passe (${MIN_PASSWORD_LENGTH} caractères minimum)`} id="new-user-password" />
          </div>
          <label className="flex items-center gap-2 text-sm text-[#333336]">
            <span className="font-semibold">Rôle</span>
            <select value={newProfileRole} onChange={(e) => onNewRoleChange(e.target.value as Role)} className={`${inputBase} !w-auto`}>
              <option value="editor">Éditeur (modifie le contenu)</option>
              <option value="admin">Admin (tout, y compris les utilisateurs)</option>
              <option value="viewer">Viewer (lecture seule)</option>
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="submit" disabled={!canCreate} className={btnPrimary}>
            {profileBusy ? "Création…" : "Créer l'utilisateur"}
          </button>
          <button type="button" onClick={onCreate} disabled={profileBusy || !newProfileEmail.trim()} className={btnSecondary} title="Envoie un lien de connexion par e-mail, sans mot de passe">
            Inviter par e-mail à la place
          </button>
        </div>
      </form>

      <div className="mt-5 rounded-2xl border border-[#d6d6d6] bg-white p-4">
        <h3 className="text-sm font-semibold text-[#1d1d1f]">Liste des utilisateurs ({profiles.length})</h3>
        {profiles.length === 0 ? (
          <p className="mt-2 text-sm text-[#5a5a5e]">Aucun utilisateur enregistré.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {profiles.map((profile) => {
              const info = userEmails[profile.id]
              const isSelf = profile.id === currentUserId
              return (
                <div key={profile.id} className="flex flex-col gap-3 rounded-xl border border-[#d6d6d6] bg-[#fafafc] p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#1d1d1f]">
                        {profile.full_name || info?.email || profile.id.slice(0, 8)}
                        {isSelf && <span className="ms-2 rounded-full bg-[#f0f7fb] px-2 py-0.5 text-[11px] font-semibold text-[#0077b3]">vous</span>}
                      </p>
                      {info?.email && <p className="truncate text-xs text-[#474747]">{info.email}</p>}
                      <p className="truncate text-[11px] text-[#707070]">
                        {info?.last ? `Dernière connexion : ${new Date(info.last).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}` : "Jamais connecté"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          profile.role === "admin" ? "bg-[#FBEAEA] text-[#C1443D]" : profile.role === "viewer" ? "bg-[#e6e6e8] text-[#474747]" : "bg-[#f0f7fb] text-[#0077b3]"
                        }`}
                      >
                        {profile.role}
                      </span>
                      <span className="text-[11px] text-[#707070]">{new Date(profile.created_at).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="flex items-center gap-2 text-xs text-[#474747]">
                      <span>Rôle :</span>
                      <select
                        value={profile.role}
                        onChange={(e) => onChangeRole(profile.id, e.target.value as Role)}
                        className="rounded-lg border border-[#d6d6d6] bg-white px-2 py-1 text-xs font-normal"
                      >
                        <option value="editor">Éditeur</option>
                        <option value="admin">Admin</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </label>
                    <PasswordChange onSubmit={(password) => onSetPassword(profile.id, password)} />
                    <button type="button" onClick={() => onRemove(profile.id)} disabled={isSelf} className={btnDanger}>
                      Supprimer
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
