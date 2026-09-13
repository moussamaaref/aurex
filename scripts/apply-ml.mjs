import fs from 'fs'

// Enveloppe les affichages de données CMS avec ml() :
//   {p.name} -> {ml(p.name)} ,  alt={p.name} -> alt={ml(p.name)} ,  name: p.name -> name: ml(p.name)
// ml() est transparent pour les chaînes simples : sans danger hors CMS.
const files = [
  'src/pages/ProductsPage.tsx',
  'src/pages/ProductDetailPage.tsx',
  'src/pages/ComparePage.tsx',
  'src/pages/HomePage.tsx',
  'src/pages/TechnologiesPage.tsx',
  'src/pages/NewsPage.tsx',
  'src/pages/DistributorsPage.tsx',
  'src/pages/SmartHomePage.tsx',
  'src/pages/SupportPage.tsx',
]

const OBJS = 'p|product|cat|tech|news|selected|distributor|replacingProduct|currentCategory'
const FIELDS = 'name|description|label|benefit|title|excerpt|address|commune|wilaya|category'

let total = 0
for (const f of files) {
  let text = fs.readFileSync(f, 'utf8')
  const original = text
  if (!text.includes('lib/ml')) {
    const m = text.match(/^import .*from "\.\.\/lib\/contentStore".*$/m)
    if (m) {
      text = text.replace(m[0], `${m[0]}\nimport { ml } from "../lib/ml"`)
    } else {
      console.log(`${f}: !! import ml à ajouter manuellement`)
    }
  }
  // Passe déterministe : pattern {X} et name: X
  const applyDisplay = (t) =>
    t.replace(
      new RegExp(`\\{((?:${OBJS})\\.(?:${FIELDS}))\\}`, 'g'),
      (m, e) => (m.includes('ml(') ? m : `{ml(${e})}`),
    )
  const before = text
  text = applyDisplay(text)
  text = text.replace(
    new RegExp(`(\\bname:\\s*)((?:${OBJS})\\.name)`, 'g'),
    (m, pre, e) => (m.includes('ml(') ? m : `${pre}ml(${e})`),
  )
  if (text !== before) {
    // compte les ml( ajoutés sur cette passe
    const added = (text.match(/\{ml\(/g) || []).length - (before.match(/\{ml\(/g) || []).length
    const addedName = (text.match(/name: ml\(/g) || []).length - (before.match(/name: ml\(/g) || []).length
    console.log(`${f}: +${added} affichages, +${addedName} name:`)
    total += added + addedName
  } else {
    console.log(`${f}: aucun changement`)
  }
  if (text !== original) fs.writeFileSync(f, text, 'utf8')
}
console.log(`Total: ${total}`)
