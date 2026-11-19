import { Link } from "react-router-dom"
import { useP } from "../content/lang"
import { about } from "../content/about"
import Reveal from "../components/Reveal"
import Icon from "../components/Icon"

const eyebrow = "text-xs font-semibold "
const h2 = "font-semibold leading-[1.05] tracking-tight text-obsidian"
const btnPrimary =
  "group inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 text-sm font-semibold text-white transition-colors hover:bg-accent-hover active:scale-[0.98]"
const btnGhost =
  "inline-flex min-h-11 items-center rounded-full border border-steel px-6 text-sm font-semibold text-obsidian transition-colors hover:bg-white active:scale-[0.98]"

export default function AboutPage() {
  const { p } = useP()

  return (
    <div>
      {/* 01 — Héros : À propos d'AUREX */}
      <section className="relative isolate flex min-h-[460px] items-end overflow-hidden bg-obsidian pt-28 lg:min-h-[520px]">
        <img
          fetchPriority="high"
          decoding="async"
          src={about.hero.image}
          alt={p(about.hero.imageAlt)}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/45 to-transparent rtl:bg-gradient-to-l" />
        <div className="mx-auto w-full max-w-7xl px-6 pb-14">
          <p className={`${eyebrow} text-white/90`}>{p(about.hero.eyebrow)}</p>
          <h1
            className="mt-4 max-w-4xl text-3xl font-semibold sm:text-4xl leading-[1.05] tracking-tight text-white lg:text-[52px] lg:tracking-[-0.8px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {p(about.hero.title)}
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">{p(about.hero.subtitle)}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#mission" className={btnPrimary}>
              {p(about.hero.cta1)}
              <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" strokeWidth={2} />
            </a>
            <a href="#qui-est-aurex" className="inline-flex min-h-11 items-center rounded-full border border-white/60 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10 active:scale-[0.98]">
              {p(about.hero.cta2)}
            </a>
          </div>
        </div>
      </section>

      {/* 02 — Qui est AUREX ? */}
      <section id="qui-est-aurex" className="scroll-mt-24 bg-white py-20 lg:py-[90px]" aria-labelledby="who-title">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 id="who-title" className={`${h2} text-4xl lg:text-[40px]`} style={{ fontFamily: "var(--font-display)" }}>
              {p(about.who.title)}
            </h2>
          </Reveal>
          <div className="space-y-6 lg:col-span-8">
            {about.who.paragraphs.map((para, i) => (
              <Reveal key={i} delay={Math.min(i, 3) * 80}>
                <p className="text-[17px] leading-relaxed text-charcoal">{p(para)}</p>
              </Reveal>
            ))}
            <Reveal delay={200}>
              <p className="border-t border-fog pt-6 text-[19px] font-semibold text-obsidian" style={{ fontFamily: "var(--font-display)" }}>
                {p(about.who.signature)}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 04 — Notre mission (la section « Notre histoire » est supprimée) */}
      <section id="mission" className="scroll-mt-24 bg-studio-mist py-20 lg:py-[90px]" aria-labelledby="mission-title">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          <Reveal>
            <p className={`${eyebrow} text-link-deep`}>{p(about.mission.eyebrow)}</p>
            <h2 id="mission-title" className={`mt-4 text-4xl lg:text-[40px] ${h2}`} style={{ fontFamily: "var(--font-display)" }}>
              {p(about.mission.title)}
            </h2>
            <p className="mt-6 text-[17px] leading-relaxed text-slate">{p(about.mission.text)}</p>
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
            <p className={`${eyebrow} text-link-deep`}>{p(about.values.eyebrow)}</p>
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
                <div className="h-full rounded-[28px] bg-studio-mist p-8">
                  <div className="flex items-center justify-between">
                    <span className="text-link-deep">
                      <Icon name={item.icon} className="h-8 w-8" />
                    </span>
                    <span className="text-xs font-semibold text-iron-gray">{item.num}</span>
                  </div>
                  <h3 className="mt-6 text-[21px] font-semibold leading-snug text-obsidian" style={{ fontFamily: "var(--font-display)" }}>
                    {p(item.title)}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate">{p(item.text)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 06 — Nous sommes là pour vous : interface sombre, dégradés raffinés, typographie marquée */}
      <section className="relative isolate overflow-hidden bg-obsidian py-24 lg:py-[110px]" aria-labelledby="here-title">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_85%_20%,color-mix(in_srgb,var(--color-signal-blue)_45%,transparent),transparent_70%),radial-gradient(50%_70%_at_10%_100%,color-mix(in_srgb,var(--color-sky)_18%,transparent),transparent_70%)]" />
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <p className={`${eyebrow} text-sky`}>{p(about.here.eyebrow)}</p>
            <h2 id="here-title" className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-white lg:text-[52px] lg:tracking-[-0.8px]" style={{ fontFamily: "var(--font-display)" }}>
              {p(about.here.title)}
            </h2>
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/80">{p(about.here.text)}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/support#demande" className={btnPrimary}>
                {p(about.here.cta1)}
                <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" strokeWidth={2} />
              </Link>
              <Link to="/support#sav" className="inline-flex min-h-11 items-center rounded-full border border-white/60 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10 active:scale-[0.98]">
                {p(about.here.cta2)}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 07 — CTA final : fond clair, très grand titre, un seul bouton */}
      <section className="bg-paper-frost py-24 text-center lg:py-[120px]" aria-labelledby="final-title">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <p className={`${eyebrow} text-link-deep`}>{p(about.final.eyebrow)}</p>
            <h2 id="final-title" className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-obsidian sm:text-6xl lg:text-[64px] lg:tracking-[-1px]" style={{ fontFamily: "var(--font-display)" }}>
              {p(about.final.lead)}
              <br />
              <span className="font-bold text-link-deep">{about.final.brand}</span>
              {p(about.final.tail)}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-slate">{p(about.final.text)}</p>
            <Link
              to="/produits"
              className="group mt-9 inline-flex min-h-14 items-center gap-2 rounded-[14px] bg-obsidian px-9 text-base font-semibold text-white transition-colors hover:bg-charcoal active:scale-[0.98]"
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
