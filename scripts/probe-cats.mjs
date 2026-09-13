const url = 'https://wvcrpgvusehpdlwvizon.supabase.co'
const key = 'sb_publishable_2wsNwKo1O9j_Ico9KwhJGQ_QePBdkwK'
const H = { apikey: key, Authorization: 'Bearer ' + key }
const rc = await fetch(url + '/rest/v1/categories?select=slug,label', { headers: H }).then((r) => r.json())
console.log('CATEGORIES:', JSON.stringify(rc.map((c) => c.slug)))
const rp = await fetch(url + '/rest/v1/products?select=id,category_slug', { headers: H }).then((r) => r.json())
console.log('PRODUCTS:', JSON.stringify(rp.map((p) => [p.id, p.category_slug])))
const ra = await fetch(url + '/rest/v1/aurex_collections?select=collection_key', { headers: H }).then((r) => r.json())
console.log('COLLECTIONS:', JSON.stringify(ra.map((c) => c.collection_key)))
