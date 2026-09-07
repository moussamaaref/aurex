import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useCompare } from "../context/CompareContext"
import { useTranslation } from "react-i18next"

export default function CompareToast() {
  const { t } = useTranslation()
  const { toast, dismissToast } = useCompare()

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => dismissToast(), 3500)
    return () => window.clearTimeout(id)
  }, [toast, dismissToast])

  if (!toast) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 inset-x-4 sm:inset-x-auto sm:right-6 sm:left-auto z-[70] no-print"
    >
      <div className="sm:max-w-sm bg-[#0A2463] text-white rounded-xl shadow-2xl px-4 py-3 flex items-center gap-3">
        <svg
          className="w-5 h-5 text-emerald-400 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <p className="flex-1 text-sm leading-snug font-sans">{toast.message}</p>
        {toast.actionHref && toast.actionLabel && (
          <Link
            to={toast.actionHref}
            onClick={dismissToast}
            className="flex-shrink-0 text-xs font-semibold text-[#8FB8FF] hover:text-white underline underline-offset-2 font-sans"
          >
            {toast.actionLabel}
          </Link>
        )}
        <button
          type="button"
          onClick={dismissToast}
          aria-label={t("comparator.dismissToast")}
          className="flex-shrink-0 p-0.5 text-gray-300 hover:text-white transition-colors rounded"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}