type AIREcommendationCategory =
  | 'similar'
  | 'trending'
  | 'hidden_gem'
  | 'mood_based'

export interface AIRecommendation {
  show: {
    Title: string
    Year: string
    imdbID: string
    Type: string
    Poster: string
  }
  reason: string
  confidence: number
  category: AIREcommendationCategory
}

// Generic AI response structure for show recommendations
export interface AIShowResponse {
  title: string
  year: string
  reason: string
  confidence: number
  imdbId?: string
  posterUrl?: string
}

// Generic prompt template for AI recommendations
export interface AIPromptTemplate {
  context: string
  count: number
  additionalInstructions?: string
}

const AI_RESPONSE_FIELDS = {
  title: 'Title',
  year: 'Year',
  reason: 'Brief reason for recommendation',
  confidence: 'Confidence score (0-1)',
  imdbId: 'IMDB ID if possible',
  posterUrl:
    'Poster URL (use TMDB/JustWatch/official sources, or placeholder if not found)',
}

export const generateAIPrompt = (template: AIPromptTemplate): string => {
  const { context, additionalInstructions } = template

  return `
    ${context}

    For each show, provide:
    1. ${AI_RESPONSE_FIELDS.title}
    2. ${AI_RESPONSE_FIELDS.year}
    3. ${AI_RESPONSE_FIELDS.reason}
    4. ${AI_RESPONSE_FIELDS.confidence}
    5. ${AI_RESPONSE_FIELDS.imdbId}
    6. ${AI_RESPONSE_FIELDS.posterUrl}

    ${additionalInstructions || ''}

    Format as JSON array with fields: title, year, reason, confidence, imdbId, posterUrl`
}
