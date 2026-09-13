const url = 'https://wvcrpgvusehpdlwvizon.supabase.co'
const key = 'sb_publishable_2wsNwKo1O9j_Ico9KwhJGQ_QePBdkwK'
function ml(v, lang) {
  if (v == null) return ''
  if (typeof v === 'string') return v
  return v[lang] || v.fr || v.ar || v.en || ''
}
function tx(remote, fallback, lang) {
  if (lang === 'fr') return ml(remote, 'fr') || fallback
  return fallback
}
const r = await fetch(url + '/rest/v1/aurex_collections?select=items&collection_key=eq.heroSlides', {
  headers: { apikey: key, Authorization: 'Bearer ' + key },
})
const j = await r.json()
const items = j[0].items
for (const lang of ['fr', 'ar', 'en']) {
  console.log('--- ' + lang.toUpperCase() + ' ---')
  for (const s of items) {
    console.log(
      s.id,
      '| tag:', JSON.stringify(tx(s.tag, '', lang)),
      '| title:', JSON.stringify(tx(s.title, '', lang)),
      '| cta:', JSON.stringify(tx(s.cta, '', lang)),
    )
  }
}
