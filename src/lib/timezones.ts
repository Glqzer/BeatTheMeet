export const COMMON_TIMEZONES = [
  { value: 'Pacific/Honolulu', label: 'Hawaii (HST, UTC-10)' },
  { value: 'America/Anchorage', label: 'Alaska (AKST, UTC-9)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT, UTC-8)' },
  { value: 'America/Denver', label: 'Mountain Time (MT, UTC-7)' },
  { value: 'America/Phoenix', label: 'Arizona (MST, UTC-7)' },
  { value: 'America/Chicago', label: 'Central Time (CT, UTC-6)' },
  { value: 'America/New_York', label: 'Eastern Time (ET, UTC-5)' },
  { value: 'America/Halifax', label: 'Atlantic Time (AT, UTC-4)' },
  { value: 'America/Sao_Paulo', label: 'São Paulo (BRT, UTC-3)' },
  { value: 'Atlantic/Azores', label: 'Azores (AZOT, UTC-1)' },
  { value: 'Europe/London', label: 'London (GMT/BST, UTC+0)' },
  { value: 'Europe/Paris', label: 'Central Europe (CET, UTC+1)' },
  { value: 'Europe/Helsinki', label: 'Eastern Europe (EET, UTC+2)' },
  { value: 'Europe/Moscow', label: 'Moscow (MSK, UTC+3)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST, UTC+4)' },
  { value: 'Asia/Karachi', label: 'Pakistan (PKT, UTC+5)' },
  { value: 'Asia/Dhaka', label: 'Bangladesh (BST, UTC+6)' },
  { value: 'Asia/Bangkok', label: 'Bangkok (ICT, UTC+7)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT, UTC+8)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST, UTC+9)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST, UTC+10)' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST, UTC+12)' },
]

export function getLocalTimezone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (!tz) return 'UTC'
    new Intl.DateTimeFormat('en-US', { timeZone: tz }).formatToParts(new Date())
    return tz
  } catch {
    return 'UTC'
  }
}

export function getLocalTimezoneLabel(): string {
  try {
    const tz = getLocalTimezone()
    const match = COMMON_TIMEZONES.find(t => t.value === tz)
    if (match) return match.label

    const now = new Date()
    const offsetStr = now.toLocaleTimeString('en-US', {
      timeZone: tz,
      timeZoneName: 'shortOffset'
    }).split(' ').pop() ?? ''

    return `${tz} (${offsetStr})`
  } catch {
    return 'UTC'
  }
}

// Convert a slot time from one timezone to another
// slotTime: "HH:MM:00", date: "YYYY-MM-DD"
export function convertSlotTime(
  date: string,
  slotTime: string,
  fromTz: string,
  toTz: string
): { date: string; time: string } {
  try {
    if (!date || !slotTime || !fromTz || !toTz) throw new Error('missing args')

    const [h, m] = slotTime.split(':').map(Number)
    if (isNaN(h) || isNaN(m)) throw new Error('invalid slot time')

    const utcMs = wallClockToUTC(date, h, m, fromTz)
    if (!isFinite(utcMs)) throw new Error('invalid utcMs')

    const converted = new Date(utcMs)
    if (!isFinite(converted.getTime())) throw new Error('invalid date')

    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: toTz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).formatToParts(converted)

    const get = (type: string) => parts.find(p => p.type === type)?.value ?? ''
    const time = `${get('hour')}:${get('minute')} ${get('dayPeriod')}`

    return {
      date: `${get('year')}-${get('month')}-${get('day')}`,
      time,
    }
  } catch {
    // Fallback: return raw slot time without conversion
    const parts = slotTime?.split(':').map(Number) ?? [0, 0]
    const h = parts[0] ?? 0
    const m = parts[1] ?? 0
    const period = h < 12 ? 'AM' : 'PM'
    const display = h === 0 ? 12 : h > 12 ? h - 12 : h
    return {
      date,
      time: `${display}:${String(m).padStart(2, '0')} ${period}`,
    }
  }
}

function wallClockToUTC(date: string, h: number, m: number, tz: string): number {
  try {
    if (!date || !tz || isNaN(h) || isNaN(m)) return NaN

    const parts = date.split('-')
    const year = parseInt(parts[0])
    const month = parseInt(parts[1]) - 1
    const day = parseInt(parts[2])

    if (isNaN(year) || isNaN(month) || isNaN(day)) return NaN

    const utcGuess = Date.UTC(year, month, day, h, m, 0)
    if (!isFinite(utcGuess)) return NaN

    const guessDate = new Date(utcGuess)
    if (!isFinite(guessDate.getTime())) return NaN

    const fmt = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })

    const inTz = fmt.format(guessDate)
    const tzDate = new Date(inTz + 'Z')
    if (!isFinite(tzDate.getTime())) return utcGuess

    const wallClockMs = tzDate.getTime()
    const offset = utcGuess - wallClockMs
    return utcGuess + offset
  } catch {
    return NaN
  }
}

