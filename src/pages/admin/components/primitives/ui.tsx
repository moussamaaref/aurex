export const inputBase =
  "w-full rounded-xl border border-fog bg-white px-3.5 py-2.5 text-sm font-normal text-obsidian placeholder:text-muted-gray shadow-[inset_0_1px_2px_rgba(18,35,63,0.03)] transition focus:border-signal-blue focus:outline-none focus:ring-2 focus:ring-signal-blue/15 disabled:opacity-50 disabled:cursor-not-allowed"

export const cardBase =
  "rounded-2xl border border-fog bg-white shadow-[0_1px_2px_rgba(18,35,63,0.04),0_16px_36px_-24px_rgba(18,35,63,0.35)]"

export const btnPrimary =
  "inline-flex items-center justify-center gap-1.5 rounded-xl bg-obsidian px-4 py-2.5 text-sm font-semibold text-white shadow-[0_1px_2px_color-mix(in_srgb,var(--color-shadow-navy)_20%,transparent),0_10px_20px_-10px_color-mix(in_srgb,var(--color-shadow-navy)_55%,transparent)] transition hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"

export const btnSecondary =
  "inline-flex items-center justify-center gap-1.5 rounded-xl border border-fog bg-white px-4 py-2.5 text-sm font-semibold text-obsidian transition hover:border-obsidian/25 hover:bg-studio-mist disabled:cursor-not-allowed disabled:opacity-45"

export const btnGhostSmall =
  "rounded-lg border border-fog bg-white px-3 py-1.5 text-xs font-semibold text-charcoal transition hover:border-obsidian/25 hover:bg-studio-mist disabled:cursor-not-allowed disabled:opacity-45"

export const btnDanger =
  "rounded-lg bg-danger-wash px-3 py-1.5 text-xs font-semibold text-danger transition hover:bg-danger-line disabled:cursor-not-allowed disabled:opacity-45"

export function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div>
      {eyebrow && (
        <p className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-link-deep">
          <span className="h-1.5 w-1.5 rounded-full bg-signal-blue" />
          {eyebrow}
        </p>
      )}
      <h2 className="text-xl font-semibold tracking-tight text-obsidian">{title}</h2>
      {description && (
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate">
          {description}
        </p>
      )}
    </div>
  )
}
