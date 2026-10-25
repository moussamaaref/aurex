import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { newsItems, stories } from "../data"
import { ml, type Localized } from "../lib/ml"
import { useP } from "../content/lang"
import { news } from "../content/news"
import { storyUi, type Story } from "../content/stories"
import Reveal from "../components/Reveal"
import Icon from "../components/Icon"
import StoryViewer from "../components/StoryViewer"

/** Date de publication réelle, formatée dans la langue du site. */
function formatDate(value: unknown, lang: string): string {
  const raw = ml(value as Localized)
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
    const d = new Date(raw)
    if (!Number.isNaN(d.getTime())) {
      return new Intl.DateTimeFormat(lang === "ar" ? "ar-DZ" : lang === "en" ? "en-GB" : "fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(d)
    }
  }
  return raw
}

/* ───────── Product Stories : cartes verticales à grands rayons ───────── */
function StoryCards({ onOpen, lang }: { onOpen: (s: Story) => void; lang: string }) {
  const { p } = useP()
  const visible = useMemo(
    () =>
      stories
        .filter((s) => s.is_active !== false)
        .filter((s) => !s.lang || s.lang === "all" || s.lang === lang)
        .filter((s) => !s.published_at || new Date(s.published_at).getTime() <= Date.now())
        .filter((s) => (s.scenes ?? []).length > 0)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [lang],
  )

  if (visible.length === 0) return <p className="mt-8 text-[17px] text-[#474747]">{p(storyUi.empty)}</p>

  return (
    <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">
      {visible.map((story, i) => {
        const count = (story.scenes ?? []).length
        const cover = story.cover || story.scenes?.[0]?.image
        return (
          <li key={story.id}>
            <Reveal delay={Math.min(i, 4) * 70}>
              <button
                type="button"
                onClick={() => onOpen(story)}
                aria-label={`${p(storyUi.open)} — ${ml(story.name as Localized)}`}
                className="group relative block aspect-[3/4] w-full overflow-hidden rounded-[28px] bg-[#1d1d1f] text-start transition-transform duration-300 hover:-translate-y-1 active:scale-[0.98] motion-reduce:transition-none"
              >
                {cover && (
                  <img
                    loading="lazy"
                    decoding="async"
                    src={cover}
                    alt=""
                    width={600}
                    height={800}
                    className="absolute inset-0 h-full w-full object-contain bg-white p-4 transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
                  />
                )}
                <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 to-transparent" />
                {/* Indicateur de progression discret : nombre de scènes */}
                <span className="absolute inset-x-4 top-4 flex gap-1" aria-hidden="true">
                  {Array.from({ length: count }).map((_, k) => (
                    <span key={k} className={`h-1 flex-1 rounded-full ${k === 0 ? "bg-[#1d1d1f]/70" : "bg-[#1d1d1f]/20"}`} />
                  ))}
                </span>
                {story.is_new && (
                  <span className="absolute start-4 top-9 rounded-full bg-[var(--color-accent)] px-3 py-1 text-[11px] font-semibold tracking-wider text-white">
                    {p(storyUi.new)}
                  </span>
                )}
                <span className="absolute inset-x-0 bottom-0 p-5">
                  <span className="block text-[17px] font-semibold leading-snug text-white" style={{ fontFamily: "var(--font-display)" }}>
                    {ml(story.title as Localized)}
                  </span>
                  <span className="mt-1 block text-xs text-white/80">{ml(story.name as Localized)}</span>
                </span>
              </button>
            </Reveal>
          </li>
        )
      })}
    </ul>
  )
}

