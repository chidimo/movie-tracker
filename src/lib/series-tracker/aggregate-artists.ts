import type { Show } from './types'

export interface ArtistCount {
  name: string
  count: number
  shows: string[]
}

export function getCommonArtists(shows: Show[]): ArtistCount[] {
  const artistMap = new Map<string, { count: number; shows: string[] }>()

  shows.forEach((show) => {
    if (show.mainCast) {
      show.mainCast.forEach((artist) => {
        const existing = artistMap.get(artist)
        if (existing) {
          existing.count++
          existing.shows.push(show.title)
        } else {
          artistMap.set(artist, {
            count: 1,
            shows: [show.title],
          })
        }
      })
    }
  })

  return Array.from(artistMap.entries())
    .map(([name, data]) => ({
      name,
      count: data.count,
      shows: data.shows,
    }))
    .sort((a, b) => b.count - a.count)
    .filter((artist) => artist.count > 1)
}
