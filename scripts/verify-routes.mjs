const BASE = process.env.AUREX_URL || "https://aurex-one.vercel.app"
const routes = [
  { path: "/", expect: 200 },
  { path: "/produits", expect: 200 },
  { path: "/produits/lavage", expect: 200 },
  { path: "/distributeurs", expect: 200 },
  { path: "/technologies", expect: 200 },
  { path: "/actualites", expect: 200 },
  { path: "/admin", expect: 200 },
]

let failed = 0
for (const r of routes) {
  const url = BASE + r.path
  try {
    const res = await fetch(url, { redirect: "follow" })
    const ok = res.status === r.expect
    console.log(`${ok ? "✓" : "✗"} ${r.path} → ${res.status} ${ok ? "" : `(attendu ${r.expect})`}`)
    if (!ok) failed++
  } catch (e) {
    console.log(`✗ ${r.path} → erreur ${e.message}`)
    failed++
  }
}

// Vérifie que le JS principal est chargé (bundle splitté)
try {
  const html = await (await fetch(BASE + "/")).text()
  const hasModule = html.includes('type="module"') || html.includes("/assets/")
  console.log(`${hasModule ? "✓" : "✗"} HTML contient assets modulaires`)
  if (!hasModule) failed++
} catch {}

process.exit(failed > 0 ? 1 : 0)
