import { btnPrimary, btnSecondary, cardBase, inputBase } from "../primitives/ui"

export type ConnectionStatus = "unconfigured" | "checking" | "connected" | "offline"

export function ConnectionBadge({
  status,
  email,
  role,
  isViewer,
}: {
  status: ConnectionStatus
  email?: string | null
  role?: string | null
  isViewer?: boolean
}) {
  switch (status) {
    case "unconfigured":
      return (
        <span className="rounded-full bg-control-gray px-3 py-1 text-xs font-semibold text-slate">
          Supabase non configuré
        </span>
      )
    case "checking":
      return (
        <span className="rounded-full bg-orange-wash px-3 py-1 text-xs font-semibold text-launch-orange">
          Vérification...
        </span>
      )
    case "offline":
      return (
        <span className="rounded-full bg-danger-wash px-3 py-1 text-xs font-semibold text-danger">
          Hors ligne
        </span>
      )
    default:
      return email ? (
        <span className="rounded-full bg-green-wash px-3 py-1 text-xs font-semibold text-deep-green">
          Connecté{role ? ` • ${role}` : ""}
          {isViewer ? " • lecture seule" : ""}
        </span>
      ) : (
        <span className="rounded-full bg-orange-wash px-3 py-1 text-xs font-semibold text-launch-orange">
          Non connecté
        </span>
      )
  }
}

export function AuthGate({
  connectionStatus,
  hasSupabase,
  authLoading,
  sessionUser,
  sessionRole,
  authEmail,
  onAuthEmail,
  authPassword,
  onAuthPassword,
  authBusy,
  onSignIn,
  onResetPassword,
  onSignOut,
  message,
  messageKind,
}: {
  connectionStatus: ConnectionStatus
  hasSupabase: boolean
  authLoading: boolean
  sessionUser: { id: string; email: string | null } | null
  sessionRole: string | null
  authEmail: string
  onAuthEmail: (value: string) => void
  authPassword: string
  onAuthPassword: (value: string) => void
  authBusy: boolean
  onSignIn: () => void
  onResetPassword: () => void
  onSignOut: () => void
  message: string
  messageKind: "info" | "success" | "error"
}) {
  if (authLoading || connectionStatus === "checking") {
    return (
      <section className={`mx-auto max-w-md p-8 text-center ${cardBase}`}>
        <p className="text-sm font-semibold text-charcoal">Vérification de la session Supabase...</p>
      </section>
    )
  }
  if (connectionStatus === "unconfigured" || !hasSupabase) {
    return (
      <section className={`mx-auto max-w-md p-8 text-center ${cardBase}`}>
        <h2 className="text-xl font-semibold tracking-tight text-obsidian">CMS indisponible</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate">
          Les variables <code className="rounded bg-studio-mist px-1.5 py-0.5">VITE_SUPABASE_URL</code>{" "}
          et <code className="rounded bg-studio-mist px-1.5 py-0.5">VITE_SUPABASE_ANON_KEY</code> ne
          sont pas configurées. L'administration nécessite une session Supabase authentifiée.
        </p>
      </section>
    )
  }
  if (connectionStatus === "offline") {
    return (
      <section className={`mx-auto max-w-md p-8 text-center ${cardBase}`}>
        <h2 className="text-xl font-semibold tracking-tight text-obsidian">Supabase injoignable</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate">
          Impossible de vérifier la session. Vérifiez votre connexion puis rechargez la page.
        </p>
        <button type="button" onClick={() => window.location.reload()} className={`mt-5 ${btnPrimary}`}>
          Recharger
        </button>
      </section>
    )
  }
  if (!sessionUser) {
    return (
      <section className={`mx-auto max-w-md p-8 ${cardBase}`}>
        <h2 className="text-xl font-semibold tracking-tight text-obsidian">Connexion requise</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate">
          L'administration est réservée aux comptes admin, éditeur et viewer enregistrés dans
          Supabase.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            onSignIn()
          }}
          className="mt-6 space-y-3"
        >
          <input
            type="email"
            value={authEmail}
            onChange={(event) => onAuthEmail(event.target.value)}
            placeholder="Email admin / éditeur / viewer"
            required
            className={inputBase}
          />
          <input
            type="password"
            value={authPassword}
            onChange={(event) => onAuthPassword(event.target.value)}
            placeholder="Mot de passe"
            required
            className={inputBase}
          />
          <button type="submit" disabled={authBusy} className={`w-full ${btnPrimary}`}>
            {authBusy ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        <button
          type="button"
          onClick={onResetPassword}
          disabled={authBusy}
          className="mt-4 w-full text-center text-xs font-semibold text-link-deep hover:underline disabled:opacity-50"
        >
          Mot de passe oublié ? Recevoir un lien de réinitialisation
        </button>
        {message && (
          <p
            className={`mt-4 rounded-xl px-4 py-3 text-xs font-medium ${
              messageKind === "error"
                ? "bg-danger-wash text-danger"
                : messageKind === "success"
                  ? "bg-green-wash text-deep-green"
                  : "bg-blue-wash text-obsidian"
            }`}
          >
            {message}
          </p>
        )}
      </section>
    )
  }
  if (!sessionRole) {
    return (
      <section className={`mx-auto max-w-md p-8 text-center ${cardBase}`}>
        <h2 className="text-xl font-semibold tracking-tight text-obsidian">Accès refusé</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate">
          Le compte <span className="font-semibold text-obsidian">{sessionUser.email ?? sessionUser.id}</span>{" "}
          n'a aucun rôle admin, éditeur ou viewer dans la table{" "}
          <code className="rounded bg-studio-mist px-1.5 py-0.5">profiles</code>. Demandez à un
          administrateur de vous attribuer un rôle.
        </p>
        <button type="button" onClick={onSignOut} className={`mt-5 ${btnSecondary}`}>
          Se déconnecter
        </button>
        {message && (
          <p
            className={`mt-4 rounded-xl px-4 py-3 text-left text-xs font-medium ${
              messageKind === "error"
                ? "bg-danger-wash text-danger"
                : messageKind === "success"
                  ? "bg-green-wash text-deep-green"
                  : "bg-blue-wash text-obsidian"
            }`}
          >
            {message}
          </p>
        )}
      </section>
    )
  }
  return null
}
