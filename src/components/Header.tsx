import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useCompare } from "../context/CompareContext"

const navItems = [
  { key: "products", href: "/produits", hasMega: true },
  { key: "smartHome", href: "/smart-home" },
  { key: "technologies", href: "/technologies" },
  { key: "news", href: "/actualites" },
  { key: "about", href: "/a-propos" },
  { key: "support", href: "/support" },
]

const megaCats = [
  { slug: "lavage", catKey: "washing" },
  { slug: "lave-vaisselle", catKey: "dishwasher" },
  { slug: "petit-electromenager", catKey: "smallAppliances" },
  { slug: "chauffe-eau", catKey: "waterHeating" },
  { slug: "entretien-maison", catKey: "homeCare" },
  { slug: "fontaines", catKey: "waterFountains" },
  { slug: "cuisson", catKey: "cooking" },
  { slug: "autres", catKey: "otherAppliances" },
]

export default function Header() {
  const { t, i18n } = useTranslation()
  const { ids: compareIds } = useCompare()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const [hoveredNav, setHoveredNav] = useState<string | null>(null)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const location = useLocation()

  const openNav = (key: string) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    setHoveredNav(key)
    setMegaOpen(key === "products")
  }

  const closeNav = () => {
    hoverTimer.current = setTimeout(() => {
      setHoveredNav(null)
      setMegaOpen(false)
    }, 120)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setMegaOpen(false)
    setHoveredNav(null)
    setSearchOpen(false)
  }, [location.pathname])

  const isActive = (href: string) =>
    href === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(href)

  const changeLang = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "shadow-[0_8px_30px_rgba(15,23,42,0.08)]" : ""
        }`}
      >
        {/* Top bar */}
        <div className="bg-[#F5F7FA] border-b border-[#E5EAF1] text-[#334155] text-xs">
          <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-center md:justify-between gap-4">
            <span
              style={{
                fontFamily: "var(--font-sans)",
                letterSpacing: "0.03em",
              }}
            >
              {t("header.distributor")}
            </span>
            <div
              className="hidden md:flex items-center gap-4"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <span className="text-[#64748B]">{t("header.assistance")}</span>
              <span className="text-[#CBD5E1]">|</span>
              <Link
                to="/support"
                className="font-semibold text-[#0A2463] hover:text-[#1E5EF3] transition-colors"
              >
                {t("header.onlineService")}
              </Link>
            </div>
          </div>
        </div>

        {/* Main bar */}
        <div
          className={`bg-white border-b transition-colors duration-300 ${
            scrolled ? "border-gray-200" : "border-gray-100"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 select-none">
              <div className="w-10 h-10 bg-[#0A2463] rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect
                    x="3"
                    y="3"
                    width="6"
                    height="6"
                    fill="white"
                    opacity="0.9"
                  />
                  <rect
                    x="11"
                    y="3"
                    width="6"
                    height="6"
                    fill="white"
                    opacity="0.5"
                  />
                  <rect
                    x="3"
                    y="11"
                    width="6"
                    height="6"
                    fill="white"
                    opacity="0.5"
                  />
                  <rect x="11" y="11" width="6" height="6" fill="#1E5EF3" />
                </svg>
              </div>
              <span
                className="text-[27px] font-bold tracking-[-0.08em] text-[#168BC3]"
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                aurex
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center">
              {navItems.map((item) => (
                <div
                  key={item.key}
                  className="relative"
                  onMouseEnter={() => openNav(item.key)}
                  onMouseLeave={closeNav}
                >
                  <Link
                    to={item.href}
                    className={`flex items-center gap-0.5 px-3.5 py-2 text-sm font-medium transition-colors duration-150 relative group
                      ${
                        isActive(item.href)
                          ? "text-[#0A2463]"
                          : "text-gray-600 hover:text-[#0A2463]"
                      }`}
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {t(`header.navItems.${item.key}`)}
                    {item.hasMega && (
                      <svg
                        className={`w-3.5 h-3.5 ml-0.5 transition-transform duration-200 ${
                          megaOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                    <span
                      className={`absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#1E5EF3] transition-transform duration-200 origin-left
                      ${
                        isActive(item.href)
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                </div>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              <Link
                to="/comparateur"
                className="relative p-2 text-gray-500 hover:text-[#0A2463] transition-colors rounded-lg hover:bg-gray-50"
                aria-label={`${t("header.comparator")}${
                  compareIds.length > 0
                    ? ` (${compareIds.length} ${t("comparator.countShort", {
                        count: compareIds.length,
                      })})`
                    : ""
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a3 3 0 01-3-3V6a3 3 0 013-3h14a3 3 0 013 3v7a3 3 0 01-3 3h-4l-4 4v-4z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 18h6" />
                </svg>
                {compareIds.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-[#1E5EF3] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none font-sans">
                    {compareIds.length}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setSearchOpen((v) => !v)}
                className="p-2 text-gray-500 hover:text-[#0A2463] transition-colors rounded-lg hover:bg-gray-50"
                aria-label={t("header.searchLabel")}
              >
                {searchOpen ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                )}
              </button>

              {/* Language */}
              <div className="hidden md:flex items-center gap-0.5 pl-1 ml-1 border-l border-gray-200">
                {(["FR", "AR", "EN"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => changeLang(l.toLowerCase())}
                    className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
                      i18n.language === l.toLowerCase()
                        ? "bg-[#0A2463] text-white"
                        : "text-gray-500 hover:text-[#0A2463] hover:bg-gray-50"
                    }`}
                    style={{
                      fontFamily: "var(--font-display)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <Link
                to="/distributeurs"
                className="hidden md:flex items-center gap-1.5 bg-[#1E5EF3] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#1a51d4] transition-colors ml-2 shadow-sm shadow-blue-200"
                style={{ fontFamily: "var(--font-sans)" }}
              >
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
                {t("common.whereToBuy")}
              </Link>

              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden p-2 text-gray-500 hover:text-[#0A2463] transition-colors rounded-lg ml-1"
                aria-label={t("header.menuLabel")}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  {mobileOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="border-t border-gray-100 px-6 py-3 animate-fade-in-down">
              <div className="max-w-2xl mx-auto relative">
                <input
                  type="search"
                  placeholder={t("header.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-[#1E5EF3] focus:bg-white transition-colors"
                  style={{ fontFamily: "var(--font-sans)" }}
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Mega menu */}
        {hoveredNav === "products" && (
          <div
            className="hidden lg:block bg-white border-b border-gray-200 shadow-xl animate-fade-in-down"
            onMouseEnter={() => openNav("products")}
            onMouseLeave={closeNav}
          >
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="grid grid-cols-4 gap-8">
                <div className="col-span-3">
                  <p
                    className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-5"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {t("header.categoriesTitle")}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {megaCats.map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/produits/${cat.slug}`}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#EFF3FB] group transition-colors"
                      >
                        <div className="w-9 h-9 bg-[#EFF3FB] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#0A2463] transition-colors">
                          <svg
                            className="w-4 h-4 text-[#0A2463] group-hover:text-white transition-colors"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p
                            className="text-sm font-semibold text-gray-800 group-hover:text-[#0A2463] transition-colors"
                            style={{ fontFamily: "var(--font-sans)" }}
                          >
                            {t(`header.megaCategories.${cat.catKey}.label`)}
                          </p>
                          <p
                            className="text-xs text-gray-500 mt-0.5"
                            style={{ fontFamily: "var(--font-sans)" }}
                          >
                            {t(`header.megaCategories.${cat.catKey}.desc`)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    to="/produits"
                    className="inline-flex items-center gap-1.5 mt-6 text-sm font-medium text-[#1E5EF3] hover:text-[#0A2463] transition-colors"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {t("header.seeAllProducts")}
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>

                <div className="border-l border-gray-100 pl-8">
                  <p
                    className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-5"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {t("header.featured")}
                  </p>
                  <div className="rounded-xl overflow-hidden bg-gradient-to-br from-[#0A2463] to-[#1E5EF3]">
                    <div className="p-5 text-white">
                      <span
                        className="text-[10px] font-bold tracking-[0.18em] uppercase text-blue-200"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {t("header.new")}
                      </span>
                      <h4
                        className="text-lg font-bold leading-tight mt-1.5"
                        style={{
                          fontFamily: "var(--font-display)",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {t("header.ex9000Series")}
                      </h4>
                      <p
                        className="text-xs text-blue-100 mt-2 leading-relaxed"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        {t("header.ex9000Desc")}
                      </p>
                      <Link
                        to="/produits"
                        className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-white border border-white/30 rounded-lg px-3 py-2 hover:bg-white/10 transition-colors"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        {t("header.discover")}
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    {[
                      { labelKey: "header.smartHome", href: "/smart-home" },
                      { labelKey: "header.comparator", href: "/comparateur" },
                      {
                        labelKey: "header.noticesAndService",
                        href: "/support",
                      },
                    ].map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 group transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          {link.href === "/comparateur" && (
                            <svg
                              className="w-4 h-4 text-gray-400 group-hover:text-[#1E5EF3] transition-colors"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.8}
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a3 3 0 01-3-3V6a3 3 0 013-3h14a3 3 0 013 3v7a3 3 0 01-3 3h-4l-4 4v-4z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 18h6"
                              />
                            </svg>
                          )}
                          <span
                            className="text-sm text-gray-600 group-hover:text-[#0A2463] transition-colors"
                            style={{ fontFamily: "var(--font-sans)" }}
                          >
                            {t(link.labelKey)}
                          </span>
                          {link.href === "/comparateur" &&
                            compareIds.length > 0 && (
                              <span className="min-w-4 h-4 px-1 inline-flex items-center justify-center bg-[#1E5EF3] text-white text-[10px] font-bold rounded-full font-sans leading-none">
                                {compareIds.length}
                              </span>
                            )}
                        </span>
                        <svg
                          className="w-4 h-4 text-gray-400 group-hover:text-[#1E5EF3] transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {hoveredNav && hoveredNav !== "products" && (
          <div
            className="hidden lg:block bg-white border-b border-gray-200 shadow-xl animate-fade-in-down"
            onMouseEnter={() => openNav(hoveredNav)}
            onMouseLeave={closeNav}
          >
            <div className="max-w-7xl mx-auto px-6 py-7">
              <div className="grid grid-cols-[1.2fr_2fr_1fr] items-center gap-8">
                <div>
                  <p
                    className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1E5EF3] mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {t(`header.navItems.${hoveredNav}`)}
                  </p>
                  <h3
                    className="text-2xl font-bold text-[#0A2463] leading-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {t(`header.navDetails.${hoveredNav}.title`)}
                  </h3>
                </div>
                <p
                  className="text-sm text-[#64748B] leading-relaxed max-w-xl"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {t(`header.navDetails.${hoveredNav}.description`)}
                </p>
                <Link
                  to={t(`header.navDetails.${hoveredNav}.href`)}
                  onClick={() => setHoveredNav(null)}
                  className="justify-self-end inline-flex items-center gap-2 bg-[#EFF3FB] text-[#0A2463] hover:bg-[#1E5EF3] hover:text-white font-semibold text-sm px-4 py-3 rounded-xl transition-colors"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {t(`header.navDetails.${hoveredNav}.action`)}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 left-0 bottom-0 w-80 bg-white shadow-2xl flex flex-col animate-fade-in-down">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2"
              >
                <div className="w-7 h-7 bg-[#0A2463] rounded flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <rect
                      x="3"
                      y="3"
                      width="6"
                      height="6"
                      fill="white"
                      opacity="0.9"
                    />
                    <rect
                      x="11"
                      y="3"
                      width="6"
                      height="6"
                      fill="white"
                      opacity="0.5"
                    />
                    <rect
                      x="3"
                      y="11"
                      width="6"
                      height="6"
                      fill="white"
                      opacity="0.5"
                    />
                    <rect x="11" y="11" width="6" height="6" fill="#1E5EF3" />
                  </svg>
                </div>
                <span
                  className="text-2xl font-bold tracking-[-0.08em] text-[#168BC3]"
                  style={{ fontFamily: "Arial, sans-serif" }}
                >
                  aurex
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5">
              {navItems.map((item) => (
                <div key={item.key}>
                  <Link
                    to={item.href}
                    className="flex items-center justify-between py-3 px-3 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:text-[#0A2463] transition-colors"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {t(`header.navItems.${item.key}`)}
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                  {item.key === "products" && (
                    <div className="ml-3 grid grid-cols-2 gap-1 border-l border-[#DCE6F8] pl-3 pb-2">
                      {megaCats.map((cat) => (
                        <Link
                          key={cat.slug}
                          to={`/produits/${cat.slug}`}
                          className="rounded-lg px-2 py-2 text-xs text-gray-500 hover:bg-[#EFF3FB] hover:text-[#0A2463]"
                        >
                          {t(`header.megaCategories.${cat.catKey}.label`)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link
                to="/comparateur"
                className="mt-2 flex items-center justify-between py-3 px-3 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:text-[#0A2463] transition-colors border-t border-gray-100 pt-3"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a3 3 0 01-3-3V6a3 3 0 013-3h14a3 3 0 013 3v7a3 3 0 01-3 3h-4l-4 4v-4z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18h6" />
                  </svg>
                  {t("header.comparator")}
                  {compareIds.length > 0 && (
                    <span className="min-w-4 h-4 px-1 inline-flex items-center justify-center bg-[#1E5EF3] text-white text-[10px] font-bold rounded-full font-sans leading-none">
                      {compareIds.length}
                    </span>
                  )}
                </span>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </nav>

            <div className="p-4 border-t border-gray-100 space-y-2">
              <Link
                to="/distributeurs"
                className="flex items-center justify-center gap-2 bg-[#1E5EF3] text-white font-medium py-3 rounded-lg hover:bg-[#1a51d4] transition-colors"
                style={{ fontFamily: "var(--font-sans)" }}
              >
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
                {t("common.whereToBuy")}
              </Link>
              <div className="flex items-center justify-center gap-2">
                {(["FR", "AR", "EN"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => changeLang(l.toLowerCase())}
                    className={`px-3 py-1.5 text-xs font-bold rounded border transition-colors ${
                      i18n.language === l.toLowerCase()
                        ? "bg-[#0A2463] text-white border-[#0A2463]"
                        : "text-gray-500 border-gray-200 hover:border-[#0A2463] hover:text-[#0A2463]"
                    }`}
                    style={{
                      fontFamily: "var(--font-display)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
