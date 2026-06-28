export default async function handler(req, res) {
  const { id } = req.query
  if (!id) return res.status(400).send('No poll ID')

  const ua = req.headers['user-agent'] ?? ''

  // Only serve OG preview to crawlers/bots
  const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Discordbot|iMessage|applebot|Googlebot|bingbot|curl|python|wget/i.test(ua)

  if (!isCrawler) {
    // Real user — just redirect to the React app
    res.setHeader('Location', `/poll/${id}`)
    return res.status(302).end()
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

  const response = await fetch(
    `${supabaseUrl}/rest/v1/polls?id=eq.${id}&select=title,description`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      }
    }
  )

  const data = await response.json()
  const poll = data?.[0]

  if (!poll) return res.status(404).send('Poll not found')

  const title = poll.title ?? 'BeatTheMeet'
  const description = poll.description || 'Fill out your availability on BeatTheMeet'

  res.setHeader('Content-Type', 'text/html')
  res.status(200).send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta property="og:title" content="${title} — BeatTheMeet" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="https://beatthemeet.com/og-image.png" />
  <meta property="og:url" content="https://beatthemeet.com/poll/${id}" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
</head>
<body>
  <p>Loading poll...</p>
</body>
</html>`)
}