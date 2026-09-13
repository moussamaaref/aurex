export const inputBase =
  "w-full rounded-xl border border-[#E4DFD2] bg-white px-3.5 py-2.5 text-sm font-normal text-[#12233F] placeholder:text-[#9A9585] shadow-[inset_0_1px_2px_rgba(18,35,63,0.03)] transition focus:border-[#2F5FE8] focus:outline-none focus:ring-2 focus:ring-[#2F5FE8]/15 disabled:opacity-50 disabled:cursor-not-allowed"

export const cardBase =
  "rounded-2xl border border-[#E4DFD2] bg-white shadow-[0_1px_2px_rgba(18,35,63,0.04),0_16px_36px_-24px_rgba(18,35,63,0.35)]"

export const btnPrimary =
  "inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0A2342] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(10,35,66,0.2),0_10px_20px_-10px_rgba(10,35,66,0.55)] transition hover:bg-[#123163] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"

export const btnSecondary =
  "inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#E4DFD2] bg-white px-4 py-2.5 text-sm font-semibold text-[#12233F] transition hover:border-[#0A2342]/25 hover:bg-[#F7F4EC] disabled:cursor-not-allowed disabled:opacity-45"

export const btnGhostSmall =
  "rounded-lg border border-[#E4DFD2] bg-white px-3 py-1.5 text-xs font-semibold text-[#4A4438] transition hover:border-[#0A2342]/25 hover:bg-[#F7F4EC] disabled:cursor-not-allowed disabled:opacity-45"

export const btnDanger =
  "rounded-lg bg-[#FBEAEA] px-3 py-1.5 text-xs font-semibold text-[#C1443D] transition hover:bg-[#F5D8D6] disabled:cursor-not-allowed disabled:opacity-45"

export function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div>
      {eyebrow && (
        <p className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-[#B08D4F]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#B08D4F]" />
          {eyebrow}
        </p>
      )}
      <h2 className="text-xl font-semibold tracking-tight text-[#0A2342]">{title}</h2>
      {description && (
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#6B6459]">
          {description}
        </p>
      )}
    </div>
  )
}
