import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import type { Show, TrackerState } from '@movie-tracker/core'
import { showNotification } from '@/components/notifier'

export type NotificationPermissionStatus =
  | 'granted'
  | 'denied'
  | 'undetermined'
  | 'unavailable'
  | 'error'

export async function getNotificationPermissionsStatus(): Promise<NotificationPermissionStatus> {
  try {
    const settings = await Notifications.getPermissionsAsync()
    if (settings.granted) {
      return 'granted'
    }
    if (settings.canAskAgain) {
      return 'undetermined'
    }
    return 'denied'
  } catch (error) {
    showNotification({
      title: 'Notification Error',
      description: 'Failed to get notification permissions',
    })
    console.error('Failed to get notification permissions:', error)
    return 'error'
  }
}

export async function requestNotificationPermissions(): Promise<NotificationPermissionStatus> {
  try {
    if (Platform.OS === 'android') {
      // Ensure a default notification channel exists on Android
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.DEFAULT,
      })
    }

    const settings = await Notifications.requestPermissionsAsync()
    if (settings.granted) {
      showNotification({
        title: 'Notification granted',
        description: 'You can now receive notifications',
      })
      return 'granted'
    }
    if (settings.canAskAgain) {
      showNotification({
        title: 'Notification undetermined',
        description: 'You can now receive notifications',
      })
      return 'undetermined'
    }

    showNotification({
      title: 'Notification denied',
      description: 'You can now receive notifications',
    })
    return 'denied'
  } catch (error) {
    console.error('Failed to request notification permissions:', error)
    showNotification({
      title: 'Notification Error',
      description: 'Failed to request notification permissions',
    })
    return 'error'
  }
}

/**
 * Computes tentative air dates for a TV show based on its next air date and frequency.
 *
 * @param show - The TV show object containing tentative scheduling information
 * @param maxOccurrences - Maximum number of future dates to compute
 * @returns Array of Date objects representing tentative air dates
 *
 * Logic:
 * 1. Validates that the show has both tentativeNextAirDate and tentativeFrequencyDays
 * 2. Creates a base date from tentativeNextAirDate
 * 3. Determines the number of episodes to schedule:
 *    - Defaults to maxOccurrences
 *    - If show has episode information, limits to remaining episodes in the current season
 * 4. Generates dates by adding frequencyDays intervals to the base date
 */
const computeTentativeDates = (
  show: Show,
  maxOccurrences: number,
): Array<Date> => {
  if (!show.tentativeNextAirDate || !show.tentativeFrequencyDays) return []

  const base = new Date(show.tentativeNextAirDate)
  if (Number.isNaN(base.getTime())) return []

  const frequencyDays = Math.max(1, show.tentativeFrequencyDays)
  let count = maxOccurrences

  if (show.tentativeNextEpisode && show.seasons?.length) {
    const season = show.seasons.find(
      (s) => s.seasonNumber === show.tentativeNextEpisode?.seasonNumber,
    )
    const maxEpisode = Math.max(
      0,
      ...(season?.episodes || [])
        .map((e) => e.episodeNumber || 0)
        .filter((n) => Number.isFinite(n)),
    )
    if (maxEpisode > 0) {
      const remaining = maxEpisode - show.tentativeNextEpisode.episodeNumber + 1
      count = Math.min(maxOccurrences, Math.max(1, remaining))
    }
  }

  return Array.from({ length: count }, (_, idx) => {
    const d = new Date(base)
    d.setDate(d.getDate() + frequencyDays * idx)
    return d
  })
}

/**
 * Schedules tentative notifications for all shows in the tracker state.
 *
 * @param state - The tracker state containing all shows to schedule notifications for
 * @param leadDays - Number of days before air date to send notification (clamped between 0-14)
 * @param maxOccurrences - Maximum number of future episodes to schedule per show (default: 20)
 *
 * Process:
 * 1. Checks notification permissions - exits early if not granted
 * 2. Cancels all existing scheduled notifications to avoid duplicates
 * 3. For each show:
 *    - Computes tentative air dates using computeTentativeDates()
 *    - For each date, calculates notification time (air date minus leadDays)
 *    - Skips dates in the past
 *    - Schedules notification with show title, episode info, and air date
 * 4. Each notification includes metadata (imdbId, episodeNumber, episodeDate) for handling
 *
 * Notification format:
 * - Title: "{show.title} • Episode {number}"
 * - Body: "Airs on {date}"
 * - Trigger: Specific date/time using expo-notifications DATE trigger type
 */
export async function scheduleTentativeNotifications(
  state: TrackerState,
  leadDays: number,
  maxOccurrences = 20,
): Promise<void> {
  const permissions = await getNotificationPermissionsStatus()
  if (permissions !== 'granted') return

  await Notifications.cancelAllScheduledNotificationsAsync()

  const now = new Date()
  const lead = Math.max(
    0,
    Math.min(14, Number.isFinite(leadDays) ? leadDays : 2),
  )

  for (const show of state.shows || []) {
    const dates = computeTentativeDates(show, maxOccurrences)
    const baseEpisode = show.tentativeNextEpisode?.episodeNumber

    for (let idx = 0; idx < dates.length; idx += 1) {
      const episodeDate = dates[idx]
      const notifyAt = new Date(episodeDate)
      notifyAt.setDate(notifyAt.getDate() - lead)

      if (notifyAt <= now) continue

      const episodeNumber =
        typeof baseEpisode === 'number' ? baseEpisode + idx : undefined
      const episodeLabel =
        typeof episodeNumber === 'number'
          ? `Episode ${episodeNumber}`
          : 'New episode'

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${show.title} • ${episodeLabel}`,
          body: `Airs on ${episodeDate.toLocaleDateString()}`,
          data: {
            imdbId: show.imdbId,
            episodeNumber,
            episodeDate: episodeDate.toISOString(),
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: notifyAt,
        },
      })
    }
  }
}
