import { heroSlides, heroUi, lineUp, why, categoriesSection, sav, promo } from "./home"
import { about } from "./about"
import { support } from "./support"
import { smartTech } from "./smartTech"
import { news } from "./news"
import { storyUi, sceneTitles } from "./stories"
import { navLabels, navDetails, productsSide, megaLabels } from "./nav"
import { footerContent, newsletterContent } from "./footer"
import { categoryContent } from "./categories"
import { productsUi, specUi } from "./products"
import { seoByRoute } from "./seo"

/* =====================================================================
   Registre du contenu éditorial.
   Tout texte trilingue ({fr,en,ar}) et toute image / lien du site vit dans src/content ;
   ce registre le rend éditable depuis /admin (onglet « Contenu du site »).
   Les modifications sont stockées comme « surcharges » (collection `siteContent`)
   et appliquées sur les objets en place au démarrage de l'application.
   ===================================================================== */

export type Lang3 = "fr" | "en" | "ar"
const LANGS: Lang3[] = ["fr", "en", "ar"]

export interface GroupDef {
  id: string
  label: string
  roots: Record<string, { label: string; value: unknown }>
}

export const GROUPS: GroupDef[] = [
  {
    id: "home",
    label: "Accueil",
    roots: {
      heroSlides: { label: "Hero — diapositives", value: heroSlides },
      heroUi: { label: "Hero — commandes", value: heroUi },
      lineUp: { label: "Product Line-Up 2026", value: lineUp },
      why: { label: "Pourquoi AUREX ?", value: why },
      categoriesSection: { label: "Nos catégories — titres", value: categoriesSection },
      sav: { label: "Service après-vente", value: sav },
      promo: { label: "Offres & highlights", value: promo },
    },
  },
  { id: "about", label: "À propos", roots: { about: { label: "Page À propos", value: about } } },
  { id: "support", label: "Support & SAV", roots: { support: { label: "Page Support", value: support } } },
  { id: "smart", label: "Smart Tech", roots: { smartTech: { label: "Smart Tech", value: smartTech } } },
  {
    id: "news",
    label: "Nouveautés & Stories",
    roots: {
      news: { label: "Page Nouveautés", value: news },
      storyUi: { label: "Stories — interface", value: storyUi },
      sceneTitles: { label: "Stories — titres des scènes", value: sceneTitles },
    },
  },
  {
    id: "categories",
    label: "Catégories",
    roots: { categoryContent: { label: "Les 5 catégories", value: categoryContent } },
  },
  {
    id: "nav",
    label: "Navigation",
    roots: {
      navLabels: { label: "Menu — libellés", value: navLabels },
      navDetails: { label: "Menu — volets", value: navDetails },
      productsSide: { label: "Menu Produits — colonne latérale", value: productsSide },
      megaLabels: { label: "Menu Produits — titres", value: megaLabels },
    },
  },
  {
    id: "footer",
    label: "Pied de page & newsletter",
    roots: {
      footerContent: { label: "Pied de page", value: footerContent },
      newsletterContent: { label: "Newsletter", value: newsletterContent },
    },
  },
  {
    id: "products",
    label: "Produits (filtres & fiche)",
    roots: {
      productsUi: { label: "Filtres produits", value: productsUi },
      specUi: { label: "Fiche produit", value: specUi },
    },
  },
  { id: "seo", label: "SEO par page", roots: { seoByRoute: { label: "Titres & descriptions", value: seoByRoute } } },
]

/** Clés texte non traduisibles mais éditables (images, liens). */
const STRING_KEYS = new Set(["image", "cover", "href", "ctaHref"])

export type LeafKind = "l3" | "l3list" | "string"

export interface Leaf {
  /** Identifiant stable : groupe:racine.chemin */
  id: string
  group: string
  root: string
  /** Chemin lisible sans la racine (ex. 0.title) */
  path: string
  kind: LeafKind
  ref: Record<string, unknown>
  key?: string
  /** Valeur d'origine (code) */
  defaults: Record<Lang3, string | string[]> | string
}

type L3Like = Record<Lang3, string | string[]>
const isL3 = (v: unknown): v is L3Like =>
  !!v &&
  typeof v === "object" &&
  !Array.isArray(v) &&
  LANGS.every((l) => l in (v as object) && (typeof (v as L3Like)[l] === "string" || Array.isArray((v as L3Like)[l])))

let cache: Leaf[] | null = null

/** Parcourt tous les contenus ; capture les valeurs d'origine à la première exécution. */
export function getLeaves(): Leaf[] {
  if (cache) return cache
  const out: Leaf[] = []
  const seen = new WeakSet<object>()

  const walk = (node: unknown, group: string, root: string, path: string) => {
    if (!node || typeof node !== "object") return
    if (seen.has(node as object)) return
    if (isL3(node)) {
      seen.add(node)
      const isList = Array.isArray(node.fr)
      out.push({
        id: `${group}:${root}${path ? "." + path : ""}`,
        group,
        root,
        path,
        kind: isList ? "l3list" : "l3",
        ref: node as unknown as Record<string, unknown>,
        defaults: {
          fr: isList ? [...(node.fr as string[])] : (node.fr as string),
          en: isList ? [...(node.en as string[])] : (node.en as string),
          ar: isList ? [...(node.ar as string[])] : (node.ar as string),
        },
      })
      return
    }
    seen.add(node as object)
    if (Array.isArray(node)) {
      node.forEach((item, i) => walk(item, group, root, path ? `${path}.${i}` : String(i)))
      return
    }
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      const sub = path ? `${path}.${k}` : k
      if (typeof v === "string" && STRING_KEYS.has(k)) {
        out.push({
          id: `${group}:${root}.${sub}`,
          group,
          root,
          path: sub,
          kind: "string",
          ref: node as Record<string, unknown>,
          key: k,
          defaults: v,
        })
      } else walk(v, group, root, sub)
    }
  }

  for (const g of GROUPS) for (const [root, def] of Object.entries(g.roots)) walk(def.value, g.id, root, "")
  cache = out
  return out
}

