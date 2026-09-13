import fs from 'fs'

// Convertit `EXPR || t(...)` en `tx(EXPR, t(...))` sur une ligne logique (t() peut être multiligne).
// Ne touche pas aux lignes déjà converties ni aux cas ambigus (rapportés pour revue manuelle).
const files = [
  'src/pages/HomePage.tsx',
  'src/pages/SmartHomePage.tsx',
  'src/pages/SupportPage.tsx',
  'src/pages/TechnologiesPage.tsx',
  'src/pages/NewsPage.tsx',
  'src/pages/AboutPage.tsx',
]

const STOP_CHARS = new Set(['{', '[', '(', ',', ';', '?', ':', '='])

let totalConverted = 0
const manual = []

for (const f of files) {
  let text = fs.readFileSync(f, 'utf8')
  const original = text

  // 1) import tx
  if (!text.includes('lib/langText')) {
    const m = text.match(/^import .*from "\.\.\/lib\/contentStore".*$/m)
    if (m) {
      text = text.replace(m[0], `${m[0]}\nimport { tx } from "../lib/langText"`)
    } else {
      manual.push(`${f}: import tx à ajouter manuellement`)
    }
  }

  // 2) remplacements
  let out = ''
  let i = 0
  let converted = 0
  while (true) {
    const idx = text.indexOf('|| t(', i)
    if (idx === -1) {
      out += text.slice(i)
      break
    }
    // vérifie le bord de mot : `|| t(` précédé d'un espace (évite `|| tx(` déjà converti — contient `|| tx(` pas `|| t(`... `tx(` contient `x(` ; `|| tx(` : après `|| ` vient `tx(`, donc '|| t(' ne matche pas. OK)
    // scan gauche avec profondeur
    let j = idx - 1
    while (j >= 0 && text[j] === ' ') j--
    let depthParen = 0
    let depthBracket = 0
    let start = -1
    let stopKind = null
    for (let k = j; k >= 0; k--) {
      const c = text[k]
      if (c === ')') depthParen++
      else if (c === '(') {
        if (depthParen > 0) depthParen--
        else {
          // '(' à profondeur 0 : fait partie d'un appel englobant ? on continue sauf délimiteur
          // ex: t(feat.titleKey) n'est pas à gauche. Ici ex: foo(bar || t()) -> stop à '('
          start = k + 1
          stopKind = '('
          break
        }
      } else if (c === ']') depthBracket++
      else if (c === '[') {
        if (depthBracket > 0) depthBracket--
        else {
          start = k + 1
          stopKind = '['
          break
        }
      } else if (depthParen === 0 && depthBracket === 0) {
        if (c === '\n') {
          start = k + 1
          stopKind = 'newline'
          break
        }
        if (STOP_CHARS.has(c)) {
          start = k + 1
          stopKind = c
          break
        }
        // détecte || et && à profondeur 0
        if (c === '|' && text[k - 1] === '|') {
          start = -2
          stopKind = 'multi-or'
          break
        }
        if (c === '&' && text[k - 1] === '&') {
          start = -2
          stopKind = 'and'
          break
        }
      }
      if (k === 0) {
        start = 0
        stopKind = 'bof'
      }
    }
    if (start === -2) {
      // cas ambigu : reporte la ligne pour revue manuelle
      const lineNo = text.slice(0, idx).split('\n').length
      manual.push(`${f}:${lineNo} [${stopKind}] : ${text.slice(Math.max(0, idx - 60), idx + 40).replace(/\n/g, ' ')}`)
      out += text.slice(i, idx + 5)
      i = idx + 5
      continue
    }
    // vérifie comparaison (a === b || t()) : le segment contient ==, !=, <=, >= ?
    let left = text.slice(start, idx).trim()
    // retire un éventuel 'return ' initial
    left = left.replace(/^return\s+/, '')
    if (/[=!<>]=|!==/.test(left)) {
      const lineNo = text.slice(0, idx).split('\n').length
      manual.push(`${f}:${lineNo} [comparaison] : ${left.slice(0, 80)}`)
      out += text.slice(i, idx + 5)
      i = idx + 5
      continue
    }
    if (!left) {
      const lineNo = text.slice(0, idx).split('\n').length
      manual.push(`${f}:${lineNo} [vide]`)
      out += text.slice(i, idx + 5)
      i = idx + 5
      continue
    }
    // scan droit : parenthèses équilibrées depuis t(
    const tStart = idx + 3 // position de 't('
    let d = 0
    let p = tStart
    let inStr = null
    for (; p < text.length; p++) {
      const c = text[p]
      if (inStr) {
        if (c === '\\') {
          p++
          continue
        }
        if (c === inStr) inStr = null
        continue
      }
      if (c === '"' || c === "'" || c === '`') {
        inStr = c
        continue
      }
      if (c === '(') d++
      else if (c === ')') {
        d--
        if (d === 0) break
      }
    }
    if (d !== 0) {
      const lineNo = text.slice(0, idx).split('\n').length
      manual.push(`${f}:${lineNo} [parenthèses]`)
      out += text.slice(i, idx + 5)
      i = idx + 5
      continue
    }
    const tCall = text.slice(tStart, p + 1)
    out += text.slice(i, start) + `tx(${left}, ${tCall})`
    i = p + 1
    converted++
  }
  if (out !== original) {
    fs.writeFileSync(f, out, 'utf8')
  }
  totalConverted += converted
  console.log(`${f}: ${converted} conversion(s)`)
}

console.log(`\nTotal: ${totalConverted}`)
console.log(`\n--- Revue manuelle (${manual.length}) ---`)
manual.forEach((m) => console.log('  ' + m))
