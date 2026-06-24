-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Polls
create table polls (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  created_by uuid references auth.users(id) on delete set null,
  type text not null check (type in ('date_only', 'date_time')),
  deadline timestamptz,
  created_at timestamptz not null default now()
);

-- Poll options (the date/time slots)
create table poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references polls(id) on delete cascade,
  date date not null,
  start_time time,
  end_time time,
  created_at timestamptz not null default now()
);

-- Respondents (signed in or guest)
create table respondents (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references polls(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  created_at timestamptz not null default now()
);

-- Availability (a row = that respondent is available for that slot)
create table availability (
  id uuid primary key default gen_random_uuid(),
  respondent_id uuid not null references respondents(id) on delete cascade,
  option_id uuid not null references poll_options(id) on delete cascade,
  unique(respondent_id, option_id)
);