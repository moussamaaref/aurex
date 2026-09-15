import { supabase } from "./supabase"

type RemoteRow = Record<string, unknown>

export async function loadRemoteCollection<T>(key: string): Promise<T[] | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from("aurex_collections")
    .select("items")
    .eq("collection_key", key)
    .maybeSingle()
  if (error) throw error
  return (data?.items as T[] | undefined) ?? null
}

export async function loadNormalizedCollections() {
  if (!supabase) return null
  const [categoryResult, productResult, technologyResult, newsResult, faqResult, distributorResult, familleResult, sousFamilleResult, gammeResult, capaciteResult, couleurResult, prodCapResult, prodCoulResult] =
    await Promise.all([
      supabase.from("categories").select("*").eq("is_active", true).order("sort_order"),
      supabase.from("products").select("*").eq("is_active", true).order("created_at"),
      supabase.from("technologies").select("*").eq("is_active", true).order("created_at"),
      supabase.from("news").select("*").eq("is_published", true).order("published_at", { ascending: false }),
      supabase.from("faq").select("*").eq("is_active", true).order("sort_order"),
      supabase.from("distributors").select("*").eq("is_active", true).order("name"),
      supabase.from("familles").select("*").eq("is_active", true).order("sort_order"),
      supabase.from("sous_familles").select("*").eq("is_active", true).order("sort_order"),
      supabase.from("gammes").select("*").eq("is_active", true).order("sort_order"),
      supabase.from("capacites").select("*").eq("is_active", true).order("sort_order"),
      supabase.from("couleurs").select("*").eq("is_active", true).order("sort_order"),
      supabase.from("product_capacites").select("product_id, capacite_slug"),
      supabase.from("product_couleurs").select("product_id, couleur_slug"),
    ])
  const firstError = [categoryResult, productResult, technologyResult, newsResult, faqResult, distributorResult]
    .map((result) => result.error)
    .find(Boolean)
  if (firstError) throw firstError

  // Jonctions many-to-many → ids par produit (tables absentes si migration non jouée : repli silencieux)
  const capByProduct = new Map<string, string[]>()
  for (const row of ((prodCapResult.data ?? []) as Array<{ product_id: string; capacite_slug: string }>)) {
    if (!row?.product_id || !row?.capacite_slug) continue
    const list = capByProduct.get(row.product_id) ?? []
    list.push(String(row.capacite_slug))
    capByProduct.set(row.product_id, list)
  }
  const coulByProduct = new Map<string, string[]>()
  for (const row of ((prodCoulResult.data ?? []) as Array<{ product_id: string; couleur_slug: string }>)) {
    if (!row?.product_id || !row?.couleur_slug) continue
    const list = coulByProduct.get(row.product_id) ?? []
    list.push(String(row.couleur_slug))
    coulByProduct.set(row.product_id, list)
  }

  const mapProduct = (row: RemoteRow) => ({
    ...row,
    category: row.category_slug,
    // Hiérarchie taxonomique (colonnes absentes si migration non jouée : undefined → repli legacy)
    famille: row.famille_id ?? undefined,
    sousFamille: row.sous_famille_id ?? undefined,
    gamme: row.gamme_id ?? undefined,
    capacites: capByProduct.get(String(row.id ?? "")),
    couleurs: coulByProduct.get(String(row.id ?? "")),
    slug: row.slug ?? undefined,
    energyClass: row.energy_class,
    noiseLevel: row.noise_level,
    images: Array.isArray(row.images) ? row.images : [],
    technologies: Array.isArray(row.technologies) ? row.technologies : [],
    features: Array.isArray(row.features) ? row.features : [],
  })
  const mapTechnology = (row: RemoteRow) => ({
    ...row,
    compatibleCategories: row.compatible_categories,
  })
  const mapNews = (row: RemoteRow) => ({
    ...row,
    date: row.published_at,
  })
  const mapFaq = (row: RemoteRow) => ({
    q: row.question,
    a: row.answer,
  })
  const mapDistributor = (row: RemoteRow) => ({
    id: row.id,
    name: row.name,
    address: row.address,
    wilaya: row.wilaya,
    commune: row.commune,
    phone: row.phone,
    email: row.email,
    lat: row.latitude,
    lng: row.longitude,
  })

  return {
    categories: (categoryResult.data ?? []) as unknown[],
    products: (productResult.data ?? []).map(mapProduct),
    familles: (familleResult.data ?? []) as unknown[],
    sousFamilles: (sousFamilleResult.data ?? []) as unknown[],
    gammes: (gammeResult.data ?? []) as unknown[],
    capacites: (capaciteResult.data ?? []) as unknown[],
    couleurs: (couleurResult.data ?? []) as unknown[],
    technologies: (technologyResult.data ?? []).map(mapTechnology),
    news: (newsResult.data ?? []).map(mapNews),
    faq: (faqResult.data ?? []).map(mapFaq),
    distributors: (distributorResult.data ?? []).map(mapDistributor),
  }
}