export function formatSlotInTz(date: string, slotTime: string, fromTz: string, toTz: string): string {
  try {
    if (!date || !slotTime || !fromTz || !toTz) {
      const parts = slotTime?.split(':').map(Number) ?? [0, 0]
      const h = parts[0] ?? 0
      const m = parts[1] ?? 0
      const period = h < 12 ? 'AM' : 'PM'
      const display = h === 0 ? 12 : h > 12 ? h - 12 : h
      return `${display}:${String(m).padStart(2, '0')} ${period}`
    }

    if (fromTz === toTz) {
      const [h, m] = slotTime.split(':').map(Number)
      const period = h < 12 ? 'AM' : 'PM'
      const display = h === 0 ? 12 : h > 12 ? h - 12 : h
      return `${display}:${String(m).padStart(2, '0')} ${period}`
    }

    return convertSlotTime(date, slotTime, fromTz, toTz).time
  } catch {
    const parts = slotTime?.split(':').map(Number) ?? [0, 0]
    const h = parts[0] ?? 0
    const m = parts[1] ?? 0
    const period = h < 12 ? 'AM' : 'PM'
    const display = h === 0 ? 12 : h > 12 ? h - 12 : h
    return `${display}:${String(m).padStart(2, '0')} ${period}`
  }
}

export function getAllTimezones(): { value: string; label: string }[] {
  let tzNames: string[]
  
  try {
    tzNames = (Intl as any).supportedValuesOf('timeZone')
    if (!tzNames || tzNames.length === 0) throw new Error('empty')
  } catch {
    // Fallback: hardcoded comprehensive list
    tzNames = [
      'Pacific/Honolulu', 'America/Anchorage', 'America/Los_Angeles',
      'America/Denver', 'America/Phoenix', 'America/Chicago',
      'America/New_York', 'America/Halifax', 'America/Sao_Paulo',
      'Atlantic/Azores', 'Europe/London', 'Europe/Paris',
      'Europe/Berlin', 'Europe/Helsinki', 'Europe/Moscow',
      'Asia/Dubai', 'Asia/Karachi', 'Asia/Dhaka', 'Asia/Bangkok',
      'Asia/Singapore', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Sydney',
      'Pacific/Auckland', 'UTC',
      'America/Toronto', 'America/Vancouver', 'America/Mexico_City',
      'America/Bogota', 'America/Lima', 'America/Santiago',
      'America/Buenos_Aires', 'America/Caracas', 'America/Panama',
      'Europe/Amsterdam', 'Europe/Athens', 'Europe/Brussels',
      'Europe/Budapest', 'Europe/Copenhagen', 'Europe/Dublin',
      'Europe/Istanbul', 'Europe/Lisbon', 'Europe/Madrid',
      'Europe/Oslo', 'Europe/Prague', 'Europe/Rome',
      'Europe/Stockholm', 'Europe/Vienna', 'Europe/Warsaw',
      'Europe/Zurich', 'Africa/Cairo', 'Africa/Johannesburg',
      'Africa/Lagos', 'Africa/Nairobi', 'Asia/Beirut',
      'Asia/Colombo', 'Asia/Calcutta', 'Asia/Kathmandu',
      'Asia/Almaty', 'Asia/Tashkent', 'Asia/Yekaterinburg',
      'Asia/Kolkata', 'Asia/Yangon', 'Asia/Ho_Chi_Minh',
      'Asia/Jakarta', 'Asia/Manila', 'Asia/Hong_Kong',
      'Asia/Taipei', 'Asia/Vladivostok', 'Asia/Magadan',
      'Pacific/Guam', 'Pacific/Fiji', 'Pacific/Tongatapu',
    ]
  }

  return tzNames.map((tz: string) => {
    let offset = ''
    try {
      offset = new Date().toLocaleTimeString('en-US', {
        timeZone: tz,
        timeZoneName: 'shortOffset'
      }).split(' ').pop() ?? ''
    } catch {
      offset = 'UTC'
    }
    return { value: tz, label: `${tz.replace(/_/g, ' ')} (${offset})` }
  }).sort((a, b) => a.value.localeCompare(b.value))
}