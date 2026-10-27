// Edge Function « admin-users » : gestion des comptes (création avec mot de passe, changement de mot de passe,
// suppression, liste des e-mails). Réservée aux utilisateurs dont profiles.role = 'admin'.
// Déploiement : supabase functions deploy admin-users
// (SUPABASE_URL, SUPABASE_ANON_KEY et SUPABASE_SERVICE_ROLE_KEY sont fournis automatiquement par Supabase.)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } })

const ROLES = ["admin", "editor", "viewer"]
const MIN_PASSWORD = 10

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors })
  try {
    const url = Deno.env.get("SUPABASE_URL")!
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

    // Le jeton de l'utilisateur connecté doit être passé explicitement à getUser() (pas de session côté serveur).
    const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "").trim()
    if (!token) return json({ error: "Non authentifié : ouvrez cette fonction depuis /admin en étant connecté." }, 401)
    const caller = createClient(url, anon, { auth: { persistSession: false } })
    const { data: userData, error: userError } = await caller.auth.getUser(token)
    const user = userData?.user
    if (userError || !user) return json({ error: "Session invalide ou expirée : reconnectez-vous sur /admin." }, 401)

    const admin = createClient(url, service, { auth: { persistSession: false } })
    const { data: me } = await admin.from("profiles").select("role").eq("id", user.id).maybeSingle()
    if (me?.role !== "admin") return json({ error: "Action réservée aux administrateurs." }, 403)

    const body = await req.json()
    const action = String(body.action ?? "")

    if (action === "list") {
      const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
      if (error) return json({ error: error.message }, 400)
      return json({ users: data.users.map((u) => ({ id: u.id, email: u.email ?? null, last_sign_in_at: u.last_sign_in_at ?? null })) })
    }

    if (action === "create") {
      const email = String(body.email ?? "").trim().toLowerCase()
      const password = String(body.password ?? "")
      const fullName = String(body.full_name ?? "").trim()
      const role = String(body.role ?? "editor")
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "E-mail invalide." }, 400)
      if (password.length < MIN_PASSWORD) return json({ error: `Mot de passe trop court (${MIN_PASSWORD} caractères minimum).` }, 400)
      if (!ROLES.includes(role)) return json({ error: "Rôle invalide." }, 400)
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      })
      if (error || !data.user) return json({ error: error?.message ?? "Création impossible." }, 400)
      const { error: profileError } = await admin
        .from("profiles")
        .upsert({ id: data.user.id, full_name: fullName, role }, { onConflict: "id" })
      if (profileError) return json({ error: profileError.message }, 400)
      return json({ id: data.user.id, email })
    }

    if (action === "set_password") {
      const userId = String(body.user_id ?? "")
      const password = String(body.password ?? "")
      if (!userId) return json({ error: "Utilisateur manquant." }, 400)
      if (password.length < MIN_PASSWORD) return json({ error: `Mot de passe trop court (${MIN_PASSWORD} caractères minimum).` }, 400)
      const { error } = await admin.auth.admin.updateUserById(userId, { password })
      if (error) return json({ error: error.message }, 400)
      return json({ ok: true })
    }

    if (action === "delete") {
      const userId = String(body.user_id ?? "")
      if (!userId) return json({ error: "Utilisateur manquant." }, 400)
      if (userId === user.id) return json({ error: "Vous ne pouvez pas supprimer votre propre compte." }, 400)
      const { error } = await admin.auth.admin.deleteUser(userId)
      if (error) return json({ error: error.message }, 400)
      return json({ ok: true })
    }

    return json({ error: "Action inconnue." }, 400)
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Erreur serveur." }, 500)
  }
})
