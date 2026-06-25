drop policy if exists "availability_delete" on availability;

create policy "availability_delete" on availability
  for delete using (true);