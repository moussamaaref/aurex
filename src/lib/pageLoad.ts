/** Vrai quand la page courante a été chargée par un rechargement (F5 / bouton actualiser). */
export const IS_PAGE_RELOAD: boolean = (() => {
  try {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined
    return nav?.type === "reload"
  } catch {
    return false
  }
})()

/** Au rechargement, la sélection du comparateur présente dans l'URL (?ids=…) est ignorée :
 *  uniquement pendant l'initialisation de la page (stable même si l'effet s'exécute deux fois en développement). */
export function shouldIgnoreUrlSelection(): boolean {
  return IS_PAGE_RELOAD && performance.now() < 5000
}
