import { Link } from "react-router-dom"
import { products } from "../data"
import { ml } from "../lib/ml"
import { useP } from "../content/lang"
import { smartTech } from "../content/smartTech"
import Reveal from "./Reveal"
import Icon from "./Icon"

/** Smart Tech : un vrai appareil de la gamme compatible connectivité + téléphone intégré naturellement.
 *  Aucun élément d'interface inventé : seuls le nom, la référence et l'état de connexion sont affichés. */
export default function SmartTechSection() {
  const { p } = useP()
  const device = products.find((x) => x.connectivity) ?? products[0]

  return (
    <div className="mx-auto max-w-7xl px-6">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0077b3]">{p(smartTech.label)}</p>
          <h2 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-[#1d1d1f] lg:text-[40px]" style={{ fontFamily: "var(--font-display)" }}>
            {p(smartTech.headline)}
          </h2>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-[#474747]">{p(smartTech.text)}</p>
          <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#333336] before:h-1.5 before:w-1.5 before:rounded-full before:bg-[#0077b3]">
            {p(smartTech.tags)}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={smartTech.ctaHref}
              className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--color-accent)] px-7 text-[15px] font-semibold text-white transition-colors hover:bg-[#00628f] active:scale-[0.98]"
            >
              {p(smartTech.cta)}
              <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" strokeWidth={2} />
            </Link>
          </div>
        </Reveal>

        <Reveal variant="scale" delay={120}>
          <Link to={smartTech.ctaHref} aria-label={p(smartTech.cta)} className="relative block rounded-[28px] bg-white p-6 sm:p-10">
            {device && (
              <img
                loading="lazy"
                decoding="async"
                src={device.image}
                alt={ml(device.name)}
                width={600}
                height={700}
                className="mx-auto aspect-[6/7] w-full max-w-sm rounded-[20px] object-cover"
              />
            )}
            {/* Téléphone à côté de l'appareil : état réel uniquement */}
            <div
              className="absolute bottom-6 end-4 w-40 rounded-[28px] border border-[#d6d6d6] bg-white p-2 sm:bottom-10 sm:end-8 sm:w-44"
              role="img"
              aria-label={`${p(smartTech.phoneDevice)} — ${device ? ml(device.name) : ""} — ${p(smartTech.phoneConnected)}`}
            >
              <div className="rounded-[22px] bg-[#f5f5f7] p-3">
                <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#d6d6d6]" />
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#5a5a5e]">{p(smartTech.phoneDevice)}</p>
                <p className="mt-1 line-clamp-2 text-xs font-semibold leading-snug text-[#1d1d1f]">{device ? ml(device.name) : ""}</p>
                {device?.reference && <p className="mt-1 font-mono text-[10px] text-[#5a5a5e]">{device.reference}</p>}
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#03873a]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#03873a]" />
                  {p(smartTech.phoneConnected)}
                </p>
              </div>
            </div>
          </Link>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {smartTech.cards.map((card, i) => (
          <Reveal key={card.icon} delay={i * 80} className="h-full">
            <Link to={smartTech.ctaHref} className="block h-full rounded-[28px] bg-white p-7 transition-colors hover:bg-[#fafafc]">
              <span className="text-[#0077b3]">
                <Icon name={card.icon} className="h-8 w-8" />
              </span>
              <h3 className="mt-5 text-[19px] font-semibold leading-snug text-[#1d1d1f]" style={{ fontFamily: "var(--font-display)" }}>
                {p(card.title)}
              </h3>
              <p className="mt-1 text-sm font-semibold text-[#0077b3]">{p(card.subtitle)}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-[#474747]">{p(card.text)}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
