import { useEffect, useRef, useState, type ReactNode } from "react"

export type RevealVariant = "up" | "fade" | "scale" | "left" | "right"

const HIDDEN_TRANSFORM: Record<RevealVariant, string> = {
  up: "translateY(28px)",
  fade: "none",
  scale: "scale(0.96)",
  left: "translateX(-32px)",
  right: "translateX(32px)",
}

/* ── Révélation douce au défilement (une seule fois, respect de reduced-motion) ── */
export default function Reveal({
  children,
  variant = "up",
  delay = 0,
  threshold = 0.12,
  className = "",
}: {
  children: ReactNode
  variant?: RevealVariant
  /** Décalage en ms (stagger : index * 60 typiquement, plafonné par l'appelant). */
  delay?: number
  threshold?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true)
      return
    }
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  // Animation terminée : plus de will-change (ni de transition) sur le conteneur.
  useEffect(() => {
    if (!visible) return
    const timer = window.setTimeout(() => setSettled(true), 700 + delay + 60)
    return () => window.clearTimeout(timer)
  }, [visible, delay])

  return (
    <div
      ref={ref}
      className={`${settled ? "" : "transition-[opacity,transform] duration-700 ease-out"} ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : HIDDEN_TRANSFORM[variant],
        transitionDelay: settled ? undefined : `${delay}ms`,
        willChange: settled ? "auto" : "transform, opacity",
      }}
    >
      {children}
    </div>
  )
}
