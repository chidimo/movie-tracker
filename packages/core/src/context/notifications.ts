import type { Show, TrackerState } from '../types/types'

export type NotificationPermissionStatus =
  | 'granted'
  | 'denied'
  | 'undetermined'
  | 'unavailable'
  | 'error'

export async function getNotificationPermissionsStatus(): Promise<NotificationPermissionStatus> {
  try {
    if (!('Notification' in globalThis)) {
      return 'unavailable'
    }

    if (globalThis.Notification.permission === 'granted') return 'granted'
    if (globalThis.Notification.permission === 'denied') return 'denied'
    return 'undetermined'
  } catch {
    return 'error'
  }
}

export async function requestNotificationPermissions(): Promise<NotificationPermissionStatus> {
  try {
    if (!('Notification' in globalThis)) {
      return 'unavailable'
    }

    const permission = await globalThis.Notification.requestPermission()
    if (permission === 'granted') return 'granted'
    if (permission === 'denied') return 'denied'
    return 'undetermined'
  } catch {
    return 'error'
  }
}

function computeTentativeDates(show: Show, maxOccurrences: number): Date[] {
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

export async function scheduleTentativeNotifications(
  state: TrackerState,
  leadDays: number,
  maxOccurrences = 20,
): Promise<void> {
  try {
    const permissionStatus = await getNotificationPermissionsStatus()
    if (permissionStatus !== 'granted') {
      return
    }

    // Clear existing scheduled notifications for this app
    if (
      'serviceWorker' in navigator &&
      'registration' in navigator.serviceWorker
    ) {
      const registration = await navigator.serviceWorker.ready
      const notifications = await registration.getNotifications({
        tag: 'tentative-notification',
      })
      notifications.forEach((notification) => notification.close())
    }

    const now = new Date()
    const scheduledNotifications: { show: Show; date: Date }[] = []

    for (const show of state.shows) {
      if (!show.tentativeNextAirDate) continue

      const tentativeDates = computeTentativeDates(show, maxOccurrences)

      for (const date of tentativeDates) {
        const notificationTime = new Date(date)
        notificationTime.setDate(notificationTime.getDate() - leadDays)

        if (notificationTime > now) {
          scheduledNotifications.push({
            show,
            date: notificationTime,
          })
        }
      }
    }

    // Schedule notifications using setTimeout for web
    scheduledNotifications.forEach(({ show, date }) => {
      const timeUntilNotification = date.getTime() - now.getTime()

      setTimeout(() => {
        const episodeInfo = show.tentativeNextEpisode
          ? `S${show.tentativeNextEpisode.seasonNumber}E${show.tentativeNextEpisode.episodeNumber}`
          : 'new episode'

        new globalThis.Notification(
          `${show.title} - ${episodeInfo} airing soon!`,
          {
            body: `Episode ${episodeInfo} of ${show.title} airs on ${date.toLocaleDateString()}`,
            icon: '/favicon.ico',
            tag: 'tentative-notification',
            requireInteraction: false,
            silent: false,
          },
        )
      }, timeUntilNotification)
    })
  } catch (error) {
    console.error('Failed to schedule tentative notifications:', error)
  }
}
