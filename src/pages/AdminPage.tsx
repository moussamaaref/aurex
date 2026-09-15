import { useEffect, useMemo, useRef, useState } from "react"
import { products } from "../data"
import {
  loadRemoteCollection,
  loadRemoteSettings,
  saveRemoteCollection,
  saveRemoteSettings,
  loadProfiles,
  updateProfileRole,
  deleteProfile,
  inviteProfile,
  getCurrentProfile,
  requestPasswordReset,
  loadSiteSettings,
  saveSiteSettings,
  getDefaultSiteSettings,
  seedNormalizedTables,
  loadAuditLogs,
  createAuditLog,
  type ProfileRow,
  type SiteSettings,
  type AuditLog,
  type SeedResult,
} from "../lib/contentStore"
import { supabase } from "../lib/supabase"
import type { AdminTab, CollectionKey } from "./admin/types"
import {
  collectionLabels,
  defaultPages,
  defaultTheme,
  icons,
  pretty,
  type PagesState,
  type ThemeState,
} from "./admin/constants"
import { collectionTemplate, defaultCollections } from "./admin/defaults"
import { btnGhostSmall } from "./admin/components/primitives/ui"
import { validateProductTaxonomy } from "../lib/taxonomy"
import { AuthGate, ConnectionBadge } from "./admin/components/layout/AuthGate"
import { OverviewTab } from "./admin/components/tabs/OverviewTab"
import { CollectionsTab } from "./admin/components/tabs/CollectionsTab"
import { UsersTab } from "./admin/components/tabs/UsersTab"
import { PagesTab } from "./admin/components/tabs/PagesTab"
import { SiteTab } from "./admin/components/tabs/SiteTab"
import { ThemeTab } from "./admin/components/tabs/ThemeTab"
import { BackupTab } from "./admin/components/tabs/BackupTab"
import { HistoryTab } from "./admin/components/tabs/HistoryTab"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview")
  const [activeCollection, setActiveCollection] = useState<CollectionKey>("products")
  const [collections, setCollections] =
    useState<Record<CollectionKey, unknown[]>>(defaultCollections)
  const [editor, setEditor] = useState(pretty(products))
  const [pages, setPages] = useState<PagesState>(defaultPages)
  const [theme, setTheme] = useState<ThemeState>(defaultTheme)
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null)
  const [siteSaving, setSiteSaving] = useState(false)
  const [notice, setNotice] = useState<{ text: string; kind: "info" | "success" | "error" }>({
    text: "",
    kind: "info",
  })
  const notify = (text: string, kind?: "info" | "success" | "error") => {
    if (!kind) {
      kind = /impossible|échou|erreur|refus|invalid|requis|lecture seule|ne peut pas|bloqué|injoignable|indisponible|sauvegarde invalide|fichier invalide|aucun élément|sélection invalide|doit être un tableau|json invalide|n'est pas configuré/i.test(
        text,
      )
        ? "error"
        : /réussie|enregistré|terminé|actualisé|envoyé|fermée|mis à jour|supprimé|invitation|recharg|import terminé|seed terminé|liste des|historique actualisé|connexion réussie|session fermée|déconnect|record saved/i.test(
            text,
          )
          ? "success"
          : "info"
    }
    setNotice({ text, kind })
  }
  const [sessionUser, setSessionUser] = useState<{ id: string; email: string | null } | null>(null)
  const [sessionRole, setSessionRole] = useState<"admin" | "editor" | "viewer" | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<
    "unconfigured" | "checking" | "connected" | "offline"
  >("checking")
  const [authEmail, setAuthEmail] = useState("")
  const [authPassword, setAuthPassword] = useState("")
  const [authBusy, setAuthBusy] = useState(false)
  const [selectedItemIndex, setSelectedItemIndex] = useState(0)
  const fileInput = useRef<HTMLInputElement>(null)
  const [profiles, setProfiles] = useState<ProfileRow[]>([])
  const [profileBusy, setProfileBusy] = useState(false)
  const [newProfileName, setNewProfileName] = useState("")
  const [newProfileEmail, setNewProfileEmail] = useState("")
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [auditLoading, setAuditLoading] = useState(false)
  const [seedBusy, setSeedBusy] = useState(false)
  const [seedResults, setSeedResults] = useState<SeedResult[] | null>(null)
  const [editorRawOpen, setEditorRawOpen] = useState(false)

  const canEdit = sessionRole === "admin" || sessionRole === "editor"
  const isAdmin = sessionRole === "admin"
  const isViewer = sessionRole === "viewer"

  // Auth sync
  useEffect(() => {
    if (!supabase) {
      setConnectionStatus("unconfigured")
      setAuthLoading(false)
      return
    }
    let mounted = true
    const syncSession = async () => {
      try {
        const { data: sessionData } = await supabase!.auth.getSession()
        const user = sessionData.session?.user ?? null
        if (!mounted) return
        setSessionUser(user ? { id: user.id, email: user.email ?? null } : null)
        if (!user) {
          setSessionRole(null)
          setConnectionStatus("connected")
          return
        }
        const profile = await getCurrentProfile()
        if (!mounted) return
        // viewer is supported; fallback to editor if role missing for legacy
        setSessionRole((profile?.role as "admin" | "editor" | "viewer" | null) ?? null)
        setConnectionStatus("connected")
      } catch {
        if (mounted) setConnectionStatus("offline")
      } finally {
        if (mounted) setAuthLoading(false)
      }
    }
    void syncSession()
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      if (mounted) {
        setAuthLoading(true)
        void syncSession()
      }
    })
    return () => {
      mounted = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  // Load remote data after auth
  useEffect(() => {
    try {
      const storedPages = localStorage.getItem("aurex-admin-pages")
      const storedTheme = localStorage.getItem("aurex-admin-theme")
      if (storedPages) setPages({ ...defaultPages, ...JSON.parse(storedPages) })
      if (storedTheme) setTheme({ ...defaultTheme, ...JSON.parse(storedTheme) })
    } catch {
      // ignore
    }
    if (!supabase || !sessionUser || !sessionRole) return
    let mounted = true
    void (async () => {
      try {
        const remote = await loadRemoteSettings<{ pages?: typeof pages; theme?: typeof theme }>()
        if (!mounted) return
        if (remote?.pages) setPages({ ...defaultPages, ...remote.pages })
        if (remote?.theme) setTheme({ ...defaultTheme, ...remote.theme })
        const remoteCollections = await Promise.all(
          (Object.keys(collectionLabels) as CollectionKey[]).map(
            async (key) => [key, await loadRemoteCollection(key)] as const,
          ),
        )
        if (!mounted) return
        setCollections((current) =>
          remoteCollections.reduce(
            (next, [key, value]) => (value ? { ...next, [key]: value } : next),
            current,
          ),
        )
        if (isAdmin) {
          const loadedProfiles = await loadProfiles()
          if (!mounted) return
          setProfiles(loadedProfiles)
        }
        // site settings
        try {
          const s = await loadSiteSettings()
          if (mounted) setSiteSettings(s ?? getDefaultSiteSettings())
        } catch {
          if (mounted) setSiteSettings(getDefaultSiteSettings())
        }
        // audit logs
        try {
          const logs = await loadAuditLogs(50)
          if (mounted) setAuditLogs(logs)
        } catch {
          // ignore
        }
      } catch {
        if (mounted)
          notify("Impossible de charger les données Supabase. Les données locales restent disponibles.")
      }
    })()
    return () => {
      mounted = false
    }
  }, [sessionUser, sessionRole, isAdmin])

  // Audit refresh on tab
  useEffect(() => {
    if (activeTab !== "history" || !supabase || !sessionUser) return
    let mounted = true
    setAuditLoading(true)
    void (async () => {
      try {
        const logs = await loadAuditLogs(100)
        if (mounted) setAuditLogs(logs)
      } catch (e) {
        if (mounted) notify(e instanceof Error ? e.message : "Impossible de charger l'historique.")
      } finally {
        if (mounted) setAuditLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [activeTab, sessionUser])

  const stats = useMemo<[string, number][]>(() => {
    const siteKeys: CollectionKey[] = [
      "heroSlides",
      "stats",
      "marquee",
      "campaign",
      "homeSections",
      "smartPage",
      "techPage",
      "newsPage",
      "aboutPage",
      "supportPage",
    ]
    return [
      ["Produits", collections.products.length],
      ["Catégories", collections.categories.length],
      ["Familles", collections.familles.length],
      ["Sous-familles", collections.sousFamilles.length],
      ["Gammes", collections.gammes.length],
      ["Capacités", collections.capacites.length],
      ["Couleurs", collections.couleurs.length],
      ["Technologies", collections.technologies.length],
      ["Actualités", collections.news.length],
      ["FAQ", collections.faq.length],
      ["Distributeurs", collections.distributors.length],
      ["Contenus site", siteKeys.reduce((n, k) => n + (collections[k] ?? []).length, 0)],
    ]
  }, [collections])

  const editorItems = useMemo<unknown[]>(() => {
    try {
      const parsed: unknown = JSON.parse(editor)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }, [editor])

  const updateSelectedItem = (value: unknown) => {
    if (!Array.isArray(editorItems)) return
    setEditor(
      pretty(editorItems.map((item, index) => (index === selectedItemIndex ? value : item))),
    )
  }

  const selectCollection = (key: CollectionKey) => {
    setActiveCollection(key)
    setEditor(pretty(collections[key]))
    setSelectedItemIndex(0)
    setEditorRawOpen(false)
  }

  const saveCollection = async () => {
    try {
      if (!supabase) throw new Error("Supabase n'est pas configuré.")
      if (!canEdit)
        throw new Error("Votre rôle ne permet pas de modifier les données (viewer en lecture seule).")
      const parsed: unknown = JSON.parse(editor)
      if (!Array.isArray(parsed)) throw new Error("La collection doit être un tableau JSON.")
      // Validation hiérarchique des produits : Catégorie → Famille → Sous-famille → Gamme.
      if (activeCollection === "products") {
        const errors = parsed.flatMap((item, index) => {
          if (!item || typeof item !== "object") return [`Élément ${index + 1} : objet invalide.`]
          return validateProductTaxonomy(item as Record<string, unknown>).map(
            (message) => `Élément ${index + 1} : ${message}.`,
          )
        })
        if (errors.length > 0) throw new Error(errors.slice(0, 5).join(" "))
      }
      const next = { ...collections, [activeCollection]: parsed }
      setCollections(next)
      localStorage.setItem(`aurex-data-${activeCollection}`, JSON.stringify(parsed))
      await saveRemoteCollection(activeCollection, parsed)
      await createAuditLog("update", activeCollection, null, { count: parsed.length })
      notify(`${collectionLabels[activeCollection]} enregistrées dans Supabase.`)
    } catch (error) {
      notify(error instanceof Error ? error.message : "Impossible d'enregistrer dans Supabase.")
    }
  }

  const addItem = () => {
    if (!canEdit) {
      notify("Lecture seule : rôle viewer ne peut pas ajouter.")
      return
    }
    try {
      const parsed: unknown = JSON.parse(editor)
      if (!Array.isArray(parsed)) throw new Error("La collection doit être un tableau JSON.")
      const template = collectionTemplate(activeCollection)
      setEditor(pretty([...parsed, template]))
      setSelectedItemIndex(parsed.length)
      notify("Élément ajouté dans l'éditeur. Enregistrez pour confirmer.")
    } catch (error) {
      notify(error instanceof Error ? error.message : "JSON invalide.")
    }
  }

  const deleteItem = () => {
    if (!canEdit) {
      notify("Lecture seule : rôle viewer ne peut pas supprimer.")
      return
    }
    try {
      const parsed: unknown = JSON.parse(editor)
      if (!Array.isArray(parsed) || parsed.length === 0)
        throw new Error("Aucun élément à supprimer.")
      if (selectedItemIndex < 0 || selectedItemIndex >= parsed.length)
        throw new Error("Sélection invalide.")
      setEditor(pretty(parsed.filter((_item, index) => index !== selectedItemIndex)))
      setSelectedItemIndex(Math.max(0, Math.min(selectedItemIndex, parsed.length - 2)))
      notify("Élément supprimé dans l'éditeur. Enregistrez pour confirmer.")
    } catch (error) {
      notify(error instanceof Error ? error.message : "JSON invalide.")
    }
  }

  const refreshProfiles = async () => {
    try {
      if (!supabase) throw new Error("Supabase n'est pas configuré.")
      const loadedProfiles = await loadProfiles()
      setProfiles(loadedProfiles)
      notify("Liste des utilisateurs actualisée.")
    } catch (error) {
      notify(error instanceof Error ? error.message : "Impossible de charger les profils.")
    }
  }

  const createUser = async () => {
    try {
      if (!supabase) throw new Error("Supabase n'est pas configuré.")
      if (!isAdmin) throw new Error("Seul un administrateur peut inviter un utilisateur.")
      if (!newProfileEmail.trim()) throw new Error("L'email est requis.")
      setProfileBusy(true)
      await inviteProfile(newProfileEmail.trim(), newProfileName.trim() || undefined)
      setNewProfileName("")
      setNewProfileEmail("")
      setProfileBusy(false)
      await createAuditLog("invite", "profiles", newProfileEmail.trim(), {
        email: newProfileEmail.trim(),
      })
      notify("Invitation envoyée. Le profil sera créé à la première connexion (rôle éditeur).")
    } catch (error) {
      setProfileBusy(false)
      notify(error instanceof Error ? error.message : "Impossible de créer l'utilisateur.")
    }
  }

  const changeRole = async (profileId: string, role: "admin" | "editor" | "viewer") => {
    try {
      if (!supabase) throw new Error("Supabase n'est pas configuré.")
      if (!isAdmin) throw new Error("Seul un administrateur peut modifier un rôle.")
      if (profileId === sessionUser?.id && role !== "admin")
        throw new Error("Vous ne pouvez pas retirer votre propre rôle admin.")
      await updateProfileRole(profileId, role)
      setProfiles((previous) => previous.map((p) => (p.id === profileId ? { ...p, role } : p)))
      await createAuditLog("update_role", "profiles", profileId, { role })
      notify(`Rôle mis à jour.`)
    } catch (error) {
      notify(error instanceof Error ? error.message : "Impossible de modifier le rôle.")
    }
  }

  const removeUser = async (profileId: string) => {
    try {
      if (!supabase) throw new Error("Supabase n'est pas configuré.")
      if (!isAdmin) throw new Error("Seul un administrateur peut supprimer un utilisateur.")
      if (profileId === sessionUser?.id)
        throw new Error("Vous ne pouvez pas supprimer votre propre compte.")
      await deleteProfile(profileId)
      setProfiles((previous) => previous.filter((p) => p.id !== profileId))
      await createAuditLog("delete", "profiles", profileId, {})
      notify("Utilisateur supprimé.")
    } catch (error) {
      notify(error instanceof Error ? error.message : "Impossible de supprimer l'utilisateur.")
    }
  }

  const signIn = async () => {
    if (!supabase) {
      notify("Supabase n'est pas configuré.")
      return
    }
    setAuthBusy(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    })
    setAuthBusy(false)
    if (!error) {
      notify("Connexion réussie. Vous pouvez modifier les données.", "success")
      return
    }
    const raw = error.message.toLowerCase()
    if (raw.includes("invalid login credentials")) {
      notify("Connexion refusée : email ou mot de passe incorrect.", "error")
    } else if (raw.includes("email not confirmed")) {
      notify(
        "Connexion refusée : compte non confirmé. Vérifiez votre email ou demandez à un admin de confirmer le compte.",
        "error",
      )
    } else if (raw.includes("rate limit") || raw.includes("too many")) {
      notify("Trop de tentatives. Patientez quelques minutes puis réessayez.", "error")
    } else {
      notify(`Connexion refusée : ${error.message}`, "error")
    }
  }

  const signOut = async () => {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    notify(error ? `Déconnexion impossible : ${error.message}` : "Session fermée.")
  }

  const resetPassword = async () => {
    try {
      if (!supabase) throw new Error("Supabase n'est pas configuré.")
      if (!authEmail.trim())
        throw new Error("Saisissez votre email pour recevoir un lien de réinitialisation.")
      setAuthBusy(true)
      await requestPasswordReset(authEmail.trim())
      setAuthBusy(false)
      notify("Lien de réinitialisation envoyé par email.")
    } catch (error) {
      setAuthBusy(false)
      notify(
        error instanceof Error ? error.message : "Impossible d'envoyer le lien de réinitialisation.",
      )
    }
  }

  const saveSettings = async () => {
    if (!supabase) {
      notify("Supabase n'est pas configuré.")
      return
    }
    if (!canEdit) {
      notify("Lecture seule : viewer ne peut pas modifier les paramètres.")
      return
    }
    localStorage.setItem("aurex-admin-pages", JSON.stringify(pages))
    localStorage.setItem("aurex-admin-theme", JSON.stringify(theme))
    try {
      await saveRemoteSettings(pages, theme)
      await createAuditLog("update", "aurex_settings", "global", { pages, theme })
    } catch (error) {
      notify(
        error instanceof Error ? error.message : "Impossible d'enregistrer les paramètres dans Supabase.",
      )
      return
    }
    document.documentElement.style.setProperty("--color-primary", theme.primary)
    document.documentElement.style.setProperty("--color-accent", theme.accent)
    document.documentElement.style.setProperty("--color-surface", theme.surface)
    notify("Paramètres enregistrés dans Supabase.")
  }

  const saveSite = async () => {
    if (!siteSettings) return
    if (!canEdit) {
      notify("Lecture seule : viewer ne peut pas modifier le site.")
      return
    }
    setSiteSaving(true)
    try {
      await saveSiteSettings(siteSettings)
      await createAuditLog("update", "site_settings", "global", siteSettings as unknown as Record<string, unknown>)
      notify("Paramètres du site enregistrés.")
    } catch (e) {
      notify(e instanceof Error ? e.message : "Impossible d'enregistrer le site.")
    } finally {
      setSiteSaving(false)
    }
  }

  const handleSeed = async () => {
    setSeedBusy(true)
    setSeedResults(null)
    try {
      const res = await seedNormalizedTables()
      setSeedResults(res)
      await createAuditLog("seed", "normalized", null, {
        results: res as unknown as Record<string, unknown>[],
      } as unknown as Record<string, unknown>)
      notify("Seed terminé. Vérifiez les résultats ci-dessous.")
      // refresh collections
      const remoteCollections = await Promise.all(
        (Object.keys(collectionLabels) as CollectionKey[]).map(
          async (key) => [key, await loadRemoteCollection(key)] as const,
        ),
      )
      setCollections((cur) =>
        remoteCollections.reduce((n, [k, v]) => (v ? { ...n, [k]: v } : n), cur),
      )
    } catch (e) {
      notify(e instanceof Error ? e.message : "Seed échoué.")
    } finally {
      setSeedBusy(false)
    }
  }

  const exportData = () => {
    const payload = { collections, pages, theme, siteSettings, exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "aurex-front-office-backup.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  const importData = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const payload = JSON.parse(String(reader.result)) as {
          collections?: Record<CollectionKey, unknown[]>
          pages?: typeof pages
          theme?: typeof theme
        }
        if (!payload.collections) throw new Error("Sauvegarde invalide.")
        ;(Object.keys(payload.collections) as CollectionKey[]).forEach((key) => {
          if (!(key in collectionLabels)) throw new Error(`Collection inconnue : ${key}.`)
          const value = payload.collections?.[key] ?? []
          if (!Array.isArray(value)) throw new Error(`Collection invalide : ${key}.`)
          localStorage.setItem(`aurex-data-${key}`, JSON.stringify(value))
        })
        if (payload.pages) localStorage.setItem("aurex-admin-pages", JSON.stringify(payload.pages))
        if (payload.theme) localStorage.setItem("aurex-admin-theme", JSON.stringify(payload.theme))
        notify("Import terminé. Rechargez la page pour afficher les données importées.")
      } catch (error) {
        notify(error instanceof Error ? error.message : "Fichier invalide.")
      }
    }
    reader.readAsText(file)
  }

  const refreshAuditLogs = async () => {
    setAuditLoading(true)
    try {
      const logs = await loadAuditLogs(100)
      setAuditLogs(logs)
      notify("Historique actualisé.")
    } catch (e) {
      notify(e instanceof Error ? e.message : "Impossible de charger.")
    } finally {
      setAuditLoading(false)
    }
  }

  const tabs: Array<[AdminTab, string]> = [
    ["overview", "Vue d'ensemble"],
    ["collections", "Données de l'application"],
    ...(isAdmin ? [["users", "Utilisateurs"] as [AdminTab, string]] : []),
    ["pages", "Pages et SEO"],
    ["site", "Site & Marque"],
    ["theme", "Thème"],
    ["backup", "Import / Export"],
    ["history", "Historique"],
  ]

  const gate = (
    <AuthGate
      connectionStatus={connectionStatus}
      hasSupabase={!!supabase}
      authLoading={authLoading}
      sessionUser={sessionUser}
      sessionRole={sessionRole}
      authEmail={authEmail}
      onAuthEmail={setAuthEmail}
      authPassword={authPassword}
      onAuthPassword={setAuthPassword}
      authBusy={authBusy}
      onSignIn={() => void signIn()}
      onResetPassword={() => void resetPassword()}
      onSignOut={() => void signOut()}
      message={notice.text}
      messageKind={notice.kind}
    />
  )
  const isGateOpen =
    authLoading ||
    connectionStatus === "checking" ||
    connectionStatus === "unconfigured" ||
    connectionStatus === "offline" ||
    !sessionUser ||
    !sessionRole

  return (
    <div className="min-h-screen bg-[#F7F4EC] px-4 pb-16 pt-6 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold text-[#B08D4F]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B08D4F]" />
              AUREX — Console
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0A2342]">
              Front office complet
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#6B6459]">
              Ajoutez, modifiez, supprimez et sauvegardez toutes les données utilisées par
              l'application.
            </p>
            {isViewer && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#FBF3E3] px-3 py-1 text-xs font-semibold text-[#B8863D]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B8863D]" /> Mode lecture seule — rôle
                viewer
              </p>
            )}
          </div>
          <div className="flex flex-col items-stretch gap-3 sm:items-end">
            <div className="flex flex-wrap items-center gap-2">
              <ConnectionBadge
                status={connectionStatus}
                email={sessionUser?.email ?? sessionUser?.id}
                role={sessionRole}
                isViewer={isViewer}
              />
              {sessionUser && (
                <>
                  <span className="max-w-56 truncate text-xs text-[#8A8474]">
                    {sessionUser.email ?? sessionUser.id}
                  </span>
                  <button type="button" onClick={() => void signOut()} className={btnGhostSmall}>
                    Se déconnecter
                  </button>
                </>
              )}
            </div>
            {!isGateOpen && notice.text && (
              <p
                aria-live="polite"
                className={`rounded-xl px-4 py-3 text-xs font-medium ${
                  notice.kind === "error"
                    ? "bg-[#FBEAEA] text-[#C1443D]"
                    : notice.kind === "success"
                      ? "bg-[#E6F4EC] text-[#1F8A5F]"
                      : "bg-[#F0F4FE] text-[#0A2342]"
                }`}
              >
                {notice.text}
              </p>
            )}
          </div>
        </header>

        {isGateOpen ? (
          gate
        ) : (
          <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
            <aside className="h-fit rounded-2xl bg-[#0A2342] p-2 shadow-[0_1px_2px_rgba(10,35,66,0.2),0_20px_40px_-24px_rgba(10,35,66,0.65)] lg:sticky lg:top-6">
              <div className="mb-2 px-3 pb-3 pt-2">
                <p className="text-base font-semibold tracking-tight text-white">AUREX</p>
                <p className="text-[11px] font-medium text-[#B08D4F]">Console d'administration</p>
              </div>
              {tabs.map(([id, label]) => {
                const isActive = activeTab === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={`mb-1 flex w-full items-center gap-2.5 rounded-xl border-l-2 px-3.5 py-2.5 text-left text-sm font-medium transition ${
                      isActive
                        ? "border-[#B08D4F] bg-white/10 text-white"
                        : "border-transparent text-white/60 hover:border-white/20 hover:bg-white/5 hover:text-white/90"
                    }`}
                  >
                    <span className={`text-xs ${isActive ? "text-[#B08D4F]" : "text-white/40"}`}>
                      {icons[id] ?? "•"}
                    </span>{" "}
                    {label}
                  </button>
                )
              })}
            </aside>

            <main className="space-y-6">
              {activeTab === "overview" && (
                <OverviewTab
                  stats={stats}
                  onManageCollections={() => setActiveTab("collections")}
                  onSiteSettings={() => setActiveTab("site")}
                  onHistory={() => setActiveTab("history")}
                  isViewer={isViewer}
                />
              )}

              {activeTab === "collections" && (
                <CollectionsTab
                  collections={collections}
                  activeCollection={activeCollection}
                  onSelectCollection={selectCollection}
                  editorItems={editorItems}
                  selectedItemIndex={selectedItemIndex}
                  onSelectItemIndex={setSelectedItemIndex}
                  onAdd={addItem}
                  onDelete={deleteItem}
                  onSave={() => void saveCollection()}
                  editor={editor}
                  onEditorChange={setEditor}
                  editorRawOpen={editorRawOpen}
                  onToggleRaw={() => setEditorRawOpen((v) => !v)}
                  onUpdateSelectedItem={updateSelectedItem}
                  canEdit={canEdit}
                />
              )}

              {activeTab === "users" && isAdmin && (
                <UsersTab
                  profiles={profiles}
                  profileBusy={profileBusy}
                  newProfileName={newProfileName}
                  onNameChange={setNewProfileName}
                  newProfileEmail={newProfileEmail}
                  onEmailChange={setNewProfileEmail}
                  onRefresh={() => void refreshProfiles()}
                  onCreate={() => void createUser()}
                  onChangeRole={(id, role) => void changeRole(id, role)}
                  onRemove={(id) => void removeUser(id)}
                />
              )}

              {activeTab === "pages" && (
                <PagesTab
                  pages={pages}
                  onPagesChange={setPages}
                  onSave={() => void saveSettings()}
                  isViewer={isViewer}
                />
              )}

              {activeTab === "site" && (
                <SiteTab
                  siteSettings={siteSettings}
                  onSiteChange={setSiteSettings}
                  onSave={() => void saveSite()}
                  siteSaving={siteSaving}
                  isViewer={isViewer}
                />
              )}

              {activeTab === "theme" && (
                <ThemeTab
                  theme={theme}
                  onThemeChange={setTheme}
                  onSave={() => void saveSettings()}
                  isViewer={isViewer}
                />
              )}

              {activeTab === "backup" && (
                <BackupTab
                  onExport={exportData}
                  onImportFile={importData}
                  fileInputRef={fileInput}
                  onSeed={() => void handleSeed()}
                  seedBusy={seedBusy}
                  seedResults={seedResults}
                  canEdit={canEdit}
                />
              )}

              {activeTab === "history" && (
                <HistoryTab
                  auditLogs={auditLogs}
                  auditLoading={auditLoading}
                  onRefresh={() => void refreshAuditLogs()}
                />
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  )
}
