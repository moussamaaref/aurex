import { useRef, useState } from "react"
import { GALLERY_KEYS, IMAGE_KEYS, WIDE_FIELD_KEYS, fieldLabels, pageFieldLabels } from "../../constants"
import { uploadToAurexMedia } from "../../services/media"
import { isLocalized, mlFr, toLocalized } from "../../../../lib/ml"
import { inputBase } from "../primitives/ui"
import type { StructuredEditorProps } from "../../types"

// Valeurs fermées : rendues en liste déroulante plutôt qu'en champ libre.
const ENUM_OPTIONS: Record<string, string[]> = {
  energy_class: ["A+++", "A++", "A+", "A", "B", "C", "D"],
  energyClass: ["A+++", "A++", "A+", "A", "B", "C", "D"],
}

const BADGE_OPTIONS = ["Nouveau", "Promotion", "Best Seller", "Exclusivité"]

export function getFieldLabel(key: string): string {
  return fieldLabels[key] ?? pageFieldLabels[key] ?? key
}

// Clés techniques (jamais traduites) : ids, slugs (dont category produit, clé de routage/filtre), urls, codes, dates, contacts, coordonnées.
const SINGLE_KEYS = new Set([
  "id",
  "slug",
  "category",
  "reference",
  "icon",
  "email",
  "phone",
  "href",
  "ctaHref",
  "ctaSecHref",
  "darkHref",
  "lightHref",
  "published_at",
  "created_at",
  "updated_at",
  "latitude",
  "longitude",
  "role",
  "action",
  "entity",
  "entity_id",
  "actor_id",
])

// Tableaux de valeurs techniques (pas de texte) : URLs d'images, ids technos, slugs.
const SINGLE_ARRAYS = new Set(["images", "gallery", "technologies", "compatibleCategories", "compatible_categories"])