export type Overrides = Record<string, Partial<Record<Lang3, string | string[]>> | string>

/** Applique les surcharges (et restaure les valeurs d'origine pour les champs non surchargés). */
export function applyOverrides(overrides: Overrides) {
  for (const leaf of getLeaves()) {
    const ov = overrides[leaf.id]
    if (leaf.kind === "string") {
      leaf.ref[leaf.key as string] = typeof ov === "string" && ov !== "" ? ov : (leaf.defaults as string)
      continue
    }
    const defaults = leaf.defaults as Record<Lang3, string | string[]>
    for (const l of LANGS) {
      const v = ov && typeof ov === "object" ? ov[l] : undefined
      const usable = Array.isArray(v) ? v.length > 0 : typeof v === "string" && v !== ""
      leaf.ref[l] = usable ? v : Array.isArray(defaults[l]) ? [...(defaults[l] as string[])] : defaults[l]
    }
  }
}

const STORAGE_KEY = "aurex-data-siteContent"

export function readStoredOverrides(): Overrides {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    const first = Array.isArray(parsed) ? parsed[0] : parsed
    const ov = (first as { overrides?: Overrides } | undefined)?.overrides
    return ov && typeof ov === "object" ? ov : {}
  } catch {
    return {}
  }
}

export function storeOverrides(overrides: Overrides) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ id: "site-content", overrides }]))
  } catch {
    // stockage indisponible
  }
}

/** Libellés lisibles pour l'admin. */
const KEY_LABELS: Record<string, string> = {
  title: "Titre",
  subtitle: "Sous-titre",
  text: "Texte",
  cta: "Bouton",
  cta1: "Bouton 1",
  cta2: "Bouton 2",
  label: "Libellé",
  badge: "Badge",
  tag: "Étiquette",
  headline: "Accroche",
  eyebrow: "Surtitre",
  image: "Image (URL)",
  cover: "Image de couverture (URL)",
  href: "Lien",
  ctaHref: "Lien du bouton",
  primary: "Bouton principal",
  secondary: "Bouton secondaire",
  name: "Nom",
  highlight: "Accroche marketing",
  objective: "Objectif de communication",
  range: "Gamme (une ligne par produit)",
  description: "Description",
  q: "Question",
  a: "Réponse",
  intro: "Introduction",
  heading: "Intitulé de section",
  paragraphs: "Paragraphe",
  imageAlt: "Texte alternatif de l'image",
  placeholder: "Texte du champ",
  signature: "Signature",
  principle: "Principe",
  detailsTitle: "Détails — titre",
  detailsText: "Détails — texte",
  seeAll: "Lien « tout voir »",
  cardCta: "Bouton des cartes",
  subtitleShort: "Sous-titre court",
  successTitle: "Confirmation — titre",
  successText: "Confirmation — texte",
  invalid: "Erreur — saisie invalide",
  error: "Erreur — envoi",
  referenceLabel: "Libellé du numéro de référence",
  nextStep: "Étape suivante",
  localNote: "Note mode aperçu",
  none: "Texte « aucun résultat »",
  noResult: "Texte « aucun résultat »",
  num: "Numéro",
  lead: "Début du titre",
  tail: "Fin du titre",
  brand: "Marque",
  phone: "Téléphone",
  email: "E-mail",
  address: "Adresse",
  submit: "Bouton d'envoi",
  sending: "Texte d'envoi",
  required: "Erreur — champs obligatoires",
  select: "Option « Sélectionner »",
  open: "Bouton d'ouverture",
  all: "Libellé « tous »",
  pause: "Pause",
  play: "Lecture",
}

export function fieldLabel(leaf: Leaf): string {
  const parts = leaf.path.split(".").filter(Boolean)
  const readable = parts.map((p) => (/^\d+$/.test(p) ? `#${Number(p) + 1}` : (KEY_LABELS[p] ?? p)))
  return readable.length > 0 ? readable.join(" › ") : leaf.root
}

/** Section d'affichage : racine + premier segment (ex. « Hero — diapositives · #2 »). */
export function sectionOf(leaf: Leaf): string {
  const g = GROUPS.find((x) => x.id === leaf.group)
  const rootLabel = g?.roots[leaf.root]?.label ?? leaf.root
  const first = leaf.path.split(".")[0]
  if (!first) return rootLabel
  if (/^\d+$/.test(first)) return `${rootLabel} · #${Number(first) + 1}`
  const second = leaf.path.split(".")[1]
  return /^\d+$/.test(second ?? "") ? `${rootLabel} · ${KEY_LABELS[first] ?? first} #${Number(second) + 1}` : `${rootLabel} · ${KEY_LABELS[first] ?? first}`
}
