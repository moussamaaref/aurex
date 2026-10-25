import { useMemo } from "react"
import { products } from "../data"
import { useP, type L3 } from "../content/lang"
import { smartTech } from "../content/smartTech"
import SmartTechSection from "../components/SmartTechSection"
import LineUpCard from "../components/LineUpCard"
import Reveal from "../components/Reveal"
import Icon from "../components/Icon"

const APP_URL = (import.meta.env.VITE_APP_DOWNLOAD_URL as string | undefined) || ""

const appText = {
  title: { fr: "L'application AUREX", en: "The AUREX app", ar: "تطبيق AUREX" } as L3,
  text: {
    fr: "Gérez les fonctions prises en charge par vos appareils compatibles depuis votre smartphone.",
    en: "Manage the supported functions of your compatible appliances from your smartphone.",
    ar: "تحكّموا في الوظائف المدعومة بأجهزتكم المتوافقة من هاتفكم الذكي.",
  } as L3,
  soon: {
    fr: "Le lien de téléchargement sera disponible prochainement.",
    en: "The download link will be available soon.",
    ar: "سيتوفر رابط التحميل قريبًا.",
  } as L3,
  productsText: {
    fr: "Appareils de la gamme compatibles avec la connectivité Wi-Fi et Bluetooth.",
    en: "Appliances in the range that support Wi-Fi and Bluetooth connectivity.",
    ar: "أجهزة من التشكيلة تدعم الاتصال عبر Wi-Fi وBluetooth.",
  } as L3,
  card: { fr: "Découvrir le produit", en: "Discover the product", ar: "اكتشفوا المنتج" } as L3,
}

export default function SmartTechPage() {
  const { p } = useP()
  const connected = useMemo(() => products.filter((x) => x.connectivity).slice(0, 8), [])

  return (
    <div className="bg-[#f5f5f7] pt-28">
      <header className="mx-auto max-w-7xl px-6 pb-12">
        <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight text-[#1d1d1f] lg:text-[64px]" style={{ fontFamily: "var(--font-display)" }}>
          {p({ fr: "Smart Tech — contrôle d'un seul geste.", en: "Smart Tech — One Touch Control.", ar: "Smart Tech — تحكّم بلمسة واحدة." })}
        </h1>
      </header>

      <SmartTechSection showApp />

      <section id="application" className="mx-auto mt-16 max-w-7xl scroll-mt-28 px-6">
        <div className="flex flex-col gap-6 rounded-[28px] bg-white p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <h2 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]" style={{ fontFamily: "var(--font-display)" }}>
              {p(appText.title)}
            </h2>
            <p className="mt-2 max-w-xl text-[17px] text-[#474747]">{p(appText.text)}</p>
          </div>
          {APP_URL ? (
            <a href={APP_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--color-accent)] px-7 text-[15px] font-semibold text-white transition-colors hover:bg-[#00628f] active:scale-[0.98]">
              {p(smartTech.appCta)}
              <Icon name="arrow" className="h-4 w-4 rtl:-scale-x-100" strokeWidth={2} />
            </a>
          ) : (
            <p className="text-sm font-medium text-[#5a5a5e]">{p(appText.soon)}</p>
          )}
        </div>
      </section>

      {connected.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-20">
          <Reveal>
            <h2 className="text-4xl font-semibold leading-none tracking-tight text-[#1d1d1f] lg:text-[40px]" style={{ fontFamily: "var(--font-display)" }}>
              {p(smartTech.connectedProducts)}
            </h2>
            <p className="mt-3 text-[17px] text-[#474747]">{p(appText.productsText)}</p>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {connected.map((product, i) => (
              <Reveal key={product.id} delay={Math.min(i, 3) * 80} className="h-full">
                <LineUpCard product={product} cta={p(appText.card)} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
