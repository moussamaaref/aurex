const url = 'https://wvcrpgvusehpdlwvizon.supabase.co'
const key = 'sb_publishable_2wsNwKo1O9j_Ico9KwhJGQ_QePBdkwK'
const r = await fetch(url + '/rest/v1/aurex_collections?select=items,updated_at&collection_key=eq.stats', {
  headers: { apikey: key, Authorization: 'Bearer ' + key },
})
const j = await r.json()
console.log(JSON.stringify(j, null, 2).slice(0, 2000))
