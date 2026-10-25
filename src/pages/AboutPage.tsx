import { Link } from "react-router-dom"
import { useP } from "../content/lang"
import { about } from "../content/about"
import Reveal from "../components/Reveal"
import Icon from "../components/Icon"

const eyebrow = "text-xs font-semibold uppercase tracking-[0.18em]"
const h2 = "font-semibold leading-[1.05] tracking-tight text-[#1d1d1f]"
const btnPrimary =
  "group inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--color-accent)] px-7 text-[15px] font-semibold text-white transition-colors hover:bg-[#00628f] active:scale-[0.98]"
const btnGhost =
  "inline-flex min-h-12 items-center rounded-full border border-[#86868b] px-7 text-[15px] font-semibold text-[#1d1d1f] transition-colors hover:bg-white active:scale-[0.98]"

export default function AboutPage() {
  const { p } = useP()

  return (
    <div>
      {/* 01 — Héros : À propos d'AUREX */}
      <section className="relative isolate flex min-h-[600px] items-end overflow-hidden bg-[#1d1d1f] pt-28 lg:min-h-[680px]">
        <img
          fetchPriority="high"
          decoding="async"
          src={about.hero.image}
          alt={p(about.hero.imageAlt)}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/45 to-transparent rtl:bg-gradient-to-l" />
        <div className="mx-auto w-full max-w-7xl px-6 pb-20">
          <p className={`${eyebrow} text-white/90`}>{p(about.hero.eyebrow)}</p>
          <h1
            className="mt-4 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight text-white lg:text-[80px] lg:tracking-[-1.2px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {p(about.hero.title)}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">{p(about.hero.subtitle)}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#mission" className={btnPrimary}>
              {p(about.hero.cta1)}
              <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" strokeWidth={2} />
            </a>
            <a href="#qui-est-aurex" className="inline-flex min-h-12 items-center rounded-full border border-white/60 px-7 text-[15px] font-semibold text-white transition-colors hover:bg-white/10 active:scale-[0.98]">
              {p(about.hero.cta2)}
            </a>
          </div>
        </div>
      </section>

      {/* 02 — Qui est AUREX ? */}
      <section id="qui-est-aurex" className="scroll-mt-24 bg-white py-20 lg:py-[90px]" aria-labelledby="who-title">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 id="who-title" className={`${h2} text-4xl lg:text-[48px]`} style={{ fontFamily: "var(--font-display)" }}>
              {p(about.who.title)}
            </h2>
          </Reveal>
          <div className="space-y-6 lg:col-span-8">
            {about.who.paragraphs.map((para, i) => (
              <Reveal key={i} delay={Math.min(i, 3) * 80}>
                <p className="text-[17px] leading-relaxed text-[#333336]">{p(para)}</p>
              </Reveal>
            ))}
            <Reveal delay={200}>
              <p className="border-t border-[#d6d6d6] pt-6 text-[19px] font-semibold text-[#1d1d1f]" style={{ fontFamily: "var(--font-display)" }}>
                {p(about.who.signature)}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 04 — Notre mission (la section « Notre histoire » est supprimée) */}
      <section id="mission" className="scroll-mt-24 bg-[#f5f5f7] py-20 lg:py-[90px]" aria-labelledby="mission-title">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          <Reveal>
            <p className={`${eyebrow} text-[#0077b3]`}>{p(about.mission.eyebrow)}</p>
            <h2 id="mission-title" className={`mt-4 text-4xl lg:text-[48px] ${h2}`} style={{ fontFamily: "var(--font-display)" }}>
              {p(about.mission.title)}
            </h2>
            <p className="mt-6 text-[17px] leading-relaxed text-[#474747]">{p(about.mission.text)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/produits" className={btnPrimary}>
                {p(about.mission.cta1)}
                <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" strokeWidth={2} />
              </Link>
              <Link to="/support#contact" className={btnGhost}>
                {p(about.mission.cta2)}
              </Link>
            </div>
          </Reveal>
          <Reveal variant="scale" delay={120}>
            <img
              loading="lazy"
              decoding="async"
              src={about.mission.image}
              alt={p(about.mission.imageAlt)}
              width={1400}
              height={1000}
              className="aspect-[7/5] w-full rounded-[28px] object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* 05 — Nos engagements : les principes AUREX */}
      <section className="bg-white py-20 lg:py-[90px]" aria-labelledby="values-title">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <p className={`${eyebrow} text-[#0077b3]`}>{p(about.values.eyebrow)}</p>
            <h2 id="values-title" className={`mt-3 text-4xl lg:text-[40px] ${h2}`} style={{ fontFamily: "var(--font-display)" }}>
              {p(about.values.title)}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
            {about.values.items.map((item, i) => (
              <Reveal
                key={item.num}
                delay={Math.min(i, 4) * 80}
                className={`h-full ${i < 3 ? "lg:col-span-2" : "lg:col-span-3"}`}
              >
                <div className="h-full rounded-[28px] bg-[#f5f5f7] p-8">
                  <div className="flex items-center justify-between">
                    <span className="text-[#0077b3]">
                      <Icon name={item.icon} className="h-8 w-8" />
                    </span>
                    <span className="text-xs font-semibold text-[#5a5a5e]">{item.num}</span>
                  </div>
                  <h3 className="mt-6 text-[21px] font-semibold leading-snug text-[#1d1d1f]" style={{ fontFamily: "var(--font-display)" }}>
                    {p(item.title)}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#474747]">{p(item.text)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 06 — Nous sommes là pour vous : interface sombre, dégradés raffinés, typographie marquée */}
      <section className="relative isolate overflow-hidden bg-[#1d1d1f] py-24 lg:py-[110px]" aria-labelledby="here-title">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_85%_20%,rgba(0,119,179,0.45),transparent_70%),radial-gradient(50%_70%_at_10%_100%,rgba(77,179,230,0.18),transparent_70%)]" />
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <p className={`${eyebrow} text-[#4db3e6]`}>{p(about.here.eyebrow)}</p>
            <h2 id="here-title" className="mt-4 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight text-white lg:text-[80px] lg:tracking-[-1.2px]" style={{ fontFamily: "var(--font-display)" }}>
              {p(about.here.title)}
            </h2>
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/80">{p(about.here.text)}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/support#demande" className={btnPrimary}>
                {p(about.here.cta1)}
                <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" strokeWidth={2} />
              </Link>
              <Link to="/support#sav" className="inline-flex min-h-12 items-center rounded-full border border-white/60 px-7 text-[15px] font-semibold text-white transition-colors hover:bg-white/10 active:scale-[0.98]">
                {p(about.here.cta2)}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 07 — CTA final : fond clair, très grand titre, un seul bouton */}
      <section className="bg-[#fafafc] py-24 text-center lg:py-[120px]" aria-labelledby="final-title">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <p className={`${eyebrow} text-[#0077b3]`}>{p(about.final.eyebrow)}</p>
            <h2 id="final-title" className="mt-5 text-5xl font-semibold leading-[1.02] tracking-tight text-[#1d1d1f] sm:text-7xl lg:text-[96px] lg:tracking-[-1.8px]" style={{ fontFamily: "var(--font-display)" }}>
              {p(about.final.lead)}
              <br />
              <span className="font-bold text-[#0077b3]">{about.final.brand}</span>
              {p(about.final.tail)}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-[#474747]">{p(about.final.text)}</p>
            <Link
              to="/produits"
              className="group mt-9 inline-flex min-h-14 items-center gap-2 rounded-[14px] bg-[#1d1d1f] px-9 text-base font-semibold text-white transition-colors hover:bg-[#333336] active:scale-[0.98]"
            >
              {p(about.final.cta)}
              <Icon name="arrow" className="h-5 w-5 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" strokeWidth={2} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
