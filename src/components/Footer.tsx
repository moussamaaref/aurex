import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useSiteSettings } from "../context/SiteSettingsContext"

export default function Footer() {
  const { t } = useTranslation()
  const { settings } = useSiteSettings()

  const handleLogoError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.display = "none"
    event.currentTarget.nextElementSibling?.removeAttribute("hidden")
  }

  const footerLinks = {
    [t("footer.links.Produits")]: [
      { label: t("footer.links.lavage"), href: "/produits/lavage" },
      {
        label: t("footer.links.laveVaisselle"),
        href: "/produits/lave-vaisselle",
      },
      {
        label: t("footer.links.refrigerateurs"),
        href: "/produits/refrigerateurs",
      },
      { label: t("footer.links.cuisson"), href: "/produits/cuisson" },
      {
        label: t("footer.links.traitementAir"),
        href: "/produits/traitement-air",
      },
      {
        label: t("footer.links.climatisation"),
        href: "/produits/climatisation",
      },
    ],
    [t("footer.links.Explorer")]: [
      { label: t("header.smartHome"), href: "/smart-home" },
      { label: t("footer.links.technologies"), href: "/technologies" },
      { label: t("footer.links.comparateur"), href: "/comparateur" },
      { label: t("footer.links.actualites"), href: "/actualites" },
      { label: t("footer.links.aPropos"), href: "/a-propos" },
    ],
    [t("footer.links.Support")]: [
      { label: t("footer.links.assistance"), href: "/support" },
      { label: t("footer.links.noticesManuels"), href: "/support#notices" },
      { label: t("footer.links.faq"), href: "/support#faq" },
      { label: t("footer.links.piecesDetachees"), href: "/support#pieces" },
      { label: t("footer.links.contactLink"), href: "/support#contact" },
      { label: t("footer.links.centresService"), href: "/support#centres" },
    ],
  }

  return (
    <footer className="bg-[#0D1117] text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand col */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              {settings.showLogoIcon && (
                <div className="w-11 h-11 rounded-lg flex items-center justify-center overflow-hidden" style={{ backgroundColor: settings.logoIconBg }}>
                  {settings.logoIconUrl ? (
                    <img src={settings.logoIconUrl} alt="icon" className="w-8 h-8 object-contain" />
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                      <rect x="3" y="3" width="6" height="6" fill="white" opacity="0.9" />
                      <rect x="11" y="3" width="6" height="6" fill="white" opacity="0.5" />
                      <rect x="3" y="11" width="6" height="6" fill="white" opacity="0.5" />
                      <rect x="11" y="11" width="6" height="6" fill={settings.logoAccent} />
                    </svg>
                  )}
                </div>
              )}
              {settings.showLogoImage && <img src={settings.logoUrl || "/aurex-logo.png"} alt="AUREX" className="h-10 w-auto object-contain" onError={handleLogoError} />}
              {settings.showLogoText ? (
                <span className="text-[27px] font-bold tracking-[-0.08em]" style={{ color: settings.logoTextColor }}>
                  {settings.logoText}
                </span>
              ) : (
                <span hidden className="text-[27px] font-bold tracking-[-0.08em] text-white">
                  aurex
                </span>
              )}
            </div>

            <p
              className="text-sm text-gray-400 leading-relaxed max-w-xs"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <span
                dangerouslySetInnerHTML={{ __html: t("footer.brandDesc") }}
              />
            </p>

            {/* Newsletter */}
            <div className="mt-6">
              <p
                className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {t("footer.stayInformed")}
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder={t("footer.emailPlaceholder")}
                  className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                  style={{ fontFamily: "var(--font-sans)" }}
                />
                <button
                  className="bg-[var(--color-accent)] hover:bg-[#1a51d4] transition-colors text-white px-4 py-2.5 rounded text-sm font-medium whitespace-nowrap"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {t("footer.subscribe")}
                </button>
              </div>
            </div>

            {/* Social — connecté à site_settings.social_links */}
            <div className="mt-6 flex items-center gap-3">
              {(() => {
                const defaults = [
                  { label: "Facebook", icon: "f", href: "#" },
                  { label: "Instagram", icon: "◎", href: "#" },
                  { label: "YouTube", icon: "▶", href: "#" },
                  { label: "LinkedIn", icon: "in", href: "#" },
                ]
                const entries = Object.entries(settings.socialLinks)
                const socials =
                  entries.length > 0
                    ? entries.map(([k, v]) => ({
                        label: k,
                        icon: k.slice(0, 2).toUpperCase(),
                        href: v as string,
                      }))
                    : defaults
                return socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={s.href.startsWith("http") ? "noreferrer" : undefined}
                    aria-label={s.label}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[var(--color-accent)] border border-white/10 hover:border-[var(--color-accent)] flex items-center justify-center text-xs text-gray-400 hover:text-white transition-all"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                  >
                    {s.icon}
                  </a>
                ))
              })()}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4
                className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {group}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact info */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              ),
              label: t("footer.contact.phone"),
              value: settings.contactPhone || "+213 21 XX XX XX",
            },
            {
              icon: (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              ),
              label: t("footer.contact.email"),
              value: settings.contactEmail || "support@aurex-dz.com",
            },
            {
              icon: (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              ),
              label: t("footer.contact.address"),
              value: settings.contactAddress || t("footer.contact.city"),
            },
          ].map((info) => (
            <div key={info.label} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] flex-shrink-0 mt-0.5">
                {info.icon}
              </div>
              <div>
                <p
                  className="text-xs text-gray-500 font-medium"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {info.label}
                </p>
                <p
                  className="text-sm text-gray-300 mt-0.5"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {info.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p
            className="text-xs text-gray-600"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {t("footer.copyright")}
          </p>
          <div className="flex items-center gap-4">
            {[
              t("footer.legal"),
              t("footer.privacy"),
              t("footer.terms"),
              t("footer.cookies"),
            ].map((label) => (
              <a
                key={label}
                href="#"
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
