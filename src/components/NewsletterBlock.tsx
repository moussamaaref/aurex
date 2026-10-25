import { useState } from "react"
import { useP } from "../content/lang"
import { newsletterContent as c } from "../content/footer"
import { subscribeNewsletter } from "../lib/forms"

/** Newsletter (pied de page) : espace de relation continue, pas seulement une collecte d'e-mails. */
export default function NewsletterBlock() {
  const { p, lang } = useP()
  const [email, setEmail] = useState("")
  const [state, setState] = useState<"idle" | "sending" | "done" | "invalid" | "error">("idle")

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setState("invalid")
      return
    }
    setState("sending")
    const result = await subscribeNewsletter(email, lang)
    setState(result.ok ? "done" : "error")
  }

  return (
    <section className="bg-white border-t border-[#d6d6d6]" aria-labelledby="newsletter-title">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:py-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0077b3]" style={{ fontFamily: "var(--font-display)" }}>
            {p(c.eyebrow)}
          </p>
          <h2
            id="newsletter-title"
            className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight text-[#1d1d1f] lg:text-[40px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {p(c.title)}
          </h2>
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-[#474747]">{p(c.text)}</p>
        </div>

        {state === "done" ? (
          <div role="status" className="rounded-[28px] bg-[#f5f5f7] p-8">
            <p className="text-xl font-semibold leading-snug text-[#1d1d1f]" style={{ fontFamily: "var(--font-display)" }}>
              {p(c.successTitle)}
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-[#474747]">{p(c.successText)}</p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              {p(c.placeholder)}
            </label>
            <input
              id="newsletter-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (state !== "sending") setState("idle")
              }}
              placeholder={p(c.placeholder)}
              aria-invalid={state === "invalid"}
              className="min-h-12 flex-1 rounded-full border border-[#86868b] bg-white px-6 text-[15px] text-[#1d1d1f] outline-none transition-colors placeholder:text-[#707070] focus:border-[var(--color-accent)]"
            />
            <button
              type="submit"
              disabled={state === "sending"}
              className="min-h-12 whitespace-nowrap rounded-full bg-[var(--color-accent)] px-7 text-[15px] font-semibold text-white transition-colors hover:bg-[#00628f] disabled:opacity-60"
            >
              {p(c.cta)}
            </button>
            {(state === "invalid" || state === "error") && (
              <p role="alert" className="text-sm text-[#b64400] sm:basis-full">
                {state === "invalid" ? p(c.invalid) : p(c.error)}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  )
}
