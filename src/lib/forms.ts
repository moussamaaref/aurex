import { supabase } from "./supabase"

/** Résultat d'envoi : `stored` = enregistré côté serveur, `local` = mode aperçu (Supabase non configuré). */
export type SubmitResult = { ok: true; mode: "stored" | "local"; reference?: string } | { ok: false }

function localQueue(key: string, row: Record<string, unknown>) {
  try {
    const list = JSON.parse(localStorage.getItem(key) || "[]") as unknown[]
    list.push({ ...row, created_at: new Date().toISOString() })
    localStorage.setItem(key, JSON.stringify(list))
  } catch {
    // stockage indisponible
  }
}

export async function subscribeNewsletter(email: string, lang: string): Promise<SubmitResult> {
  const row = { email: email.trim().toLowerCase(), lang }
  if (!supabase) {
    localQueue("aurex-newsletter-queue", row)
    return { ok: true, mode: "local" }
  }
  const { error } = await supabase.from("newsletter_subscribers").insert(row)
  // 23505 = e-mail déjà inscrit : succès côté visiteur.
  if (error && error.code !== "23505") return { ok: false }
  return { ok: true, mode: "stored" }
}

export interface SupportRequest {
  full_name: string
  phone: string
  wilaya: string
  commune: string
  device_class: string
  device_reference: string
  request_type: "maintenance" | "warranty" | "spare-parts" | "inquiry"
  message: string
  lang: string
}

/** Référence de demande lisible : AUR-AAAAMMJJ-XXXX */
export function makeReference(): string {
  const d = new Date()
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `AUR-${ymd}-${rnd}`
}

export async function submitSupportRequest(req: SupportRequest, attachment: File | null): Promise<SubmitResult> {
  const reference = makeReference()
  const row = { ...req, reference, attachment_name: attachment?.name ?? null }
  if (!supabase) {
    localQueue("aurex-support-queue", row)
    return { ok: true, mode: "local", reference }
  }
  let attachment_url: string | null = null
  if (attachment) {
    const path = `support/${reference}-${attachment.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`
    const up = await supabase.storage.from("support-uploads").upload(path, attachment)
    if (!up.error) attachment_url = path
  }
  const { error } = await supabase.from("support_requests").insert({ ...row, attachment_url })
  if (error) return { ok: false }
  return { ok: true, mode: "stored", reference }
}
