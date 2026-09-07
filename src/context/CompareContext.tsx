import { createContext, useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { products } from "../data"

export const MAX_COMPARE = 4

const STORAGE_KEY = "aurex-compare-ids"

function keepSameCategory(ids: string[]): string[] {
  const unique = ids
    .filter((id) => products.some((product) => product.id === id))
    .filter((id, index, values) => values.indexOf(id) === index)
  const first = products.find((product) => product.id === unique[0])
  if (!first) return []
  return unique
    .filter((id) => products.find((product) => product.id === id)?.category === first.category)
    .slice(0, MAX_COMPARE)
}

export interface CompareToastData {
  id: number
  message: string
  actionLabel?: string
  actionHref?: string
}

interface CompareContextValue {
  ids: string[]
  max: number
  add: (id: string) => void
  remove: (id: string) => void
  clear: () => void
  has: (id: string) => boolean
  replace: (ids: string[]) => void
  toast: CompareToastData | null
  notify: (
    message: string,
    actionLabel?: string,
    actionHref?: string,
  ) => void
  dismissToast: () => void
}

const CompareContext = createContext<CompareContextValue | null>(null)

let toastSeq = 0

function loadInitial(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return keepSameCategory(parsed.filter((x) => typeof x === "string"))
      }
    }
  } catch {
    /* ignore */
  }
  return []
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()
  const [ids, setIds] = useState<string[]>(loadInitial)
  const [toast, setToast] = useState<CompareToastData | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    } catch {
      /* ignore */
    }
  }, [ids])

  const notify = (
    message: string,
    actionLabel?: string,
    actionHref?: string,
  ) => {
    setToast({ id: ++toastSeq, message, actionLabel, actionHref })
  }

  const dismissToast = () => setToast(null)

  const add = (id: string) => {
    if (ids.includes(id) || ids.length >= MAX_COMPARE) return
    const product = products.find((p) => p.id === id)
    const firstProduct = products.find((p) => p.id === ids[0])
    if (product && firstProduct && product.category !== firstProduct.category) {
      notify(t("comparator.sameCategoryOnly"))
      return
    }
    setIds([...ids, id])
    const name = product?.name ?? ""
    notify(
      t("comparator.toastAdded", { name }),
      t("comparator.toastView"),
      "/comparateur",
    )
  }

  const remove = (id: string) => {
    setIds((prev) => prev.filter((x) => x !== id))
  }

  const clear = () => setIds([])

  const has = (id: string) => ids.includes(id)

  const replace = (next: string[]) => {
    setIds(keepSameCategory(next.filter((x) => typeof x === "string")))
  }

  return (
    <CompareContext.Provider
      value={{
        ids,
        max: MAX_COMPARE,
        add,
        remove,
        clear,
        has,
        replace,
        toast,
        notify,
        dismissToast,
      }}
    >
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error("useCompare must be used within CompareProvider")
  return ctx
}