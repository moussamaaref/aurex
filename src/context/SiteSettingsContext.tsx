import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { loadSiteSettings, getDefaultSiteSettings, type SiteSettings } from "../lib/contentStore"

type SiteSettingsContextValue = {
  settings: SiteSettings
  loading: boolean
  refresh: () => Promise<void>
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: getDefaultSiteSettings(),
  loading: true,
  refresh: async () => {},
})

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const cached = localStorage.getItem("aurex-site-settings")
      if (cached) return { ...getDefaultSiteSettings(), ...JSON.parse(cached) }
    } catch {
      // ignore
    }
    return getDefaultSiteSettings()
  })
  const [loading, setLoading] = useState(true)

  const applyTheme = (s: SiteSettings) => {
    document.documentElement.style.setProperty("--color-primary", s.primaryColor)
    document.documentElement.style.setProperty("--color-accent", s.accentColor)
    document.documentElement.style.setProperty("--color-surface", s.surfaceColor)
    if (s.faviconUrl) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
      if (!link) {
        link = document.createElement("link")
        link.rel = "icon"
        document.head.appendChild(link)
      }
      link.href = s.faviconUrl
    }
  }

  const refresh = async () => {
    try {
      const remote = await loadSiteSettings()
      if (remote) {
        setSettings(remote)
        localStorage.setItem("aurex-site-settings", JSON.stringify(remote))
        applyTheme(remote)
      }
    } catch {
      // keep fallback
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    applyTheme(settings)
    void refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, refresh }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}
