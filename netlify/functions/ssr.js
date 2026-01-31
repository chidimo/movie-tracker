const path = require('node:path')
const { pathToFileURL } = require('node:url')

const serverEntryPath = path.resolve(__dirname, '../../dist/server/server.js')
const serverEntryUrl = pathToFileURL(serverEntryPath).href

async function loadServer() {
  const mod = await import(serverEntryUrl)
  return mod.default
}

exports.handler = async (event) => {
  const server = await loadServer()
  const url = new URL(
    event.rawUrl || `https://${event.headers.host}${event.path}`,
  )

  if (!event.rawUrl && event.queryStringParameters) {
    for (const [key, value] of Object.entries(event.queryStringParameters)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value))
      }
    }
  }

  const init = {
    method: event.httpMethod,
    headers: event.headers,
  }

  if (event.body) {
    init.body = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64')
      : event.body
  }

  const response = await server.fetch(new Request(url.toString(), init))
  const body = await response.text()

  return {
    statusCode: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body,
  }
}