export function TrilingualInput({
  value,
  onChange,
  disabled,
  suggestions,
}: {
  value: unknown
  onChange: (next: { fr: string; ar: string; en: string }) => void
  disabled?: boolean
  suggestions?: string[]
}) {
  const loc = toLocalized(value)
  return (
    <div className="space-y-2">
      {(["fr", "ar", "en"] as const).map((lang) => (
        <div key={lang} className="flex items-start gap-2">
          <span className="mt-2 w-7 shrink-0 rounded-md bg-[#0A2342] px-1 py-0.5 text-center text-[10px] font-bold uppercase text-white">
            {lang}
          </span>
          <textarea
            value={loc[lang]}
            onChange={(e) => onChange({ ...loc, [lang]: e.target.value })}
            rows={2}
            dir={lang === "ar" ? "rtl" : "ltr"}
            placeholder={lang === "fr" ? "Français" : lang === "ar" ? "Arabe" : "Anglais"}
            disabled={disabled}
            className="min-h-[52px] w-full rounded-xl border border-[#E4DFD2] bg-white px-3 py-2 text-sm text-[#1A1A1A] placeholder:text-[#A8A4A0] focus:border-[#2F5FE8] focus:outline-none focus:ring-2 focus:ring-[#2F5FE8]/10 disabled:opacity-50"
          />
        </div>
      ))}
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pl-9">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              disabled={disabled}
              onClick={() => onChange({ ...loc, fr: s })}
              title={`Utiliser « ${s} »`}
              className="rounded-lg border border-[#E4DFD2] bg-white px-2 py-1 text-[11px] font-semibold text-[#4A4438] transition hover:border-[#2F5FE8] hover:text-[#2F5FE8] disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Presets proposés dans le sélecteur de couleur des catégories
export const CATEGORY_PRESETS = [
  "#057593",
  "#7C3AED",
  "#8B5E3C",
  "#EA580C",
  "#0C0042",
  "#06B6D4",
  "#E82E25",
  "#475569",
]

export function SingleImageField({
  value,
  onChange,
  disabled,
}: {
  value: string
  onChange: (next: string) => void
  disabled?: boolean
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    setError("")
    try {
      const url = await uploadToAurexMedia(file)
      onChange(url)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload échoué")
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... ou uploader"
          disabled={disabled}
          className={`min-w-0 flex-1 ${inputBase}`}
        />
        <button
          type="button"
          disabled={disabled || busy}
          onClick={() => inputRef.current?.click()}
          className="rounded-lg border border-[#E4DFD2] bg-white px-3 py-1.5 text-xs font-semibold text-[#4A4438] transition hover:border-[#0A2342]/25 hover:bg-[#F7F4EC] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {busy ? "..." : "Uploader"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => void handleFile(e.target.files?.[0])}
        />
      </div>
      {error && (
        <p role="alert" className="rounded-lg bg-[#FBEAEA] px-3 py-2 text-xs font-medium text-[#C1443D]">
          {error}
        </p>
      )}
      {value ? (
        <div className="overflow-hidden rounded-xl border border-[#E4DFD2] bg-white">
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img
            src={value}
            alt="preview"
            className="h-32 w-full object-cover"
            onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
          />
          <div className="truncate bg-[#F7F4EC] px-3 py-1.5 text-[11px] text-[#8A8474]">
            {value}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#D9D2BF] bg-[#F7F4EC] px-3 py-6 text-center text-xs text-[#9A9585]">
          Aucune image
        </div>
      )}
    </div>
  )
}

export function ImagesGalleryField({
  value,
  onChange,
  disabled,
}: {
  value: string[]
  onChange: (next: string[]) => void
  disabled?: boolean
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setBusy(true)
    setError("")
    try {
      const urls: string[] = []
      for (const f of Array.from(files)) {
        const url = await uploadToAurexMedia(f)
        urls.push(url)
      }
      onChange([...(value ?? []), ...urls])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload échoué")
    } finally {
      setBusy(false)
    }
  }
  const move = (idx: number, dir: -1 | 1) => {
    const next = [...value]
    const j = idx + dir
    if (j < 0 || j >= next.length) return
    const tmp = next[idx]
    next[idx] = next[j]
    next[j] = tmp
    onChange(next)
  }
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={disabled || busy}
          onClick={() => inputRef.current?.click()}
          className="rounded-xl border border-dashed border-[#2F5FE8]/50 bg-[#2F5FE8]/5 px-3.5 py-2 text-xs font-semibold text-[#2F5FE8] transition hover:bg-[#2F5FE8]/10 disabled:opacity-50"
        >
          {busy ? "Upload..." : "+ Ajouter des images"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => void handleFiles(e.target.files)}
        />
        <span className="text-xs text-[#9A9585]">{value.length} image(s)</span>
      </div>
      {error && (
        <p role="alert" className="rounded-lg bg-[#FBEAEA] px-3 py-2 text-xs font-medium text-[#C1443D]">
          {error}
        </p>
      )}
      {value.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#D9D2BF] bg-[#F7F4EC] px-3 py-6 text-center text-xs text-[#9A9585]">
          Galerie vide — ajoutez des images
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {value.map((url, i) => (
            <div
              key={`${url}-${i}`}
              className="overflow-hidden rounded-xl border border-[#E4DFD2] bg-white"
            >
              <img src={url} alt={`galerie ${i + 1}`} className="h-32 w-full object-cover" />
              <div className="space-y-2 p-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) =>
                    onChange(value.map((v, idx) => (idx === i ? e.target.value : v)))
                  }
                  disabled={disabled}
                  className="w-full truncate rounded-lg border border-[#E4DFD2] px-2 py-1 text-[11px]"
                />
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => move(i, -1)}
                    className="rounded-lg border border-[#E4DFD2] px-2 py-1 text-[11px] hover:bg-[#F7F4EC]"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => move(i, 1)}
                    className="rounded-lg border border-[#E4DFD2] px-2 py-1 text-[11px] hover:bg-[#F7F4EC]"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                    className="ml-auto rounded-lg bg-[#FBEAEA] px-2 py-1 text-[11px] font-semibold text-[#C1443D] hover:bg-[#F5D8D6]"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function StructuredEditor({ value, onChange, fieldKey, disabled, options }: StructuredEditorProps) {
  // Gallery
  if (fieldKey && GALLERY_KEYS.has(fieldKey) && Array.isArray(value)) {
    return (
      <ImagesGalleryField
        value={value as string[]}
        onChange={onChange as (v: string[]) => void}
        disabled={disabled}
      />
    )
  }
  // Single image
  if (
    fieldKey &&
    IMAGE_KEYS.has(fieldKey) &&
    (typeof value === "string" || value === null)
  ) {
    return (
      <SingleImageField
        value={(value as string) ?? ""}
        onChange={onChange as (v: string) => void}
        disabled={disabled}
      />
    )
  }

  // Sélecteur de couleur (prioritaire) : valeur vide ou hex (#RRGGBB).
  // Les couleurs textuelles ("Blanc", "Inox") tombent dans l'éditeur trilingue ci-dessous.
  if (
    fieldKey === "color" &&
    typeof value === "string" &&
    (value === "" || /^#[0-9a-fA-F]{6}$/.test(value))
  ) {
    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="color"
            value={value || "#057593"}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="h-10 w-14 cursor-pointer rounded-lg border border-[#E4DFD2] bg-white p-1 disabled:opacity-50"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#057593"
            disabled={disabled}
            className={`min-w-0 flex-1 uppercase ${inputBase}`}
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={disabled}
              onClick={() => onChange(preset)}
              title={preset}
              aria-label={`Couleur ${preset}`}
              className={`h-7 w-7 rounded-lg border-2 transition hover:scale-110 ${
                value.toLowerCase() === preset.toLowerCase()
                  ? "border-[#0A2342] shadow-md"
                  : "border-white shadow-sm"
              } disabled:opacity-50`}
              style={{ backgroundColor: preset }}
            />
          ))}
        </div>
      </div>
    )
  }

  // Valeurs fermées : liste déroulante (ex. classe énergétique)
  if (fieldKey && ENUM_OPTIONS[fieldKey] && typeof value === "string") {
    const opts = ENUM_OPTIONS[fieldKey]
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={inputBase}
      >
        <option value="">— Choisir —</option>
        {!opts.includes(value) && value !== "" && <option value={value}>{value} (actuel)</option>}
        {opts.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    )
  }

  // Date de publication : sélecteur natif
  if (fieldKey === "published_at" && typeof value === "string") {
    return (
      <input
        type="date"
        value={value.slice(0, 10)}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={inputBase}
      />
    )
  }

  // Badges : cases à cocher (valeurs fermées, migration des objets localisés)
  if (fieldKey === "badges" && Array.isArray(value)) {
    const active = new Set(value.map((v) => mlFr(v as string | { fr?: string; ar?: string; en?: string })))
    const toggle = (badge: string) => {
      const next = active.has(badge)
        ? value.filter((v) => mlFr(v as string | { fr?: string; ar?: string; en?: string }) !== badge)
        : [...value, badge]
      onChange(next)
    }
    return (
      <div className="flex flex-wrap gap-2">
        {BADGE_OPTIONS.map((badge) => {
          const on = active.has(badge)
          return (
            <label
              key={badge}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                on
                  ? "border-[#0A2342] bg-[#0A2342] text-white"
                  : "border-[#E4DFD2] bg-white text-[#4A4438] hover:border-[#0A2342]/40"
              } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <input
                type="checkbox"
                checked={on}
                disabled={disabled}
                onChange={() => toggle(badge)}
                className="h-3.5 w-3.5 accent-[#0A2342]"
              />
              {badge}
            </label>
          )
        })}
      </div>
    )
  }

  // Slug catégorie : liste déroulante stricte (relation). Repli champ libre si vide.
  if (fieldKey === "category_slug" && typeof value === "string") {
    const slugs = options?.category_slug ?? []
    if (slugs.length === 0) {
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="slug-categorie"
          disabled={disabled}
          className={inputBase}
        />
      )
    }
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={inputBase}
      >
        <option value="">— Choisir une catégorie —</option>
        {!slugs.includes(value) && value !== "" && <option value={value}>{value} (actuel)</option>}
        {slugs.map((slug) => (
          <option key={slug} value={slug}>
            {slug}
          </option>
        ))}
      </select>
    )
  }

  // Champ technique avec suggestions (ex. icônes) — les champs traduisibles
  // gardent l'éditeur trilingue (avec ses propres suggestions FR)
  if (
    fieldKey &&
    SINGLE_KEYS.has(fieldKey) &&
    typeof value === "string" &&
    (options?.[fieldKey]?.length ?? 0) > 0
  ) {
    const suggestions = options?.[fieldKey] ?? []
    return (
      <div className="space-y-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={inputBase}
        />
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              disabled={disabled}
              onClick={() => onChange(s)}
              title={`Utiliser « ${s} »`}
              className="rounded-lg border border-[#E4DFD2] bg-white px-2 py-1 text-[11px] font-semibold text-[#4A4438] transition hover:border-[#2F5FE8] hover:text-[#2F5FE8] disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Champ texte traduisible (chaîne legacy ou objet {fr,ar,en})
  if (
    fieldKey &&
    !SINGLE_KEYS.has(fieldKey) &&
    (typeof value === "string" || isLocalized(value))
  ) {
    return (
      <TrilingualInput
        value={value}
        onChange={onChange as (v: { fr: string; ar: string; en: string }) => void}
        disabled={disabled}
        suggestions={options?.[fieldKey]}
      />
    )
  }

  if (Array.isArray(value)) {
    // Liste de textes traduisibles (features, badges, sous-catégories...) : un éditeur trilingue par élément
    if (
      fieldKey &&
      !SINGLE_ARRAYS.has(fieldKey) &&
      value.every((item) => typeof item === "string" || isLocalized(item))
    ) {
      return (
        <div className="space-y-3">
          {value.map((item, index) => (
            <div key={index} className="rounded-xl border border-[#E4DFD2] bg-[#F7F4EC] p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold text-[#8A8474]">Élément {index + 1}</p>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}
                    className="text-xs font-semibold text-[#C1443D] hover:text-[#A6362F]"
                  >
                    Supprimer
                  </button>
                )}
              </div>
              <TrilingualInput
                value={item}
                onChange={(next) =>
                  onChange(value.map((entry, itemIndex) => (itemIndex === index ? next : entry)))
                }
                disabled={disabled}
                suggestions={fieldKey ? options?.[fieldKey] : undefined}
              />
            </div>
          ))}
          {!disabled && (
            <button
              type="button"
              onClick={() => onChange([...value, { fr: "", ar: "", en: "" }])}
              className="rounded-xl border border-dashed border-[#2F5FE8]/50 px-3.5 py-2 text-xs font-semibold text-[#2F5FE8] hover:bg-[#2F5FE8]/5"
            >
              Ajouter une valeur
            </button>
          )}
        </div>
      )
    }
    return (
      <div className="space-y-3">
        {value.map((item, index) => {
          const record = item as Record<string, unknown> | null
          const stable =
            typeof item === "string"
              ? item
              : record && typeof record === "object"
                ? [record.id, record.slug, record.reference].find((v) => typeof v === "string" && v)
                : ""
          return (
          <div
            key={stable ? `${stable}-${index}` : index}
            className="rounded-xl border border-[#E4DFD2] bg-[#F7F4EC] p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold text-[#8A8474]">
                Élément {index + 1}
              </p>
              {!disabled && (
                <button
                  type="button"
                  onClick={() =>
                    onChange(value.filter((_entry, itemIndex) => itemIndex !== index))
                  }
                  className="text-xs font-semibold text-[#C1443D] hover:text-[#A6362F]"
                >
                  Supprimer
                </button>
              )}
            </div>
            <StructuredEditor
              value={item}
              onChange={(next) =>
                onChange(
                  value.map((entry, itemIndex) =>
                    itemIndex === index ? next : entry,
                  ),
                )
              }
              disabled={disabled}
              options={options}
            />
          </div>
          )
        })}
        {!disabled && (
          <button
            type="button"
            onClick={() => onChange([...value, ""])}
            className="rounded-xl border border-dashed border-[#2F5FE8]/50 px-3.5 py-2 text-xs font-semibold text-[#2F5FE8] hover:bg-[#2F5FE8]/5"
          >
            Ajouter une valeur
          </button>
        )}
      </div>
    )
  }

  if (value !== null && typeof value === "object") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(value as Record<string, unknown>).map(([key, entry]) => {
          const isWide = WIDE_FIELD_KEYS.has(key)
          const isNestedObject =
            entry !== null && typeof entry === "object" && !Array.isArray(entry)
          const isArrayField = Array.isArray(entry)
          // Les objets imbriqués (dimensions) et les galeries occupent toute la largeur
          const spanWide = isWide || isNestedObject || (isArrayField && entry.length > 0)
          return (
            <div
              key={key}
              className={spanWide ? "sm:col-span-2" : "sm:col-span-1"}
            >
              <span className="mb-1.5 block text-xs font-semibold text-[#4A4438]">
                {getFieldLabel(key)}
              </span>
              <StructuredEditor
                value={entry}
                onChange={(next) =>
                  onChange({
                    ...(value as Record<string, unknown>),
                    [key]: next,
                  })
                }
                fieldKey={key}
                disabled={disabled}
                options={options}
              />
            </div>
          )
        })}
      </div>
    )
  }

  if (typeof value === "boolean") {
    return (
      <select
        value={String(value)}
        onChange={(event) => onChange(event.target.value === "true")}
        disabled={disabled}
        className={inputBase}
      >
        <option value="true">Oui</option>
        <option value="false">Non</option>
      </select>
    )
  }

  return (
    <input
      type={typeof value === "number" ? "number" : "text"}
      value={value == null ? "" : String(value)}
      onChange={(event) =>
        onChange(
          typeof value === "number" ? Number(event.target.value) : event.target.value,
        )
      }
      disabled={disabled}
      className={inputBase}
    />
  )
}
