// @ts-nocheck
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { code, timeMin, timeMax } = req.query

  if (!code) return res.status(400).json({ error: 'No code provided' })
  if (!timeMin || !timeMax) return res.status(400).json({ error: 'Missing time range' })

  const redirectUri = `${process.env.REDIRECT_BASE_URL}/calendar/google/callback`

  // Exchange code for access token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.VITE_GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    })
  })

  const tokenData = await tokenRes.json()
  if (!tokenData.access_token) {
    return res.status(400).json({ error: 'Failed to get access token', details: tokenData })
  }

  // Fetch actual events with names
  const eventsRes = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
    new URLSearchParams({
      timeMin,
      timeMax,
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '250',
    }),
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      }
    }
  )

  const eventsData = await eventsRes.json()

  if (!eventsData.items) {
    return res.status(400).json({ error: 'Failed to fetch events', details: eventsData })
  }

  // Convert to busy format with real names
  const busy = eventsData.items
    .filter(event => event.status !== 'cancelled' && event.transparency !== 'transparent')
    .map(event => ({
      start: event.start?.dateTime ?? event.start?.date + 'T00:00:00Z',
      end: event.end?.dateTime ?? event.end?.date + 'T23:59:59Z',
      summary: event.summary ?? 'Busy',
    }))

  return res.status(200).json({ busy })
}