export async function saveRemoteCollection(key: string, items: unknown[]) {
  if (!supabase) return
  const { error } = await supabase.from("aurex_collections").upsert(
    { collection_key: key, items, updated_at: new Date().toISOString() },
    { onConflict: "collection_key" },
  )
  if (error) throw error
}

export async function loadRemoteSettings<T>(): Promise<T | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from("aurex_settings")
    .select("pages, theme")
    .eq("id", "global")
    .maybeSingle()
  if (error) throw error
  return data ? ({ pages: data.pages, theme: data.theme } as T) : null
}

export async function saveRemoteSettings(pages: unknown, theme: unknown) {
  if (!supabase) return
  const { error } = await supabase.from("aurex_settings").upsert(
    { id: "global", pages, theme, updated_at: new Date().toISOString() },
    { onConflict: "id" },
  )
  if (error) throw error
}

export type SiteSettings = {
  id: string
  logoUrl: string | null
  faviconUrl: string | null
  primaryColor: string
  accentColor: string
  surfaceColor: string
  contactEmail: string | null
  contactPhone: string | null
  contactAddress: string | null
  socialLinks: Record<string, string>
  languages: string[]
  maintenanceMode: boolean
  logoText: string
  logoTextColor: string
  logoIconBg: string
  logoAccent: string
  logoIconUrl: string | null
  showLogoIcon: boolean
  showLogoImage: boolean
  showLogoText: boolean
  updatedAt?: string
}

const defaultSiteSettings: SiteSettings = {
  id: "global",
  logoUrl: null,
  faviconUrl: null,
  primaryColor: "rgba(0, 142, 208, 1)",
  accentColor: "rgba(0, 119, 182, 1)",
  surfaceColor: "rgba(249, 250, 251, 1)",
  contactEmail: "support@aurex-dz.com",
  contactPhone: "+213 21 XX XX XX",
  contactAddress: "Alger, Algérie",
  socialLinks: {},
  languages: ["fr", "ar", "en"],
  maintenanceMode: false,
  logoText: "aurex",
  logoTextColor: "#168BC3",
  logoIconBg: "var(--color-primary)",
  logoAccent: "var(--color-accent)",
  logoIconUrl: null,
  showLogoIcon: true,
  showLogoImage: true,
  showLogoText: false,
}

function mapSiteSettings(row: Record<string, unknown>): SiteSettings {
  return {
    id: String(row.id ?? "global"),
    logoUrl: (row.logo_url as string | null) ?? null,
    faviconUrl: (row.favicon_url as string | null) ?? null,
    primaryColor: String(row.primary_color ?? defaultSiteSettings.primaryColor),
    accentColor: String(row.accent_color ?? defaultSiteSettings.accentColor),
    surfaceColor: String(row.surface_color ?? defaultSiteSettings.surfaceColor),
    contactEmail: (row.contact_email as string | null) ?? defaultSiteSettings.contactEmail,
    contactPhone: (row.contact_phone as string | null) ?? defaultSiteSettings.contactPhone,
    contactAddress: (row.contact_address as string | null) ?? defaultSiteSettings.contactAddress,
    socialLinks: (row.social_links as Record<string, string> | null) ?? {},
    languages: Array.isArray(row.languages) ? (row.languages as string[]) : defaultSiteSettings.languages,
    maintenanceMode: Boolean(row.maintenance_mode),
    logoText: String(row.logo_text ?? defaultSiteSettings.logoText),
    logoTextColor: String(row.logo_text_color ?? defaultSiteSettings.logoTextColor),
    logoIconBg: String(row.logo_icon_bg ?? defaultSiteSettings.logoIconBg),
    logoAccent: String(row.logo_accent ?? defaultSiteSettings.logoAccent),
    logoIconUrl: (row.logo_icon_url as string | null) ?? null,
    showLogoIcon: row.show_logo_icon === undefined ? defaultSiteSettings.showLogoIcon : Boolean(row.show_logo_icon),
    showLogoImage: row.show_logo_image === undefined ? defaultSiteSettings.showLogoImage : Boolean(row.show_logo_image),
    showLogoText: row.show_logo_text === undefined ? defaultSiteSettings.showLogoText : Boolean(row.show_logo_text),
    updatedAt: row.updated_at as string | undefined,
  }
}

