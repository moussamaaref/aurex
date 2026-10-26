import { useRef } from "react"
import { Link } from "react-router-dom"
import { categoryLabelOf, productCapacites, productUrl, type Product } from "../data"
import { ml } from "../lib/ml"
import { useP } from "../content/lang"
import Icon from "./Icon"

const MAX_TILT = 6 // degrés : inclinaison volontairement discrète

/** Caractéristiques vérifiées (2 à 3) tirées de la fiche produit, sans prix. */
function keySpecs(product: Product): string[] {
  const specs: string[] = []
  const caps = productCapacites(product)
  if (caps[0]) specs.push(ml(caps[0].label))
  else if (product.capacity) specs.push(ml(product.capacity))
  if (product.energyClass) specs.push(`Classe ${product.energyClass}`)
  if (product.noiseLevel) specs.push(product.noiseLevel)
  if (product.connectivity) specs.push("Wi-Fi · Bluetooth")
  if (specs.length < 2 && product.color) specs.push(ml(product.color))
  return specs.slice(0, 3)
}

/** Carte produit du Product Line-Up 2026 : tilt 3D réactif au curseur sur toute la carte. */
export default function LineUpCard({ product, cta }: { product: Product; cta: string }) {
  const { lang } = useP()
  const ref = useRef<HTMLAnchorElement>(null)
  const specs = keySpecs(product)

  const onMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current
    if (!el || event.pointerType !== "mouse") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const r = el.getBoundingClientRect()
    const x = (event.clientX - r.left) / r.width - 0.5
    const y = (event.clientY - r.top) / r.height - 0.5
    el.style.transition = "box-shadow 300ms ease-out"
    el.style.transform = `perspective(900px) rotateX(${(-y * MAX_TILT).toFixed(2)}deg) rotateY(${(x * MAX_TILT).toFixed(2)}deg) translateY(-6px)`
    el.style.boxShadow = "0 22px 44px rgba(29,29,31,0.10)"
  }
  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transition = ""
    el.style.transform = ""
    el.style.boxShadow = ""
  }

  return (
    <Link
      ref={ref}
      to={productUrl(product)}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onBlur={onLeave}
      aria-label={`${ml(product.name)} — ${cta}`}
      className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-white transition-[transform,box-shadow] duration-300 ease-out motion-reduce:transition-none"
      style={{ border: "1px solid #e6e6e8" }}
      data-lang={lang}
    >
      <div className="aspect-[4/5] overflow-hidden bg-[#f5f5f7]">
        <img
          loading="lazy"
          decoding="async"
          src={product.image}
          alt={ml(product.name)}
          width={600}
          height={750}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0077b3]">{categoryLabelOf(product.category)}</p>
        <h3 className="mt-2 text-[19px] font-semibold leading-snug text-[#1d1d1f]" style={{ fontFamily: "var(--font-display)" }}>
          {ml(product.name)}
        </h3>
        {product.reference && <p className="mt-1 font-mono text-xs text-[#5a5a5e]">{product.reference}</p>}
        {specs.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {specs.map((spec) => (
              <li key={spec} className="rounded-full bg-[#f5f5f7] px-3 py-1 text-xs font-medium text-[#333336]">
                {spec}
              </li>
            ))}
          </ul>
        )}
        <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 text-[15px] font-semibold text-[#0077b3] transition-colors group-hover:text-[#00628f] group-focus-visible:underline group-active:opacity-80">
          {cta}
          <Icon name="arrow" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" strokeWidth={2} />
        </span>
      </div>
    </Link>
  )
}
