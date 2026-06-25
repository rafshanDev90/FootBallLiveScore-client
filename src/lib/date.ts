export function formatLocalTime(localDate: string | null) {
  if (!localDate) return '--:--'
  const parts = localDate.split(' ')
  if (parts.length < 2) return localDate
  return parts[1]
}

export function formatLocalDate(localDate: string | null) {
  if (!localDate) return ''
  const parts = localDate.split(' ')
  if (parts.length < 1) return localDate
  const [month, day, year] = parts[0].split('/')
  if (!month || !day || !year) return localDate
  const date = new Date(+year, +month - 1, +day)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatLocalDateTime(localDate: string | null) {
  if (!localDate) return ''
  const date = formatLocalDate(localDate)
  const time = formatLocalTime(localDate)
  return `${date} — ${time}`
}
