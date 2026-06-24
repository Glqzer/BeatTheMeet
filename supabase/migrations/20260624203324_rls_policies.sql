-- Enable RLS on all tables
alter table polls enable row level security;
alter table poll_options enable row level security;
alter table respondents enable row level security;
alter table availability enable row level security;

-- POLLS
-- Anyone can read a poll by ID
create policy "polls_read" on polls
  for select using (true);

-- Authenticated or guest can create a poll
create policy "polls_insert" on polls
  for insert with check (true);

-- Only the creator can update or delete
create policy "polls_update" on polls
  for update using (auth.uid() = created_by);

create policy "polls_delete" on polls
  for delete using (auth.uid() = created_by);

-- POLL OPTIONS
-- Anyone can read options for a poll
create policy "poll_options_read" on poll_options
  for select using (true);

-- Anyone can insert options (needed for poll creation)
create policy "poll_options_insert" on poll_options
  for insert with check (true);

-- Only poll creator can delete options
create policy "poll_options_delete" on poll_options
  for delete using (
    auth.uid() = (select created_by from polls where id = poll_id)
  );

-- RESPONDENTS
-- Anyone can read respondents on a poll
create policy "respondents_read" on respondents
  for select using (true);

-- Anyone can add themselves as a respondent
create policy "respondents_insert" on respondents
  for insert with check (true);

-- Only the respondent themselves can delete their response
create policy "respondents_delete" on respondents
  for delete using (
    auth.uid() = user_id
  );

-- AVAILABILITY
-- Anyone can read availability
create policy "availability_read" on availability
  for select using (true);

-- Anyone can insert availability
create policy "availability_insert" on availability
  for insert with check (true);

-- Only the respondent can delete their own availability
create policy "availability_delete" on availability
  for delete using (
    auth.uid() = (select user_id from respondents where id = respondent_id)
  );