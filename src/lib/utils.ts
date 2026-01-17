export const cleanStringifiedNumber = (s?: string) => {
  if (!s) return undefined
  return Number(s.replaceAll(',', ''))
}

export const formatNumber = (n?: number) => {
  if (!n) return undefined
  return n.toLocaleString()
}

export const isWithinDays = (iso?: string, days = 7) => {
  if (!iso) return false
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return false
  const diff = t - Date.now()
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000
}

export const getPaddedNumber = (n?: number) => {
  return typeof n === 'number' ? String(n).padStart(2, '0') : undefined
}

export const formatTentative = (iso: string) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const day = d.getDate()
  const suffix = (n: number) => {
    const j = n % 10,
      k = n % 100
    if (j === 1 && k !== 11) return 'st'
    if (j === 2 && k !== 12) return 'nd'
    if (j === 3 && k !== 13) return 'rd'
    return 'th'
  }
  return `${weekdays[d.getDay()]} ${day}${suffix(day)} ${
    months[d.getMonth()]
  }, ${d.getFullYear()}`
}

export const parseDayMonthYearToISO = (dateStr: string) => {
  if (!dateStr || typeof dateStr !== 'string') {
    return undefined
  }

  const parts = dateStr.trim().split(' ')
  if (parts.length !== 3) {
    return undefined
  }

  const [dayStr, monthStr, yearStr] = parts

  const day = Number(dayStr)
  const year = Number(yearStr)

  const months = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  }

  const month = months[monthStr as keyof typeof months]

  if (
    !Number.isInteger(day) ||
    !Number.isInteger(year) ||
    month === undefined
  ) {
    return undefined
  }

  const date = new Date(Date.UTC(year, month, day))

  if (Number.isNaN(date.getTime())) {
    return undefined
  }

  return date.toISOString()
}
