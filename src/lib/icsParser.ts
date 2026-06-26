export interface CalendarEvent {
  start: Date
  end: Date
  summary: string
}

export function parseICS(icsText: string): CalendarEvent[] {
  const events: CalendarEvent[] = []
  const lines = icsText
    .replace(/\r\n /g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')

  let inEvent = false
  let current: Partial<{ start: Date; end: Date; summary: string }> = {}

  for (const line of lines) {
    if (line.trim() === 'BEGIN:VEVENT') {
      inEvent = true
      current = {}
      continue
    }

    if (line.trim() === 'END:VEVENT') {
      if (current.start && current.end) {
        events.push({
          start: current.start,
          end: current.end,
          summary: current.summary ?? 'Busy',
        })
      }
      inEvent = false
      continue
    }

    if (!inEvent) continue

    if (line.startsWith('DTSTART')) {
      const parsed = parseICSDate(line)
      if (parsed) current.start = parsed
    } else if (line.startsWith('DTEND')) {
      const parsed = parseICSDate(line)
      if (parsed) current.end = parsed
    } else if (line.startsWith('DURATION') && current.start && !current.end) {
      // Handle events with DURATION instead of DTEND
      current.end = parseDuration(line, current.start)
    } else if (line.startsWith('SUMMARY:')) {
      current.summary = line.replace('SUMMARY:', '').trim()
    }
  }

  return events
}

function parseICSDate(line: string): Date | null {
  try {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) return null
    const value = line.slice(colonIdx + 1).trim()
    const tzMatch = line.match(/TZID=([^:;]+)/)
    const tz = tzMatch ? tzMatch[1] : null

    // All-day event: YYYYMMDD
    if (value.length === 8 && !value.includes('T')) {
      const y = parseInt(value.slice(0, 4))
      const mo = parseInt(value.slice(4, 6)) - 1
      const d = parseInt(value.slice(6, 8))
      return new Date(Date.UTC(y, mo, d, 0, 0, 0))
    }

    // DateTime: YYYYMMDDTHHmmss[Z]
    const y = parseInt(value.slice(0, 4))
    const mo = parseInt(value.slice(4, 6)) - 1
    const d = parseInt(value.slice(6, 8))
    const h = parseInt(value.slice(9, 11))
    const m = parseInt(value.slice(11, 13))
    const s = parseInt(value.slice(13, 15)) || 0

    if (value.endsWith('Z')) {
      return new Date(Date.UTC(y, mo, d, h, m, s))
    }

    if (tz) {
      // Wall clock time in source timezone → UTC
      const naive = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}T${value.slice(9, 11)}:${value.slice(11, 13)}:${String(s).padStart(2, '0')}`
      const utcGuess = new Date(naive + 'Z').getTime()
      const inTzDate = new Date(new Date(utcGuess).toLocaleString('en-US', { timeZone: tz }))
      const offset = utcGuess - inTzDate.getTime()
      return new Date(utcGuess + offset)
    }

    // No timezone — treat as local
    return new Date(y, mo, d, h, m, s)
  } catch {
    return null
  }
}

function parseDuration(line: string, start: Date): Date {
  // DURATION:PT1H30M or DURATION:P1D etc
  const value = line.replace('DURATION:', '').trim()
  let totalMs = 0
  const weeks = value.match(/(\d+)W/)
  const days = value.match(/(\d+)D/)
  const hours = value.match(/(\d+)H/)
  const mins = value.match(/(\d+)M/)
  const secs = value.match(/(\d+)S/)
  if (weeks) totalMs += parseInt(weeks[1]) * 7 * 24 * 60 * 60 * 1000
  if (days) totalMs += parseInt(days[1]) * 24 * 60 * 60 * 1000
  if (hours) totalMs += parseInt(hours[1]) * 60 * 60 * 1000
  if (mins) totalMs += parseInt(mins[1]) * 60 * 1000
  if (secs) totalMs += parseInt(secs[1]) * 1000
  return new Date(start.getTime() + totalMs)
}

export function getEventsInRange(
  events: CalendarEvent[],
  start: Date,
  end: Date
): CalendarEvent[] {
  return events.filter(e => e.start < end && e.end > start)
}