# AI Production Setup Guide

This document explains how to configure AI recommendations for production deployment.

## Environment Variables

Add these to your `.env` file for production:

```bash
# AI Model Configuration
EXPO_PUBLIC_AI_BASE_URL=https://your-ai-service.com
EXPO_PUBLIC_AI_MODEL=your-model-name

# OMDB API (required for poster images)
EXPO_PUBLIC_OMDB_API_KEY=your-omdb-api-key
```

## Production AI Options

### 1. OpenAI API (Recommended)

```bash
EXPO_PUBLIC_AI_BASE_URL=https://api.openai.com/v1/chat/completions
EXPO_PUBLIC_AI_MODEL=gpt-3.5-turbo
```

### 2. Anthropic Claude

```bash
EXPO_PUBLIC_AI_BASE_URL=https://api.anthropic.com/v1/messages
EXPO_PUBLIC_AI_MODEL=claude-3-haiku-20240307
```

### 3. Google Gemini

```bash
EXPO_PUBLIC_AI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/models
EXPO_PUBLIC_AI_MODEL=gemini-1.5-flash
```

### 4. Self-Hosted Ollama

```bash
EXPO_PUBLIC_AI_BASE_URL=https://your-ollama-server.com
EXPO_PUBLIC_AI_MODEL=llama3.1:8b
```

### 5. Groq (Fast & Affordable)

```bash
EXPO_PUBLIC_AI_BASE_URL=https://api.groq.com/openai/v1/chat/completions
EXPO_PUBLIC_AI_MODEL=llama3-8b-8192
```

## Cost Comparison (per 1K tokens)

| Service   | Model         | Cost   | Speed       |
| --------- | ------------- | ------ | ----------- |
| Groq      | Llama3 8B     | $0.05  | ⚡ Fastest  |
| OpenAI    | GPT-3.5 Turbo | $0.50  | 🚀 Fast     |
| Anthropic | Claude Haiku  | $0.25  | 🚀 Fast     |
| Google    | Gemini Flash  | $0.075 | 🚀 Fast     |
| Ollama    | Self-hosted   | Free   | 🐌 Variable |

## Implementation Notes

### API Compatibility

The current implementation expects an Ollama-compatible API. For other services, you'll need to modify the `callAI` method in `lib/ai-discovery.ts`.

### Example for OpenAI

```typescript
// In ai-discovery.ts callAI method
if (this.baseUrl.includes('openai.com')) {
  const response = await fetch(`${this.baseUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
    }),
  })

  const data = await response.json()
  return data.choices[0].message.content
}
```

## Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **Rate Limits**: Implement rate limiting for production
3. **Input Validation**: Sanitize user prompts before sending to AI
4. **Cost Monitoring**: Set up alerts for API usage costs

## Deployment Checklist

- [ ] Set up AI service account
- [ ] Get API keys and test endpoints
- [ ] Configure environment variables
- [ ] Test AI responses in staging
- [ ] Set up cost monitoring
- [ ] Implement error handling and fallbacks
- [ ] Test with production data volumes

## Fallback Strategy

The app includes fallback recommendations when AI services fail:

- Predefined popular shows
- Genre-based recommendations
- User preference matching

This ensures the app remains functional even during AI service outages.
