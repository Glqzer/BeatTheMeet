# BeatTheMeet 🦕

> Stop texting "when r u free." Create a poll. Share a link. Done.

BeatTheMeet is a scheduling availability tool — like When2Meet but modern, timezone-aware, and with calendar import. Create a poll with your available dates and times, share the link with anyone (no account required to respond), and watch availability fill in on a real-time heatmap.

**Live:** [beatthemeet.vercel.app](https://beatthemeet.vercel.app)

---

## Features

- **No login required for respondents** — share a link, anyone can fill it out
- **Date-only or Date + Time polls** — flexible poll types for any scheduling need
- **Drag to select availability** — click and drag on desktop, two-tap range selection on mobile
- **Real-time heatmap** — see everyone's overlap update live as people respond
- **Calendar import** — Google Calendar OAuth, Outlook (coming soon), or any ICS URL
- **Timezone aware** — polls store a reference timezone, respondents view in their own timezone with full DST support
- **Busy slot visualization** — imported calendar events show as red blocks with event names
- **Dark mode** — automatic, follows system preference
- **Mobile optimized** — full touch support including tap-to-select availability and tap-to-view heatmap details

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite (TypeScript) |
| Styling | CSS custom properties (no framework) |
| Backend | Vercel Serverless Functions |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password, Google OAuth, Microsoft OAuth) |
| Deployment | Vercel |
| Calendar | Google Calendar API, ICS feed parsing |

---

## Project Structure

```
/
├── api/                          # Vercel serverless functions
│   ├── google-calendar.js        # Google Calendar OAuth token exchange + event fetch
│   └── ics-proxy.js              # CORS proxy for fetching ICS calendar feeds
├── public/
│   └── pics/                     # Static images (nailong, etc.)
├── src/
│   ├── components/
│   │   ├── CalendarPicker.tsx    # Custom drag-select calendar component
│   │   └── AuthGuard.tsx         # Route protection for authenticated pages
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client initialization
│   │   ├── timezones.ts          # Timezone conversion utilities (DST-aware)
│   │   ├── icsParser.ts          # ICS calendar file parser
│   │   └── useIsMobile.ts        # Mobile breakpoint hook
│   ├── pages/
│   │   ├── Home.tsx              # Landing page
│   │   ├── Auth.tsx              # Sign in / sign up
│   │   ├── Dashboard.tsx         # User's polls dashboard
│   │   ├── CreatePoll.tsx        # Create poll modal
│   │   ├── Poll.tsx              # Poll response page (main experience)
│   │   └── GoogleCalendarCallback.tsx  # OAuth callback handler
│   ├── index.css                 # Global styles + CSS variables (light/dark)
│   └── main.tsx                  # App entry point + routing
├── supabase/
│   └── migrations/               # SQL migration files
├── vercel.json                   # Vercel routing config
└── vite.config.ts
```

---

## Database Schema

```sql
-- Poll creators
polls
  id uuid PK
  title text
  description text
  created_by uuid → auth.users
  type 'date_only' | 'date_time'
  timezone text
  deadline timestamptz
  created_at timestamptz

-- Date/time slots for each poll
poll_options
  id uuid PK
  poll_id uuid → polls
  date date
  slot_time time        -- null for date_only polls, HH:MM:SS for date_time
  start_time time       -- legacy, unused
  end_time time         -- legacy, unused

-- Anyone who fills out a poll (signed in or guest)
respondents
  id uuid PK
  poll_id uuid → polls
  user_id uuid → auth.users (nullable, null for guests)
  name text
  email text (nullable)
  created_at timestamptz

-- Which slots each respondent marked as available
availability
  id uuid PK
  respondent_id uuid → respondents
  option_id uuid → poll_options
  UNIQUE (respondent_id, option_id)

-- Per-user settings (saved ICS URL, etc.)
user_settings
  user_id uuid PK → auth.users
  ics_url text
  updated_at timestamptz
```

### Row Level Security

All tables have RLS enabled:
- **polls** — anyone can read, only creator can update/delete
- **poll_options** — anyone can read, only poll creator can delete
- **respondents** — anyone can read/insert, owner can delete
- **availability** — anyone can read/insert/delete (delete is open to support guest editing)
- **user_settings** — users can only read/write their own row

---

## Local Development

### Prerequisites

