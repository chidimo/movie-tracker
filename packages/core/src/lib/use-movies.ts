import { createMobileOmdbFunctions, createWebOmdbFunctions } from './omdb'

// Platform-specific OMDB functions
const getOmdbFunctions = () => {
  // Check if we're in a mobile environment
  if (typeof process !== 'undefined' && process.env.EXPO_PUBLIC_OMDB_API_KEY) {
    return createMobileOmdbFunctions(process.env.EXPO_PUBLIC_OMDB_API_KEY)
  }

  // Default to web environment - check for development at runtime
  const isDevelopment = () => {
    if (
      typeof globalThis !== 'undefined' &&
      globalThis.window?.location?.hostname === 'localhost'
    ) {
      return true
    }
    return false
  }

  console.log('Environment detection function created')

  return createWebOmdbFunctions({
    omdbFunctionPath: isDevelopment()
      ? '/api/omdb'
      : '/.netlify/functions/omdb',
  })
}

const { omdbGetSeason, omdbGetTitle, omdbSearch } = getOmdbFunctions()

// Export the raw functions for custom hook creation
export { omdbGetSeason, omdbGetTitle, omdbSearch, getOmdbFunctions }
export { normalizeOmdbShow } from './compute-omdb'

// Export types for external use
export type SearchOptionsType = {
  enabled?: boolean
}

export type SeasonOptionsType = {
  enabled?: boolean
}

export type ShowOptionsType = {
  enabled?: boolean
}
