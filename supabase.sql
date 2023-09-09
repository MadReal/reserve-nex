-- UPDATE table public."User" (
--   id uuid not null references auth.users on delete cascade,
--   email text,
--   primary key (id)
-- );

alter table public."User" enable row level security;

-- inserts a row into public."User"
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$

begin
  insert into public."User" (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();







-- https://github.com/noahflk/railtrack/blob/main/supabase.sql

-- -- Executing this file on the Supabase database is optional
-- -- Is is only necessary in order to send Logsnag notification in combination with a CRON job hitting /api/cron
-- create or replace function public.handle_new_user() 
-- returns trigger as $$
-- begin
--   insert into public."Profiles" ("userId", email)
--   values (new.id, new.email);
--   return new;
-- end;
-- $$ language plpgsql security definer;

-- create trigger on_auth_user_created
--   after insert on auth.users
--   for each row execute procedure public.handle_new_user();



-- -- Schema to populate existing journeys with random UUIDs if they don't have one yet
-- UPDATE "Journey" SET uuid=gen_random_uuid ();
-- -- Make uuid field required afterwards

-- -- Add a departureTime field to each journey for sorting
-- UPDATE "Journey"
-- SET "departureTime" = (
--   SELECT MIN("departureTime")
--   FROM "Section"
--   WHERE "journeyId" = "Journey"."id"
-- )