export async function loadSiteSettings(): Promise<SiteSettings | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", "global").maybeSingle()
  if (error) throw error
  if (!data) return null
  return mapSiteSettings(data as unknown as Record<string, unknown>)
}

export async function saveSiteSettings(patch: Partial<SiteSettings>): Promise<void> {
  if (!supabase) throw new Error("Supabase n'est pas configuré.")
  const row: Record<string, unknown> = { id: "global", updated_at: new Date().toISOString() }
  if (patch.logoUrl !== undefined) row.logo_url = patch.logoUrl
  if (patch.faviconUrl !== undefined) row.favicon_url = patch.faviconUrl
  if (patch.primaryColor !== undefined) row.primary_color = patch.primaryColor
  if (patch.accentColor !== undefined) row.accent_color = patch.accentColor
  if (patch.surfaceColor !== undefined) row.surface_color = patch.surfaceColor
  if (patch.contactEmail !== undefined) row.contact_email = patch.contactEmail
  if (patch.contactPhone !== undefined) row.contact_phone = patch.contactPhone
  if (patch.contactAddress !== undefined) row.contact_address = patch.contactAddress
  if (patch.socialLinks !== undefined) row.social_links = patch.socialLinks
  if (patch.languages !== undefined) row.languages = patch.languages
  if (patch.maintenanceMode !== undefined) row.maintenance_mode = patch.maintenanceMode
  if (patch.logoText !== undefined) row.logo_text = patch.logoText
  if (patch.logoTextColor !== undefined) row.logo_text_color = patch.logoTextColor
  if (patch.logoIconBg !== undefined) row.logo_icon_bg = patch.logoIconBg
  if (patch.logoAccent !== undefined) row.logo_accent = patch.logoAccent
  if (patch.logoIconUrl !== undefined) row.logo_icon_url = patch.logoIconUrl
  if (patch.showLogoIcon !== undefined) row.show_logo_icon = patch.showLogoIcon
  if (patch.showLogoImage !== undefined) row.show_logo_image = patch.showLogoImage
  if (patch.showLogoText !== undefined) row.show_logo_text = patch.showLogoText
  const { error } = await supabase.from("site_settings").upsert(row, { onConflict: "id" })
  if (error) {
    // Compatibilité : la colonne logo_icon_url peut manquer en prod → réessaie sans elle
    if (error.message.includes("logo_icon_url") && "logo_icon_url" in row) {
      delete row.logo_icon_url
      const { error: retryError } = await supabase.from("site_settings").upsert(row, { onConflict: "id" })
      if (retryError) throw retryError
      return
    }
    throw error
  }
}

export function getDefaultSiteSettings(): SiteSettings {
  return { ...defaultSiteSettings }
}

export type PageRow = {
  slug: string
  title: string
  description: string
  content: Record<string, unknown>
  seoTitle: string | null
  seoDescription: string | null
  seoKeywords: string | null
  isPublished: boolean
  updatedAt: string
}

function mapPageRow(row: Record<string, unknown>): PageRow {
  return {
    slug: String(row.slug),
    title: String(row.title ?? ""),
    description: String(row.description ?? ""),
    content: (row.content as Record<string, unknown> | null) ?? {},
    seoTitle: (row.seo_title as string | null) ?? null,
    seoDescription: (row.seo_description as string | null) ?? null,
    seoKeywords: (row.seo_keywords as string | null) ?? null,
    isPublished: Boolean(row.is_published),
    updatedAt: String(row.updated_at ?? ""),
  }
}

export async function loadPublicPages(): Promise<PageRow[] | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from("pages").select("*").eq("is_published", true).order("slug")
  if (error) throw error
  if (!data) return null
  return (data as unknown as Record<string, unknown>[]).map(mapPageRow)
}

