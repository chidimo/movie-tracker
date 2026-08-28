// Plain-LLM AI features — no catalogue context needed, the model already
// knows about movies. Reuses the multi-provider `aiDiscovery.callAI()` client
// (Groq/OpenAI/Ollama, configured via EXPO_PUBLIC_AI_* env vars) instead of
// calling a specific provider directly, so these features work with whatever
// provider the app is already configured for.
import { aiDiscovery } from './ai-discovery'
import { Logger } from './logger'
import type { MovieContext, MovieTags, SearchFilters } from './ai-types'

function extractJson(text: string): string {
  const objectMatch = /\{[\s\S]*\}/.exec(text)
  if (objectMatch) return objectMatch[0]
  return text.replace(/```json|```/g, '').trim()
}

function formatMovieContext(movie: MovieContext): string {
  return [
    `Title: ${movie.title} (${movie.year})`,
    `Genres: ${movie.genres.join(', ')}`,
    movie.director ? `Director: ${movie.director}` : undefined,
    movie.synopsis ? `Synopsis: ${movie.synopsis}` : undefined,
  ]
    .filter(Boolean)
    .join('\n')
}

/**
 * Let users ask anything about a specific movie, e.g.
 * "Is this suitable for kids?" or "Who directed this and what's their style?"
 */
export async function askAboutMovie(
  question: string,
  movie: MovieContext,
): Promise<string | null> {
  const prompt = `You are a knowledgeable and enthusiastic film expert inside a movie cataloguing app.
Answer concisely (2-4 sentences unless more detail is needed). Be spoiler-conscious — warn before revealing plot details.

${formatMovieContext(movie)}

User's question: ${question}`

  try {
    return await aiDiscovery.callAI(prompt)
  } catch (error) {
    Logger.error('askAboutMovie failed', error)
    return null
  }
}

/**
 * Auto-generate mood/vibe tags for a movie when it's added to the catalogue.
 */
export async function autoTagMovie(
  movie: MovieContext,
): Promise<MovieTags | null> {
  const prompt = `You are a movie tagging assistant. Given a film's details, generate metadata tags.
Respond ONLY with a JSON object matching this schema exactly — no markdown, no extra text:
{
  "mood": ["<tag>", ...],       // 2-4 mood/vibe words
  "occasion": ["<tag>", ...],   // 1-3 occasion tags from: solo watch, date night, family, friends, background watch
  "pacing": "<value>",          // one of: slow burn, balanced, fast-paced
  "rewatchable": <boolean>
}

${formatMovieContext(movie)}`

  try {
    const text = await aiDiscovery.callAI(prompt)
    return JSON.parse(extractJson(text)) as MovieTags
  } catch (error) {
    Logger.error('autoTagMovie failed', error)
    return null
  }
}

/**
 * Convert a natural language search query into structured filters,
 * e.g. "dark comedies I haven't watched yet" ->
 *   { genres: ["Comedy"], mood: ["dark"], watched: false }
 */
export async function naturalLanguageToFilters(
  query: string,
): Promise<SearchFilters | null> {
  const prompt = `You translate natural language movie search queries into filter JSON.
Respond ONLY with a JSON object. No extra text.
Available fields:
{
  "genres": [],        // from: Action, Comedy, Drama, Horror, Sci-Fi, Thriller, Romance, Animation, Documentary, Crime
  "mood": [],          // from: dark, funny, uplifting, tense, thought-provoking, feel-good, emotional
  "watched": null,     // true = watched only, false = unwatched only, null = both
  "pacing": null,      // "slow burn" | "fast-paced" | "balanced" | null
  "occasion": []       // from: date night, solo watch, family, friends, background watch
}
Only include fields that are clearly implied by the query. Use null/empty for unspecified fields.

Search query: "${query}"`

  try {
    const text = await aiDiscovery.callAI(prompt)
    return JSON.parse(extractJson(text)) as SearchFilters
  } catch (error) {
    Logger.error('naturalLanguageToFilters failed', error)
    return null
  }
}
