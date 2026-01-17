const OMDB_BASE_URL = 'https://www.omdbapi.com/'
const allowedParams = new Set([
  's',
  'i',
  't',
  'type',
  'plot',
  'season',
  'page',
  'y',
])
const paramMap = new Map([['season', 'Season']])

export const handler = async (event) => {
  const headers = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, OPTIONS',
    'access-control-allow-headers': 'Content-Type',
  }

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '',
    }
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { ...headers, Allow: 'GET' },
      body: 'Method Not Allowed',
    }
  }

  const apiKey = process.env.OMDB_API_KEY
  if (!apiKey) {
    return {
      statusCode: 500,
      headers,
      body: 'OMDB API key is not configured.',
    }
  }

  const query = event.queryStringParameters || {}
  const url = new URL(OMDB_BASE_URL)
  url.searchParams.set('apikey', apiKey)

  let hasParams = false
  for (const [key, value] of Object.entries(query)) {
    if (!value || !allowedParams.has(key)) continue
    const mappedKey = paramMap.get(key) || key
    url.searchParams.set(mappedKey, value)
    hasParams = true
  }

  if (!hasParams) {
    return {
      statusCode: 400,
      headers,
      body: 'Missing or invalid query parameters.',
    }
  }

  const res = await fetch(url.toString())
  const body = await res.text()

  return {
    statusCode: res.status,
    headers: {
      ...headers,
      'content-type': res.headers.get('content-type') || 'application/json',
    },
    body,
  }
}