export async function loadPageBySlug(slug: string): Promise<PageRow | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from("pages").select("*").eq("slug", slug).eq("is_published", true).maybeSingle()
  if (error) throw error
  if (!data) return null
  return mapPageRow(data as unknown as Record<string, unknown>)
}

export type SeedResult = { table: string; inserted: number; error?: string }

function toIsoDate(input: string): string | null {
  const parsed = Date.parse(input)
  if (!Number.isNaN(parsed)) return new Date(parsed).toISOString().slice(0, 10)
  const months: Record<string, string> = { janvier: "01", février: "02", fevrier: "02", mars: "03", avril: "04", mai: "05", juin: "06", juillet: "07", août: "08", aout: "08", septembre: "09", octobre: "10", novembre: "11", décembre: "12", decembre: "12" }
  const m = input.toLowerCase().match(/(\d{1,2})\s+([a-zéû]+)\s+(\d{4})/)
  if (!m) return null
  const day = m[1].padStart(2, "0")
  const mon = months[m[2]] ?? "01"
  return `${m[3]}-${mon}-${day}`
}

export async function seedNormalizedTables(): Promise<SeedResult[]> {
  if (!supabase) throw new Error("Supabase n'est pas configuré.")
  const results: SeedResult[] = []

  const fallbackCats = [
    { slug: "lavage", label: "Lavage", description: "Machines à laver Spinova, Lavexa, Lavexa+ et Spinova+.", image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&h=700&fit=crop&auto=format", subcategories: ["Spinova", "Lavexa", "Lavexa+", "Spinova+"] },
    { slug: "lave-vaisselle", label: "Lave-vaisselle", description: "Les solutions Estrela et Estrela S pour la vaisselle.", image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&h=700&fit=crop&auto=format", subcategories: ["Estrela", "Estrela S"] },
    { slug: "petit-electromenager", label: "Petit électroménager", description: "Pétrins et cafetières Gustiva et Florenza.", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=700&fit=crop&auto=format", subcategories: ["Pétrins", "Cafetières mono", "Cafetières multi"] },
    { slug: "chauffe-eau", label: "Chauffe-eau", description: "Cumulus et chauffe-bain en 30, 50 et 85 litres.", image: "https://images.unsplash.com/photo-1586208958839-06c17cacdf08?w=600&h=700&fit=crop&auto=format", subcategories: ["Cumulus", "Chauffe-bain"] },
    { slug: "entretien-maison", label: "Entretien de la maison", description: "Aspirateurs T-Vox, Eronex, Dustor et Liva.", image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=700&fit=crop&auto=format", subcategories: ["Professionnels", "Avec sac", "Sans sac"] },
    { slug: "fontaines", label: "Fontaines", description: "Des fontaines adaptées aux usages domestiques.", image: "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=600&h=700&fit=crop&auto=format", subcategories: ["Fontaines à eau"] },
    { slug: "cuisson", label: "Cuisson", description: "Fours, hottes, micro-ondes et cuisinières.", image: "https://images.unsplash.com/photo-1586208958839-06c17cacdf08?w=600&h=700&fit=crop&auto=format", subcategories: ["Fours encastrables", "Hottes aspirantes", "Micro-ondes"] },
    { slug: "autres", label: "Autres appareils", description: "Découvrez les appareils complémentaires AUREX.", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=700&fit=crop&auto=format", subcategories: ["Réfrigérateurs", "Climatisation"] },
  ]
  const cats = fallbackCats as Array<Record<string, unknown>>

  const catRows = cats.map((c, i) => ({
    slug: String(c.slug),
    label: String(c.label ?? c.slug),
    description: String(c.description ?? ""),
    image: String(c.image ?? ""),
    sort_order: i,
    subcategories: Array.isArray(c.subcategories) ? c.subcategories : [],
    is_active: true,
  }))

  const { error: catErr } = await supabase.from("categories").upsert(catRows, { onConflict: "slug" })
  results.push({ table: "categories", inserted: catErr ? 0 : catRows.length, error: catErr?.message })

  const prodFallback: Array<Record<string, unknown>> = [
    { id: "ex9000-wm", name: "Lave-linge EX9000 Smart", reference: "EX-WM-9000-60-SB", category: "lavage", subcategory: "Spinova+", image: fallbackCats[0].image, images: [fallbackCats[0].image], badges: ["Nouveau"], capacity: "9 kg", energyClass: "A+++", energy_class: "A+++", connectivity: true, technologies: ["EcoWash"], noiseLevel: "45 dB", noise_level: "45 dB", dimensions: { w: 60, h: 85, d: 60 }, description: "Lave-linge EX9000 Smart", features: ["15 programmes"], color: "Blanc", isNew: true, is_new: true },
    { id: "ex8000-oven", name: "Four multifonction EX8000", reference: "EX-OV-8000-70-PYR", category: "cuisson", subcategory: "Fours encastrables", image: fallbackCats[6].image, images: [fallbackCats[6].image], badges: ["Best Seller"], capacity: "70 L", energyClass: "A+", energy_class: "A+", connectivity: false, technologies: ["PyroCook"], dimensions: { w: 60, h: 60, d: 55 }, description: "Four EX8000", features: ["12 modes"], color: "Inox/Noir" },
  ]
  const prods = prodFallback as Array<Record<string, unknown>>
  const prodRows = prods.map((p) => ({
    id: String(p.id),
    name: String(p.name ?? p.id),
    reference: String(p.reference ?? p.id),
    category_slug: String((p.category as string) ?? (p.category_slug as string) ?? "lavage"),
    subcategory: (p.subcategory as string | undefined) ?? null,
    image: String(p.image ?? ""),
    images: Array.isArray(p.images) ? p.images : [],
    badges: Array.isArray(p.badges) ? p.badges : [],
    capacity: (p.capacity as string | undefined) ?? null,
    energy_class: String((p.energyClass as string) ?? (p.energy_class as string) ?? ""),
    connectivity: Boolean(p.connectivity),
    technologies: Array.isArray(p.technologies) ? p.technologies : [],
    noise_level: (p.noiseLevel as string | undefined) ?? (p.noise_level as string | undefined) ?? null,
    dimensions: (p.dimensions as unknown) ?? null,
    description: String(p.description ?? ""),
    features: Array.isArray(p.features) ? p.features : [],
    color: (p.color as string | undefined) ?? null,
    is_new: Boolean((p.isNew as boolean) ?? (p.is_new as boolean) ?? false),
    stock: Number((p.stock as number) ?? 10),
    is_active: true,
  }))
  const { error: prodErr } = await supabase.from("products").upsert(prodRows, { onConflict: "id" })
  results.push({ table: "products", inserted: prodErr ? 0 : prodRows.length, error: prodErr?.message })

  const techFallback = [
    { id: "smart-connect", name: "SmartConnect", icon: "⟳", image: fallbackCats[0].image, benefit: "Contrôle smartphone", description: "SmartConnect", category: "Connectivité", compatibleCategories: ["lavage"], compatible_categories: ["lavage"] },
    { id: "eco-wash", name: "EcoWash", icon: "◈", image: fallbackCats[0].image, benefit: "40% économies", description: "EcoWash", category: "Éco-efficacité", compatibleCategories: ["lavage"], compatible_categories: ["lavage"] },
  ]
  const techs = techFallback as Array<Record<string, unknown>>
  const techRows = techs.map((t) => ({
    id: String(t.id),
    name: String(t.name ?? t.id),
    icon: String(t.icon ?? ""),
    image: String(t.image ?? ""),
    benefit: String(t.benefit ?? ""),
    description: String(t.description ?? ""),
    category: String(t.category ?? ""),
    compatible_categories: Array.isArray(t.compatibleCategories) ? t.compatibleCategories : Array.isArray(t.compatible_categories) ? t.compatible_categories : [],
    is_active: true,
  }))
  const { error: techErr } = await supabase.from("technologies").upsert(techRows, { onConflict: "id" })
  results.push({ table: "technologies", inserted: techErr ? 0 : techRows.length, error: techErr?.message })

  const newsFallback = [
    { id: "launch-ex9000", title: "AUREX lance la série EX9000 Smart", excerpt: "Nouvelle gamme EX9000", date: "2026-08-15", published_at: "2026-08-15", category: "Lancement produit", image: fallbackCats[0].image, slug: "lancement-ex9000" },
  ]
  const news = newsFallback as Array<Record<string, unknown>>
  const newsRows = news.map((n) => ({
    id: String(n.id ?? n.slug),
    title: String(n.title ?? ""),
    excerpt: String(n.excerpt ?? ""),
    content: String((n as unknown as { content?: string }).content ?? n.excerpt ?? ""),
    published_at: toIsoDate(String((n.date as string) ?? (n.published_at as string) ?? "")) ?? new Date().toISOString().slice(0, 10),
    category: String(n.category ?? ""),
    image: String(n.image ?? ""),
    slug: String(n.slug ?? n.id),
    is_published: true,
  }))
  const { error: newsErr } = await supabase.from("news").upsert(newsRows, { onConflict: "id" })
  results.push({ table: "news", inserted: newsErr ? 0 : newsRows.length, error: newsErr?.message })

  const faqs = [{ q: "Garantie ?", a: "2 ans" }] as Array<Record<string, unknown>>
  const faqRows = faqs.map((f, i) => ({
    question: String((f.q as string) ?? (f.question as string) ?? ""),
    answer: String((f.a as string) ?? (f.answer as string) ?? ""),
    sort_order: i,
    is_active: true,
  }))
  const { count: faqCount } = await supabase.from("faq").select("id", { count: "exact", head: true })
  if ((faqCount ?? 0) === 0) {
    const { error: faqErr } = await supabase.from("faq").insert(faqRows)
    results.push({ table: "faq", inserted: faqErr ? 0 : faqRows.length, error: faqErr?.message })
  } else {
    results.push({ table: "faq", inserted: 0, error: "déjà peuplé — seed ignoré pour éviter les doublons" })
  }

  await supabase.from("site_settings").upsert({ id: "global" }, { onConflict: "id" })
  results.push({ table: "site_settings", inserted: 1 })
  await supabase.from("pages").upsert({ slug: "home", title: "Une propreté nouvelle génération.", description: "Des appareils pensés pour une maison plus simple.", content: {}, is_published: true }, { onConflict: "slug" })
  results.push({ table: "pages", inserted: 1 })

  return results
}

export interface ProfileRow {
  id: string
  full_name: string | null
  role: "admin" | "editor" | "viewer"
  created_at: string
  updated_at: string
}

export async function getCurrentProfile(): Promise<ProfileRow | null> {
  if (!supabase) return null
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) throw sessionError
  const userId = sessionData.session?.user.id
  if (!userId) return null
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle()
  if (error) throw error
  return (data as ProfileRow | null) ?? null
}

export async function loadProfiles(): Promise<ProfileRow[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at, updated_at")
    .order("created_at", { ascending: false })
  if (error) throw error
  return (data ?? []) as ProfileRow[]
}

export async function inviteProfile(email: string, fullName?: string): Promise<void> {
  if (!supabase) throw new Error("Supabase n'est pas configuré.")
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: fullName?.trim() ? { data: { full_name: fullName.trim() } } : undefined,
  })
  if (error) throw error
}

export async function requestPasswordReset(email: string): Promise<void> {
  if (!supabase) throw new Error("Supabase n'est pas configuré.")
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/admin`,
  })
  if (error) throw error
}

export async function updateProfileRole(profileId: string, role: "admin" | "editor" | "viewer"): Promise<void> {
  if (!supabase) throw new Error("Supabase n'est pas configuré.")
  const { error } = await supabase
    .from("profiles")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", profileId)
  if (error) throw error
}

export async function deleteProfile(profileId: string): Promise<void> {
  if (!supabase) throw new Error("Supabase n'est pas configuré.")
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", profileId)
  if (error) throw error
}

export type AuditLog = {
  id: string
  actor_id: string | null
  action: string
  entity: string
  entity_id: string | null
  payload: Record<string, unknown>
  created_at: string
}

export async function loadAuditLogs(limit = 50): Promise<AuditLog[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from("audit_logs")
    .select("id, actor_id, action, entity, entity_id, payload, created_at")
    .order("created_at", { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data ?? []) as AuditLog[]
}

export async function createAuditLog(action: string, entity: string, entityId?: string | null, payload: Record<string, unknown> = {}): Promise<void> {
  if (!supabase) return
  try {
    const { data: sessionData } = await supabase.auth.getSession()
    const actorId = sessionData.session?.user.id ?? null
    await supabase.from("audit_logs").insert({
      actor_id: actorId,
      action,
      entity,
      entity_id: entityId ?? null,
      payload,
    })
  } catch {
    // audit non bloquant
  }
}
