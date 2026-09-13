export type CollectionKey =
  | "products"
  | "categories"
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
}
