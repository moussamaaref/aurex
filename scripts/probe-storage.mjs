const url = 'https://wvcrpgvusehpdlwvizon.supabase.co'
const key = 'sb_publishable_2wsNwKo1O9j_Ico9KwhJGQ_QePBdkwK'
const H = { apikey: key, Authorization: 'Bearer ' + key }
const r = await fetch(url + '/storage/v1/object/list/aurex-media', {
  method: 'POST',
  headers: { ...H, 'Content-Type': 'application/json' },
  body: JSON.stringify({ prefix: '', limit: 1 }),
})
console.log('status:', r.status)
console.log((await r.text()).slice(0, 500))
