import type { L3 } from "./lang"
import { categoryContentOf } from "./categories"

/** Product Stories (Nouveautés) — séquence de 3 à 5 scènes par produit, gérée depuis le CMS (collection « stories »). */

export type SceneKind = "first-look" | "design" | "everyday" | "performance" | "explore"

export interface StoryScene {
  kind?: SceneKind
  title?: unknown
  text?: unknown
  image?: string
  video?: string
}

export interface Story {
  id: string
  /** Produit lié (id) : sert au lien « Explore the Model ». */
  product_id?: string
  name?: unknown
  /** Titre créatif court, lié à l'usage ou au bénéfice. */
  title?: unknown
  /** Badge « NEW » : géré depuis le CMS, jamais automatique. */
  is_new?: boolean
  cover?: string
  scenes?: StoryScene[]
  cta_label?: unknown
  cta_href?: string
  /** "all" | "fr" | "en" | "ar" */
  lang?: string
  published_at?: string
  is_active?: boolean
  sort_order?: number
}

export const sceneTitles: Record<SceneKind, L3> = {
  "first-look": { fr: "Le premier regard", en: "The First Look", ar: "النظرة الأولى" },
  design: { fr: "Conçu avec intention", en: "Designed with Purpose", ar: "مصمّم بغاية" },
  everyday: { fr: "Pensé pour votre quotidien", en: "Made for Your Everyday", ar: "مصمّم ليومكم" },
  performance: { fr: "La performance en détail", en: "Performance in Focus", ar: "الأداء عن قرب" },
  explore: { fr: "Découvrir le modèle", en: "Explore the Model", ar: "اكتشفوا الموديل" },
}

export const storyUi = {
  heading: { fr: "Découvrez les nouveautés.", en: "Meet What's New.", ar: "تعرّفوا على الجديد." } as L3,
  description: {
    fr: "Découvrez de plus près nos derniers appareils : ce qu'ils font, comment ils fonctionnent et ce qui les rend adaptés à votre quotidien.",
    en: "Get closer to our latest appliances. Discover what they do, how they work and what makes them right for your everyday life.",
    ar: "اقتربوا أكثر من أحدث أجهزتنا. اكتشفوا ما تفعله وكيف تعمل وما يجعلها مناسبة لحياتكم اليومية.",
  } as L3,
  new: { fr: "NEW", en: "NEW", ar: "جديد" } as L3,
  open: { fr: "Ouvrir la story", en: "Open the story", ar: "افتحوا القصة" } as L3,
  close: { fr: "Fermer", en: "Close", ar: "إغلاق" } as L3,
  prev: { fr: "Scène précédente", en: "Previous scene", ar: "المشهد السابق" } as L3,
  next: { fr: "Scène suivante", en: "Next scene", ar: "المشهد التالي" } as L3,
  scene: { fr: "Scène", en: "Scene", ar: "المشهد" } as L3,
  cta: { fr: "Découvrir le modèle", en: "Explore the Model", ar: "اكتشفوا الموديل" } as L3,
  empty: {
    fr: "Les prochaines stories arrivent bientôt.",
    en: "New stories are coming soon.",
    ar: "قصص جديدة قريبًا.",
  } as L3,
}

function firstSentence(text: string): string {
  const m = text.match(/^[^.!?]+[.!?]?/)
  return (m ? m[0] : text).trim()
}

interface ProductLike {
  id: string
  name: unknown
  reference?: string
  category: string
  image: string
  images?: string[]
  description?: unknown
  features?: unknown[]
  capacity?: unknown
  energyClass?: string
  noiseLevel?: string
  badges?: string[]
  isNew?: boolean
}

/** Stories par défaut construites uniquement à partir de données produit réelles (aucune fonction inventée). */
export function buildDefaultStories(list: ProductLike[], str: (v: unknown) => string): Story[] {
  const featured = list.filter((p) => p.isNew || p.badges?.includes("Nouveau"))
  const base = (featured.length > 0 ? featured : list).slice(0, 6)
  return base.map((p, i): Story => {
    const imgs = (p.images && p.images.length > 0 ? p.images : [p.image]).filter(Boolean)
    const cat = categoryContentOf(p.category)
    const scenes: StoryScene[] = [
      {
        kind: "first-look",
        title: sceneTitles["first-look"],
        text: cat ? cat.highlight : str(p.name),
        image: imgs[0],
      },
    ]
    const feature = (p.features ?? []).map((f) => str(f)).find(Boolean)
    if (feature) scenes.push({ kind: "design", title: sceneTitles.design, text: feature, image: imgs[1] ?? imgs[0] })
    const desc = firstSentence(str(p.description))
    if (desc) scenes.push({ kind: "everyday", title: sceneTitles.everyday, text: desc, image: imgs[2] ?? imgs[0] })
    const perf = [str(p.capacity), p.energyClass ? `Classe ${p.energyClass}` : "", p.noiseLevel ?? ""].filter(Boolean).join(" · ")
    if (perf) scenes.push({ kind: "performance", title: sceneTitles.performance, text: perf, image: imgs[0] })
    scenes.push({
      kind: "explore",
      title: sceneTitles.explore,
      text: `${str(p.name)}${p.reference ? ` — ${p.reference}` : ""}`,
      image: imgs[0],
    })
    return {
      id: `story-${p.id}`,
      product_id: p.id,
      name: p.name,
      title: cat ? cat.highlight : p.name,
      is_new: Boolean(p.isNew || p.badges?.includes("Nouveau")),
      cover: p.image,
      scenes,
      lang: "all",
      is_active: true,
      sort_order: i,
    }
  })
}
