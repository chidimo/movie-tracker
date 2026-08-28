// Test script to verify AI connectivity
// Run this in your browser console or Node.js to test

// Load environment variables from .env file
require('dotenv').config()

const testAIConnection = async (baseUrl, apiKey, provider = 'ollama') => {
  const cloudProviders = new Set(['groq', 'openai'])
  try {
    console.log(`Testing connection to: ${baseUrl} (${provider})`)

    let response
    let requestBody

    if (cloudProviders.has(provider)) {
      // OpenAI-compatible API format
      requestBody = {
        model: provider === 'groq' ? 'llama-3.1-8b-instant' : 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: 'Say "Hello World"',
          },
        ],
        temperature: 0.7,
        max_tokens: 100,
        stream: false,
      }

      response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      })
    } else {
      // Ollama API format
      requestBody = {
        model: 'gemma2:2b',
        prompt: 'Say "Hello World"',
        stream: false,
        options: {
          temperature: 0.7,
          max_tokens: 100,
        },
      }

      response = await fetch(`${baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ HTTP ${response.status}: ${response.statusText}`)
      console.error(`❌ Error details:`, errorText)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    let responseText
    if (cloudProviders.has(provider)) {
      responseText = data.choices?.[0]?.message?.content || ''
    } else {
      responseText = data.response || ''
    }

    console.log(`Connection to ${baseUrl} ✅ Succeeded!!!!`, responseText)
    return true
  } catch (error) {
    console.error(`Connection to ${baseUrl} ❌ Failed:`, error.message)
    return false
  }
}

// Test different configurations
console.log('🧪 Testing AI Connections...\n')

// Test Ollama locally
testAIConnection('http://localhost:11434', null, 'ollama')
testAIConnection('http://127.0.0.1:11434', null, 'ollama')

// Test Groq (add your API key here)
const GROQ_API_KEY =
  process.env.EXPO_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY

if (GROQ_API_KEY) {
  testAIConnection(
    'https://api.groq.com/openai/v1/chat/completions',
    GROQ_API_KEY,
    'groq',
  )
} else {
  console.log('⚠️  Add your Groq API key to test Groq connection')
  console.log('   Options:')
  console.log('   1. Add to .env: EXPO_PUBLIC_GROQ_API_KEY=gsk_your_key')
  console.log('   2. Add to .env: GROQ_API_KEY=gsk_your_key')
  console.log('   3. Use EAS secrets for production')
}
