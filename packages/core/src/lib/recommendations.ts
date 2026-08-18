// Naive RAG-based catalogue recommender.
//
// "Naive RAG" skips a vector database: we fetch the relevant rows directly
// (the user's top-rated watched movies + their unwatched candidate pool),
// format them as text, and inject them into the prompt as context. A vector
// DB only becomes worthwhile once the catalogue grows very large (10k+).
//
// Flow: watched (taste signal) + unwatched (candidate pool) -> prompt ->
// aiDiscovery.callAI() -> recommendations picked only from the unwatched pool.
import { aiDiscovery } from './ai-discovery'
import { Logger } from './logger'
import type { CatalogueMovie, CatalogueRecommendation } from './ai-types'

function formatMovie(m: CatalogueMovie): string {
  return (
    `- "${m.title}" (${m.year}) | Genres: ${m.genres.join(', ')}` +
    (m.director ? ` | Director: ${m.director}` : '') +
    (m.userRating ? ` | Your rating: ${m.userRating}/5` : '')
  )
}

export async function getPersonalisedRecommendations(
  allUserMovies: Array<CatalogueMovie>,
  maxRecommendations = 5,
): Promise<Array<CatalogueRecommendation>> {
  const watched = allUserMovies
    .filter((m) => m.watched && m.userRating !== undefined)
    .sort((a, b) => (b.userRating ?? 0) - (a.userRating ?? 0))
    .slice(0, 20) // top 20 rated as taste signal

  const unwatched = allUserMovies.filter((m) => !m.watched).slice(0, 50) // candidate pool, capped to avoid huge prompts

  if (unwatched.length === 0) {
    return []
  }

  const prompt = `You are a personalised movie recommendation engine for a film cataloguing app.
You will be given:
  1. A user's watch history with their ratings
  2. A list of movies in their catalogue they haven't watched yet

Your job is to pick the ${maxRecommendations} best matches from the UNWATCHED list only.
You must ONLY recommend movies from the unwatched list provided — never suggest films outside it.

Respond with a JSON array and nothing else. No markdown, no explanation outside the JSON.
Schema:
[
  {
    "movieId": "<id from the unwatched list>",
    "title": "<movie title>",
    "reason": "<1-2 sentence personalised reason referencing their taste>",
    "matchScore": <integer 1-10>
  }
]

WATCH HISTORY (rated highest to lowest):
${watched.map(formatMovie).join('\n') || 'No watch history yet.'}

UNWATCHED MOVIES IN MY CATALOGUE:
${unwatched.map(formatMovie).join('\n')}

Please recommend the ${maxRecommendations} best matches for me from my unwatched list.`

  try {
    const text = await aiDiscovery.callAI(prompt)
    const jsonMatch = /\[[\s\S]*\]/.exec(text)
    if (!jsonMatch) throw new Error('No JSON array found in AI response')
    return JSON.parse(jsonMatch[0]) as Array<CatalogueRecommendation>
  } catch (error) {
    Logger.error('getPersonalisedRecommendations failed', error)
    return []
  }
}
