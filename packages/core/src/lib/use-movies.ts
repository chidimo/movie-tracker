import { 
  createMobileOmdbFunctions, 
  createWebOmdbFunctions
} from "./omdb"
import { normalizeOmdbShow } from "./compute-omdb"

// Platform-specific OMDB functions
const getOmdbFunctions = () => {
  // Check if we're in a mobile environment
  if (typeof process !== 'undefined' && process.env.EXPO_PUBLIC_OMDB_API_KEY) {
    return createMobileOmdbFunctions(process.env.EXPO_PUBLIC_OMDB_API_KEY)
  }
  
  // Default to web environment
  return createWebOmdbFunctions({
    omdbFunctionPath: (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') 
      ? '/api/omdb' 
      : '/.netlify/functions/omdb'
  })
}

const { omdbGetSeason, omdbGetTitle, omdbSearch } = getOmdbFunctions()

// Export the raw functions for custom hook creation
export { omdbGetSeason, omdbGetTitle, omdbSearch, getOmdbFunctions, normalizeOmdbShow }

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

// Legacy hooks - these will throw errors if React Query is not available
// This maintains backward compatibility while encouraging migration to the new pattern
export const useSearchSeries = () => { throw new Error('useSearchSeries is deprecated. Use createUseSearchSeries from @movie-tracker/core with your React Query instance.') }
export const useFetchSeasons = () => { throw new Error('useFetchSeasons is deprecated. Use createUseFetchSeasons from @movie-tracker/core with your React Query instance.') }
export const useGetShow = () => { throw new Error('useGetShow is deprecated. Use createUseGetShow from @movie-tracker/core with your React Query instance.') }
export const useGetTitle = () => { throw new Error('useGetTitle is deprecated. Use createUseGetTitle from @movie-tracker/core with your React Query instance.') }
export const useOmdbTitleMutation = () => { throw new Error('useOmdbTitleMutation is deprecated. Use createUseOmdbTitleMutation from @movie-tracker/core with your React Query instance.') }