export default function NewsPage() {
  const { p, lang } = useP()
  const [category, setCategory] = useState("all")
  const [openStory, setOpenStory] = useState<Story | null>(null)

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(newsItems.map((item) => ml(item.category as Localized)).filter(Boolean)))],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang],
  )
  const visibleNews = category === "all" ? newsItems : newsItems.filter((item) => ml(item.category as Localized) === category)
  const featured = visibleNews[0]
  const remaining = visibleNews.slice(1)

  return (
    <div className="bg-[#f5f5f7] pt-28">
      {/* Héros — AUREX DISCOVERIES */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0077b3]">{p(news.hero.eyebrow)}</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight text-[#1d1d1f] lg:text-[80px] lg:tracking-[-1.2px]" style={{ fontFamily: "var(--font-display)" }}>
            {p(news.hero.title)}
          </h1>
          <p className="mt-6 max-w-2xl text-[19px] leading-relaxed text-[#333336]">{p(news.hero.text)}</p>
          <a
            href="#stories"
            className="group mt-9 inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--color-accent)] px-7 text-[15px] font-semibold text-white transition-colors hover:bg-[#00628f] active:scale-[0.98]"
          >
            {p(news.hero.cta)}
            <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" strokeWidth={2} />
          </a>
        </div>
      </section>

      {/* Product Stories — « Meet What's New. » */}
      <section id="stories" className="scroll-mt-24 mx-auto max-w-7xl px-6 py-16 lg:py-[90px]" aria-labelledby="stories-title">
        <Reveal>
          <h2 id="stories-title" className="text-4xl font-semibold leading-none tracking-tight text-[#1d1d1f] lg:text-[48px]" style={{ fontFamily: "var(--font-display)" }}>
            {p(storyUi.heading)}
          </h2>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-[#474747]">{p(storyUi.description)}</p>
        </Reveal>
        <StoryCards onOpen={setOpenStory} lang={lang} />
      </section>

      {/* À la une : articles */}
      <div id="a-la-une" className="mx-auto max-w-7xl px-6 pb-16 lg:pb-[90px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <h2 className="text-4xl font-semibold leading-none tracking-tight text-[#1d1d1f] lg:text-[40px]" style={{ fontFamily: "var(--font-display)" }}>
            {p(news.featuredSection)}
          </h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label={p(news.filters)}>
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={`min-h-11 rounded-full px-5 text-sm font-semibold transition-colors ${
                  category === item ? "bg-[#1d1d1f] text-white" : "border border-[#d6d6d6] bg-white text-[#474747] hover:border-[#0077b3] hover:text-[#0077b3]"
                }`}
              >
                {item === "all" ? p(news.all) : item}
              </button>
            ))}
          </div>
        </div>

        {featured && (
          <Reveal>
            <article className="group mb-8 grid overflow-hidden rounded-[28px] bg-white lg:grid-cols-[1.15fr_0.85fr]">
              <div className="relative min-h-[280px] overflow-hidden lg:min-h-[420px]">
                <img
                  loading="lazy"
                  decoding="async"
                  src={String(featured.image)}
                  alt={ml(featured.title as Localized)}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
                />
                <span className="absolute start-5 top-5 inline-flex items-center rounded-full bg-[var(--color-accent)] px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-white">
                  {p(news.featuredBadge)}
                </span>
                <span className="absolute bottom-5 start-5 rounded-full bg-black/55 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-white">
                  {p(news.featuredLabel)}
                </span>
              </div>
              <div className="flex flex-col justify-center p-8 md:p-12">
                <time className="text-sm text-[#5a5a5e]" dateTime={ml(featured.date as Localized)}>
                  {formatDate(featured.date, lang)}
                </time>
                <h3 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[#1d1d1f] md:text-[34px]" style={{ fontFamily: "var(--font-display)" }}>
                  {ml(featured.title as Localized)}
                </h3>
                <p className="mt-5 text-[17px] leading-relaxed text-[#474747]">{ml(featured.excerpt as Localized)}</p>
                <span className="mt-8 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-[#0077b3] transition-all group-hover:gap-3">
                  {p(news.featuredCta)}
                  <Icon name="arrow" className="h-4 w-4 rtl:-scale-x-100" strokeWidth={2} />
                </span>
              </div>
            </article>
          </Reveal>
        )}

        {remaining.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {remaining.map((item, idx) => (
              <Reveal key={String(item.id)} delay={Math.min(idx, 5) * 70} className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-white">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      loading="lazy"
                      decoding="async"
                      src={String(item.image)}
                      alt={ml(item.title as Localized)}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
                    />
                    <span className="absolute start-3 top-3 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-white">
                      {ml(item.category as Localized)}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <time className="text-xs text-[#5a5a5e]" dateTime={ml(item.date as Localized)}>
                      {formatDate(item.date, lang)}
                    </time>
                    <h3 className="mt-2 line-clamp-2 text-[19px] font-semibold leading-snug text-[#1d1d1f]" style={{ fontFamily: "var(--font-display)" }}>
                      {ml(item.title as Localized)}
                    </h3>
                    <p className="mt-3 line-clamp-3 flex-1 text-[15px] leading-relaxed text-[#474747]">{ml(item.excerpt as Localized)}</p>
                    <span className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-[#0077b3]">
                      {p(news.cardCta)}
                      <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" strokeWidth={2} />
                    </span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}

        {visibleNews.length === 0 && (
          <p className="rounded-[28px] bg-white py-16 text-center text-[17px] text-[#474747]">{p(news.empty)}</p>
        )}

        {/* Support & assistance */}
        <section className="mt-16 flex flex-col justify-between gap-7 rounded-[28px] bg-[#1d1d1f] p-8 md:flex-row md:items-center md:p-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4db3e6]">{p(news.needHelp)}</p>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold leading-snug text-white md:text-[28px]" style={{ fontFamily: "var(--font-display)" }}>
              {p(news.supportTitle)}
            </h2>
          </div>
          <Link
            to="/support"
            className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-7 text-[15px] font-semibold text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7] active:scale-[0.98]"
          >
            {p(news.supportAction)}
            <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" strokeWidth={2} />
          </Link>
        </section>
      </div>

      {openStory && <StoryViewer story={openStory} onClose={() => setOpenStory(null)} />}
    </div>
  )
}