- Node.js v18+
- A [Supabase](https://supabase.com) project
- A [Google Cloud](https://console.cloud.google.com) project (for Google Calendar import)

### Setup

1. **Clone the repo**

```bash
git clone https://github.com/your-username/scheduler.git
cd scheduler
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create `.env.local` at the root:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-key

# Google Calendar OAuth (optional, for calendar import)
VITE_GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
VITE_REDIRECT_BASE_URL=http://localhost:5173
REDIRECT_BASE_URL=http://localhost:5173
```

4. **Run database migrations**

```bash
npx supabase login
npx supabase link --project-ref your-project-ref
npx supabase db push
```

5. **Start the dev server**

```bash
npm run dev
```

App runs at `http://localhost:5173`.

> **Note:** Vercel serverless functions (`/api`) don't run locally with `npm run dev`. To test Google Calendar import locally, use the Vercel CLI: `npx vercel dev`.

---

## Deployment

The app is deployed on Vercel with automatic deploys from the `main` branch.

### Vercel Environment Variables

Set these in **Vercel → Settings → Environment Variables**:

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase publishable (anon) key |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret (server-side only) |
| `VITE_REDIRECT_BASE_URL` | Your production URL e.g. `https://beatthemeet.vercel.app` |
| `REDIRECT_BASE_URL` | Same as above, for serverless functions |

### Supabase Configuration

In **Supabase → Authentication → URL Configuration**:
- **Site URL:** `https://beatthemeet.vercel.app`
- **Redirect URLs:** `https://beatthemeet.vercel.app/**`

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create an OAuth 2.0 Client ID (Web application)
3. Add authorized redirect URIs:
   - `https://beatthemeet.vercel.app/calendar/google/callback`
   - `http://localhost:5173/calendar/google/callback` (for local dev)
4. Enable the **Google Calendar API** in APIs & Services → Library
5. Add yourself as a test user in OAuth consent screen → Test users (until the app is verified by Google)

### Supabase GitHub Integration

Migrations are automatically applied when pushing to `main` via the Supabase GitHub integration. The `supabase/` folder at the repo root is the working directory.

---

## How It Works

### Poll Creation (Host)
1. Host signs in with email, Google, or Microsoft
2. Creates a poll — picks dates, optionally sets time ranges per day and a timezone
3. For `date_time` polls, each 30-minute slot within the time range is stored as a separate `poll_option` row
4. Gets a shareable link (`/poll/:id`)

### Responding (Guests or Users)
1. Anyone opens the poll link — no account needed
2. Optional: import Google Calendar or ICS feed to auto-mark busy times
3. Enters name (+ optional email) to identify themselves
4. Clicks/drags to mark availability — each interaction upserts/deletes from the `availability` table instantly
5. Returning users with the same name+email combo load their previous response

### Real-time Heatmap
- Supabase Realtime subscription watches the `availability` table for changes
- On any change, `loadAllAvailability()` fetches fresh counts and updates the heatmap
- Hovering/tapping a heatmap cell shows a tooltip with who is available and who isn't

### Timezone Handling
- Poll stores a reference timezone (e.g. `America/New_York`)
- Slot times are stored as wall clock time in that timezone
- When displaying, times are converted to the viewer's chosen display timezone using `Intl.DateTimeFormat` (DST-aware, Safari-compatible)
- Calendar import converts Google Calendar event times (UTC) to the poll's timezone for accurate busy slot matching

### Calendar Import
**Google Calendar:**
- User clicks "Import from Google Calendar" → redirected to Google OAuth
- OAuth callback exchanges code for access token via `/api/google-calendar` serverless function
- Function fetches events from the Google Calendar Events API
- Events stored in `sessionStorage` keyed by poll ID
- After identity step, `applyBusyTimes()` matches events against poll slots and marks busy ones red

**ICS URL:**
- User pastes any ICS feed URL (Google, Outlook, Apple Calendar, etc.)
- URL is fetched via `/api/ics-proxy` (CORS proxy)
- `icsParser.ts` parses the iCalendar format, handles all timezone formats including `TZID`, UTC (`Z`), and floating times
- Same `applyBusyTimes()` flow as Google Calendar

---

## Roadmap

- [ ] Microsoft Outlook OAuth calendar import
- [ ] Google Calendar event invite sending after finalizing a time
- [ ] Spanning event blocks on the grid (events shown as continuous blocks across multiple 30-min slots)
- [ ] Google OAuth verification (currently test-user only)
- [ ] Privacy policy page
- [ ] Custom domain

---

## Contributing

PRs welcome. Open an issue first for major changes.

---

## License

MIT

---

*Made with 🦕 and mild frustration at Google Calendar by David Wang.*  
*Nailong did not get paid for this. He works for kibble.*