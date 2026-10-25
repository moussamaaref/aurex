import { useCallback, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { findProduct, productUrl } from "../data"
import { ml, type Localized } from "../lib/ml"
import { useP } from "../content/lang"
import { storyUi, type Story } from "../content/stories"
import Icon from "./Icon"

/** Story immersive : plein écran sur mobile, fenêtre large sur desktop.
 *  Navigation clic / toucher / clavier / boutons, progression par scènes, CTA uniquement sur la dernière scène. */
export default function StoryViewer({ story, onClose }: { story: Story; onClose: () => void }) {
  const { p } = useP()
  const scenes = (story.scenes ?? []).filter((s) => s && (s.image || s.video))
  const [index, setIndex] = useState(0)
  const closeRef = useRef<HTMLButtonElement>(null)
  const last = scenes.length - 1
  const scene = scenes[index]
  const product = story.product_id ? findProduct(story.product_id) : undefined
  const href = story.cta_href || (product ? productUrl(product) : "/produits")

  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), [])
  const next = useCallback(() => setIndex((i) => Math.min(last, i + 1)), [last])

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      else if (e.key === "ArrowRight") (document.dir === "rtl" ? prev : next)()
      else if (e.key === "ArrowLeft") (document.dir === "rtl" ? next : prev)()
      else if (e.key === "Tab") {
        // piège de focus minimal
        const nodes = document.querySelectorAll<HTMLElement>("[data-story-focus]")
        if (nodes.length === 0) return
        const first = nodes[0]
        const lastNode = nodes[nodes.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          lastNode.focus()
        } else if (!e.shiftKey && document.activeElement === lastNode) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener("keydown", onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = overflow
      previouslyFocused?.focus?.()
    }
  }, [next, prev, onClose])

  if (!scene) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ml(story.name as Localized)}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 motion-safe:animate-fade-in md:p-6"
      onClick={onClose}
    >
      <div
        className="relative flex h-full w-full flex-col overflow-hidden bg-black md:h-[min(88vh,760px)] md:max-w-5xl md:rounded-[28px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Média principal */}
        {scene.video ? (
          <video key={index} src={scene.video} poster={scene.image} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <img key={index} src={scene.image} alt={ml(scene.title as Localized)} className="absolute inset-0 h-full w-full object-cover motion-safe:animate-fade-in" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/40" />

        {/* Zones de navigation tactile : bord gauche / bord droit */}
        <button type="button" aria-label={p(storyUi.prev)} onClick={prev} disabled={index === 0} className="absolute inset-y-24 start-0 w-1/4 cursor-w-resize disabled:cursor-default rtl:cursor-e-resize" tabIndex={-1} />
        <button type="button" aria-label={p(storyUi.next)} onClick={next} disabled={index === last} className="absolute inset-y-24 end-0 w-1/4 cursor-e-resize disabled:cursor-default rtl:cursor-w-resize" tabIndex={-1} />

        {/* Progression + fermeture */}
        <div className="relative z-10 flex items-center gap-3 p-4">
          <div className="flex flex-1 gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={scenes.length} aria-valuenow={index + 1} aria-label={`${p(storyUi.scene)} ${index + 1} / ${scenes.length}`}>
            {scenes.map((_, i) => (
              <span key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= index ? "bg-white" : "bg-white/30"}`} />
            ))}
          </div>
          <button
            ref={closeRef}
            data-story-focus
            type="button"
            onClick={onClose}
            aria-label={p(storyUi.close)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25"
          >
            <Icon name="close" className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        {/* Titre court + information essentielle */}
        <div className="relative z-10 mt-auto p-6 pb-8 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">{ml(story.name as Localized)}</p>
          <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-white md:text-[40px]" style={{ fontFamily: "var(--font-display)" }}>
            {ml(scene.title as Localized)}
          </h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-white/90">{ml(scene.text as Localized)}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              data-story-focus
              type="button"
              onClick={prev}
              disabled={index === 0}
              aria-label={p(storyUi.prev)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25 disabled:opacity-30"
            >
              <Icon name="chevronLeft" className="h-5 w-5 rtl:-scale-x-100" strokeWidth={2} />
            </button>
            <button
              data-story-focus
              type="button"
              onClick={next}
              disabled={index === last}
              aria-label={p(storyUi.next)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25 disabled:opacity-30"
            >
              <Icon name="chevronRight" className="h-5 w-5 rtl:-scale-x-100" strokeWidth={2} />
            </button>
            {/* Le CTA n'apparaît qu'à la dernière scène */}
            {index === last && (
              <Link
                data-story-focus
                to={href}
                onClick={onClose}
                className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-7 text-[15px] font-semibold text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7]"
              >
                {story.cta_label ? ml(story.cta_label as Localized) : p(storyUi.cta)}
                <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" strokeWidth={2} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
