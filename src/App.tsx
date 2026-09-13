import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { useEffect, lazy, Suspense } from "react"
import { useTranslation } from "react-i18next"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { CompareProvider } from "./context/CompareContext"
import { SiteSettingsProvider } from "./context/SiteSettingsContext"
import CompareToast from "./components/CompareToast"
import { loadNormalizedCollections, loadPublicPages } from "./lib/contentStore"

const HomePage = lazy(() => import("./pages/HomePage"))
const ProductsPage = lazy(() => import("./pages/ProductsPage"))
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"))
const ComparePage = lazy(() => import("./pages/ComparePage"))
const SmartHomePage = lazy(() => import("./pages/SmartHomePage"))
const TechnologiesPage = lazy(() => import("./pages/TechnologiesPage"))
const SupportPage = lazy(() => import("./pages/SupportPage"))
const AboutPage = lazy(() => import("./pages/AboutPage"))
const DistributorsPage = lazy(() => import("./pages/DistributorsPage"))
const NewsPage = lazy(() => import("./pages/NewsPage"))
const AdminPage = lazy(() => import("./pages/AdminPage"))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [pathname])
  return null
}

function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith("/admin")
  return (
    <div className="min-h-screen flex flex-col">
      {!isAdmin && <Header />}
      <main className="flex-1">{children}</main>
      {!isAdmin && <Footer />}
    </div>
  )
}

function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB] pt-24 px-6 text-center">
      <p
        className="text-6xl font-bold text-[#0A2463]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        404
      </p>
      <h1
        className="text-2xl font-bold text-gray-900 mt-4"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {t("notFound.title")}
      </h1>
      <p className="text-gray-500 mt-2 font-sans text-sm">
        {t("notFound.desc")}
      </p>
      <a
        href="/"
        className="mt-8 bg-[#0A2463] text-white font-semibold px-6 py-3 rounded-xl text-sm font-sans hover:bg-[#061540] transition-colors inline-flex"
      >
        {t("notFound.backHome")}
      </a>
    </div>
  )
}

function RtlHandler({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation()
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = i18n.language
    try {
      const theme = localStorage.getItem("aurex-admin-theme")
      const pages = localStorage.getItem("aurex-admin-pages")
      if (theme) {
        const values = JSON.parse(theme) as { primary?: string; accent?: string; surface?: string }
        if (values.primary) document.documentElement.style.setProperty("--color-primary", values.primary)
        if (values.accent) document.documentElement.style.setProperty("--color-accent", values.accent)
        if (values.surface) document.documentElement.style.setProperty("--color-surface", values.surface)
      }

      if (pages) {
        const values = JSON.parse(pages) as { seo?: { title?: string; description?: string } }
        if (values.seo?.title) document.title = values.seo.title
        if (values.seo?.description) {
          document.querySelector('meta[name="description"]')?.setAttribute("content", values.seo.description)
        }
      }
    } catch {
      // Ignore malformed optional admin settings and keep the default public theme.
    }
  }, [i18n.language])
  return <>{children}</>
}

function RemoteContentSync() {
  useEffect(() => {
    if (sessionStorage.getItem("aurex-content-sync")) return
    void loadNormalizedCollections()
      .then((collections) => {
        if (!collections) return
        Object.entries(collections).forEach(([key, items]) => {
          localStorage.setItem(`aurex-data-${key}`, JSON.stringify(items))
        })
        sessionStorage.setItem("aurex-content-sync", "1")
        window.location.reload()
      })
      .catch((error: unknown) => {
        console.warn("AUREX remote content is not available yet.", error)
      })
  }, [])
  return null
}

function PageSeoSync() {
  const { pathname } = useLocation()
  useEffect(() => {
    const applyFromCache = () => {
      try {
        const cached = localStorage.getItem("aurex-data-pages")
        if (!cached) return
        const pages = JSON.parse(cached) as Array<{ slug: string; title: string; description: string; seoTitle?: string | null; seoDescription?: string | null; seoKeywords?: string | null }>
        const slug = pathname === "/" ? "home" : pathname.split("/").filter(Boolean)[0] ?? "home"
        const page = pages.find((p) => p.slug === slug)
        if (!page) return
        if (page.seoTitle) document.title = page.seoTitle
        else if (page.title) document.title = page.title
        const desc = page.seoDescription ?? page.description
        if (desc) document.querySelector('meta[name="description"]')?.setAttribute("content", desc)
        if (page.seoKeywords) {
          let kw = document.querySelector('meta[name="keywords"]')
          if (!kw) {
            kw = document.createElement("meta")
            kw.setAttribute("name", "keywords")
            document.head.appendChild(kw)
          }
          kw.setAttribute("content", page.seoKeywords)
        }
      } catch {
        // ignore
      }
    }
    applyFromCache()
    void loadPublicPages()
      .then((pages) => {
        if (!pages || pages.length === 0) return
        localStorage.setItem("aurex-data-pages", JSON.stringify(pages))
        applyFromCache()
      })
      .catch(() => {
        // keep cache
      })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <RtlHandler>
        <ScrollToTop />
        <RemoteContentSync />
        <PageSeoSync />
        <SiteSettingsProvider>
          <CompareProvider>
            <Layout>
              <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#1E5EF3]" /></div>}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/produits" element={<ProductsPage />} />
                  <Route path="/produits/:category" element={<ProductsPage />} />
                  <Route path="/produits/:category/:id" element={<ProductDetailPage />} />
                  <Route path="/comparateur" element={<ComparePage />} />
                  <Route path="/smart-home" element={<SmartHomePage />} />
                  <Route path="/technologies" element={<TechnologiesPage />} />
                  <Route path="/support" element={<SupportPage />} />
                  <Route path="/a-propos" element={<AboutPage />} />
                  <Route path="/distributeurs" element={<DistributorsPage />} />
                  <Route path="/actualites" element={<NewsPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Layout>
            <CompareToast />
          </CompareProvider>
        </SiteSettingsProvider>
      </RtlHandler>
    </BrowserRouter>
  )
}
