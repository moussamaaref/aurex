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
        <span className="rounded-full bg-[#EDEAE0] px-3 py-1 text-xs font-semibold text-[#6B6459]">
          Supabase non configuré
        </span>
      )
    case "checking":
      return (
        <span className="rounded-full bg-[#FBF3E3] px-3 py-1 text-xs font-semibold text-[#B8863D]">
          Vérification...
        </span>
      )
    case "offline":
      return (
        <span className="rounded-full bg-[#FBEAEA] px-3 py-1 text-xs font-semibold text-[#C1443D]">
          Hors ligne
        </span>
      )
    default:
      return email ? (
        <span className="rounded-full bg-[#E6F4EC] px-3 py-1 text-xs font-semibold text-[#1F8A5F]">
          Connecté{role ? ` • ${role}` : ""}
          {isViewer ? " • lecture seule" : ""}
        </span>
      ) : (
        <span className="rounded-full bg-[#FBF3E3] px-3 py-1 text-xs font-semibold text-[#B8863D]">
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
        <p className="text-sm font-semibold text-[#4A4438]">Vérification de la session Supabase...</p>
      </section>
    )
  }
  if (connectionStatus === "unconfigured" || !hasSupabase) {
    return (
      <section className={`mx-auto max-w-md p-8 text-center ${cardBase}`}>
        <h2 className="text-xl font-semibold tracking-tight text-[#0A2342]">CMS indisponible</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#6B6459]">
          Les variables <code className="rounded bg-[#F7F4EC] px-1.5 py-0.5">VITE_SUPABASE_URL</code>{" "}
          et <code className="rounded bg-[#F7F4EC] px-1.5 py-0.5">VITE_SUPABASE_ANON_KEY</code> ne
          sont pas configurées. L'administration nécessite une session Supabase authentifiée.
        </p>
      </section>
    )
  }
  if (connectionStatus === "offline") {
    return (
      <section className={`mx-auto max-w-md p-8 text-center ${cardBase}`}>
        <h2 className="text-xl font-semibold tracking-tight text-[#0A2342]">Supabase injoignable</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#6B6459]">
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
        <h2 className="text-xl font-semibold tracking-tight text-[#0A2342]">Connexion requise</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#6B6459]">
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
          className="mt-4 w-full text-center text-xs font-semibold text-[#2F5FE8] hover:underline disabled:opacity-50"
        >
          Mot de passe oublié ? Recevoir un lien de réinitialisation
        </button>
        {message && (
          <p
            className={`mt-4 rounded-xl px-4 py-3 text-xs font-medium ${
              messageKind === "error"
                ? "bg-[#FBEAEA] text-[#C1443D]"
                : messageKind === "success"
                  ? "bg-[#E6F4EC] text-[#1F8A5F]"
                  : "bg-[#F0F4FE] text-[#0A2342]"
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
        <h2 className="text-xl font-semibold tracking-tight text-[#0A2342]">Accès refusé</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#6B6459]">
          Le compte <span className="font-semibold text-[#12233F]">{sessionUser.email ?? sessionUser.id}</span>{" "}
          n'a aucun rôle admin, éditeur ou viewer dans la table{" "}
          <code className="rounded bg-[#F7F4EC] px-1.5 py-0.5">profiles</code>. Demandez à un
          administrateur de vous attribuer un rôle.
        </p>
        <button type="button" onClick={onSignOut} className={`mt-5 ${btnSecondary}`}>
          Se déconnecter
        </button>
        {message && (
          <p
            className={`mt-4 rounded-xl px-4 py-3 text-left text-xs font-medium ${
              messageKind === "error"
                ? "bg-[#FBEAEA] text-[#C1443D]"
                : messageKind === "success"
                  ? "bg-[#E6F4EC] text-[#1F8A5F]"
                  : "bg-[#F0F4FE] text-[#0A2342]"
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
