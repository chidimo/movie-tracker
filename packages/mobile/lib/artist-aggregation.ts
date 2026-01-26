import type { Show } from "@movie-tracker/core";

export interface ArtistFrequency {
  name: string;
  frequency: number;
  shows: string[]; // Array of show titles where this artist appears
}

export const getCommonArtists = (shows: Show[]): ArtistFrequency[] => {
  const artistMap = new Map<string, { count: number; shows: string[] }>();

  shows.forEach((show) => {
    if (show.mainCast && show.mainCast.length > 0) {
      show.mainCast.forEach((artist) => {
        const trimmedArtist = artist.trim();
        if (trimmedArtist) {
          const existing = artistMap.get(trimmedArtist);
          if (existing) {
            existing.count++;
            if (!existing.shows.includes(show.title)) {
              existing.shows.push(show.title);
            }
          } else {
            artistMap.set(trimmedArtist, {
              count: 1,
              shows: [show.title],
            });
          }
        }
      });
    }
  });

  // Convert to array and sort by frequency (descending), then by name
  return Array.from(artistMap.entries())
    .map(([name, data]) => ({
      name,
      frequency: data.count,
      shows: data.shows,
    }))
    .sort((a, b) => {
      if (b.frequency !== a.frequency) {
        return b.frequency - a.frequency;
      }
      return a.name.localeCompare(b.name);
    });
};

export const getTopArtists = (
  shows: Show[],
  limit: number = 10,
): ArtistFrequency[] => {
  return getCommonArtists(shows).slice(0, limit);
};
