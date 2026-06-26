export default async function handler(req, res) {
  const { url } = req.query

  if (!url) return res.status(400).json({ error: 'No URL provided' })

  try {
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return res.status(400).json({ error: 'Invalid URL' })
    }
  } catch {
    return res.status(400).json({ error: 'Invalid URL' })
  }

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'BeatTheMeet/1.0' }
    })

    if (!response.ok) {
      return res.status(400).json({ error: `Failed to fetch calendar: ${response.status}` })
    }

    const text = await response.text()

    if (!text.includes('BEGIN:VCALENDAR')) {
      return res.status(400).json({ error: 'URL does not appear to be a valid ICS calendar' })
    }

    res.setHeader('Content-Type', 'text/calendar')
    return res.status(200).send(text)
  } catch {
    return res.status(500).json({ error: 'Failed to fetch calendar' })
  }
}