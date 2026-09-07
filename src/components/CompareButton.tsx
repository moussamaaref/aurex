import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useCompare } from "../context/CompareContext"

interface CompareButtonProps {
  productId: string
  variant?: "card" | "detail"
  navigateToCompare?: boolean
  className?: string
}

function ScaleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "w-4 h-4"}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a3 3 0 01-3-3V6a3 3 0 013-3h14a3 3 0 013 3v7a3 3 0 01-3 3h-4l-4 4v-4z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18h6" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "w-4 h-4"}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default function CompareButton({
  productId,
  variant = "card",
  navigateToCompare,
  className,
}: CompareButtonProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { add, remove, has, max, ids } = useCompare()
  const added = has(productId)
  const full = ids.length >= max && !added

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (variant === "detail") {
      if (!added && !full) add(productId)
      navigate("/comparateur")
      return
    }
    if (added) {
      remove(productId)
      return
    }
    if (full) return
    add(productId)
    if (navigateToCompare) navigate("/comparateur")
  }

  if (variant === "card") {
    const label = added ? t("comparator.added") : t("comparator.compare")
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={added}
        aria-label={
          full
            ? t("comparator.maxReached", { max })
            : added
              ? t("comparator.inCompare")
              : t("comparator.addToCompare")
        }
        title={
          full
            ? t("comparator.maxReached", { max })
            : added
              ? t("comparator.inCompare")
              : t("comparator.addToCompare")
        }
        className={`inline-flex items-center justify-center gap-1.5 text-xs font-medium rounded-lg px-3 py-2 border transition-colors font-sans ${
          className ?? ""
        } ${
          added
            ? "bg-[#0A2463] text-white border-[#0A2463]"
            : full
              ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
              : "bg-white text-[#1E5EF3] border-[#1E5EF3]/25 hover:bg-[#EFF3FB] hover:border-[#1E5EF3]/40"
        }`}
      >
        {added ? (
          <CheckIcon className="w-3.5 h-3.5" />
        ) : (
          <ScaleIcon className="w-3.5 h-3.5" />
        )}
        {label}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={added}
      title={full ? t("comparator.maxReached", { max }) : undefined}
      className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-medium transition-colors font-sans ${
        className ?? ""
      } ${
        added
          ? "bg-[#0A2463] text-white"
          : full
            ? "bg-gray-100 text-gray-300 border border-gray-100 cursor-not-allowed"
            : "border border-[#0A2463]/20 text-[#0A2463] hover:bg-[#EFF3FB]"
      }`}
    >
      {added ? <CheckIcon /> : <ScaleIcon />}
      {added ? t("comparator.goCompare") : t("productDetail.compare")}
    </button>
  )
}
