const url = 'https://wvcrpgvusehpdlwvizon.supabase.co'
const key = 'sb_publishable_2wsNwKo1O9j_Ico9KwhJGQ_QePBdkwK'
const H = { apikey: key, Authorization: 'Bearer ' + key }

const tables = ['categories', 'products', 'technologies', 'news', 'faq', 'distributors', 'pages', 'site_settings', 'profiles', 'audit_logs']
for (const tb of tables) {
  try {
    const r = await fetch(url + '/rest/v1/' + tb + '?select=*&limit=1', { headers: H })
    const j = await r.json()
    console.log(tb + ': ' + r.status + ' (lignes: ' + (Array.isArray(j) ? j.length : '?') + ')')
  } catch (e) {
    console.log(tb + ': ERR ' + e.message)
  }
}
const cols = ['heroSlides', 'stats', 'marquee', 'campaign', 'homeSections', 'smartPage', 'techPage', 'newsPage', 'aboutPage', 'supportPage']
for (const c of cols) {
  try {
    const r = await fetch(url + '/rest/v1/aurex_collections?select=collection_key&collection_key=eq.' + c, { headers: H })
    const j = await r.json()
    console.log('col ' + c + ': ' + (j.length ? 'OK' : 'VIDE'))
  } catch (e) {
    console.log('col ' + c + ': ERR')
  }
}
try {
  const r = await fetch(url + '/storage/v1/object/list/aurex-media', {
    method: 'POST',
    headers: { ...H, 'Content-Type': 'application/json' },
    body: JSON.stringify({ limit: 1 }),
  })
  console.log('storage aurex-media: ' + r.status)
} catch (e) {
  console.log('storage: ERR ' + e.message)
}
