export type CollectionKey =
  | "products"
  | "categories"
  | "familles"
  | "sousFamilles"
  | "gammes"
  | "capacites"
  | "couleurs"
  | "technologies"
  | "news"
  | "faq"
  | "distributors"
  | "heroSlides"
  | "stats"
  | "marquee"
  | "campaign"
  | "homeSections"
  | "smartPage"
  | "techPage"
  | "newsPage"
  | "aboutPage"
  | "supportPage"

export type AdminTab =
  | "overview"
  | "collections"
  | "users"
  | "pages"
  | "site"
  | "theme"
  | "backup"
  | "history"

export type StructuredEditorProps = {
  value: unknown
  onChange: (value: unknown) => void
  fieldKey?: string
  disabled?: boolean
  /** Suggestions par clé de champ (slugs, ids technos, sous-catégories...). */
  options?: Record<string, string[]>
  /** Objet parent (pour les dropdowns dépendants : famille ← catégorie...). */
  parent?: Record<string, unknown>
  /** Libellés lisibles des options (slug → nom affiché). */
  optionLabels?: Record<string, Record<string, string>>
  /** Cartes enfant → parent par niveau taxonomique (famille, sousFamille, gamme). */
  taxonomyParents?: Record<string, Record<string, string>>
}
