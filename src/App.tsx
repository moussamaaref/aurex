import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { CompareProvider } from "./context/CompareContext"
import CompareToast from "./components/CompareToast"
import HomePage from "./pages/HomePage"
import ProductsPage from "./pages/ProductsPage"
import ProductDetailPage from "./pages/ProductDetailPage"
import ComparePage from "./pages/ComparePage"
import SmartHomePage from "./pages/SmartHomePage"
import TechnologiesPage from "./pages/TechnologiesPage"
import SupportPage from "./pages/SupportPage"
import AboutPage from "./pages/AboutPage"
import DistributorsPage from "./pages/DistributorsPage"
import NewsPage from "./pages/NewsPage"

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [pathname])
  return null
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
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
  }, [i18n.language])
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <RtlHandler>
        <ScrollToTop />
        <CompareProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/produits" element={<ProductsPage />} />
              <Route path="/produits/:category" element={<ProductsPage />} />
              <Route
                path="/produits/:category/:id"
                element={<ProductDetailPage />}
              />
              <Route path="/comparateur" element={<ComparePage />} />
              <Route path="/smart-home" element={<SmartHomePage />} />
              <Route path="/technologies" element={<TechnologiesPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/a-propos" element={<AboutPage />} />
              <Route path="/distributeurs" element={<DistributorsPage />} />
              <Route path="/actualites" element={<NewsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          <CompareToast />
        </CompareProvider>
      </RtlHandler>
    </BrowserRouter>
  )
}
