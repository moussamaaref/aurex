import fs from 'fs'

function loadLocale(file) {
  let t = fs.readFileSync(file, 'utf8')
  const m = t.match(/export default (\w+);?/)
  const name = m ? m[1] : null
  t = t.replace(/export default \w+;?/, '')
  const fn = new Function(`${t}; return ${name};`)
  return fn()
}

function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out)
    else out[key] = v
  }
  return out
}

const fr = flatten(loadLocale('src/i18n/locales/fr.ts'))
const en = flatten(loadLocale('src/i18n/locales/en.ts'))
const ar = flatten(loadLocale('src/i18n/locales/ar.ts'))

const frKeys = new Set(Object.keys(fr))
const enKeys = new Set(Object.keys(en))
const arKeys = new Set(Object.keys(ar))

console.log(`FR: ${frKeys.size} clés | EN: ${enKeys.size} | AR: ${arKeys.size}\n`)

const missingEn = [...frKeys].filter((k) => !enKeys.has(k))
const missingAr = [...frKeys].filter((k) => !arKeys.has(k))
const extraEn = [...enKeys].filter((k) => !frKeys.has(k))
const extraAr = [...arKeys].filter((k) => !frKeys.has(k))

console.log(`--- Manquantes en EN (${missingEn.length}) ---`)
missingEn.forEach((k) => console.log('  EN ✗', k))
console.log(`\n--- Manquantes en AR (${missingAr.length}) ---`)
missingAr.forEach((k) => console.log('  AR ✗', k))
console.log(`\n--- En trop en EN (${extraEn.length}) ---`)
extraEn.forEach((k) => console.log('  EN +', k))
console.log(`\n--- En trop en AR (${extraAr.length}) ---`)
extraAr.forEach((k) => console.log('  AR +', k))

// Clés utilisées dans le code mais absentes de FR
import { execSync } from 'child_process'
