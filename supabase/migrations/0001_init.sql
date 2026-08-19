-- fitrate schema: profiles, fitchecks, analyses, community interactions.
-- Run this in the Supabase SQL editor (or `supabase db push`) against a fresh project.

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  avatar text,
  bio text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, avatar)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'user_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- fitchecks
-- ---------------------------------------------------------------------------
create table if not exists public.fitchecks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  image_url text not null,
  occasion text not null check (occasion in ('date', 'interview', 'casual', 'formal')),
  visibility text not null default 'private' check (visibility in ('private', 'public')),
  created_at timestamptz not null default now()
);

create index if not exists fitchecks_user_id_idx on public.fitchecks (user_id, created_at desc);
create index if not exists fitchecks_public_idx on public.fitchecks (visibility, created_at desc) where visibility = 'public';

alter table public.fitchecks enable row level security;

create policy "Owners can view their own fitchecks"
  on public.fitchecks for select
  using (auth.uid() = user_id);

create policy "Anyone can view public fitchecks"
  on public.fitchecks for select
  using (visibility = 'public');

create policy "Owners can insert their own fitchecks"
  on public.fitchecks for insert
  with check (auth.uid() = user_id);

create policy "Owners can update their own fitchecks"
  on public.fitchecks for update
  using (auth.uid() = user_id);

create policy "Owners can delete their own fitchecks"
  on public.fitchecks for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- analyses (one per fitcheck)
-- ---------------------------------------------------------------------------
create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  fitcheck_id uuid not null unique references public.fitchecks (id) on delete cascade,
  overall_score numeric(3, 1) not null,
  photo_quality_note text,
  color_score numeric(3, 1) not null,
  color_reason text not null,
  color_improvement text not null,
  fit_score numeric(3, 1) not null,
  fit_reason text not null,
  fit_improvement text not null,
  style_score numeric(3, 1) not null,
  style_reason text not null,
  style_improvement text not null,
  accessory_score numeric(3, 1) not null,
  accessory_reason text not null,
  accessory_improvement text not null,
  summary text not null,
  created_at timestamptz not null default now()
);

alter table public.analyses enable row level security;

create policy "Analyses are readable if their fitcheck is readable"
  on public.analyses for select
  using (
    exists (
      select 1 from public.fitchecks f
      where f.id = analyses.fitcheck_id
        and (f.user_id = auth.uid() or f.visibility = 'public')
    )
  );

create policy "Owners can insert analyses for their own fitchecks"
  on public.analyses for insert
  with check (
    exists (
      select 1 from public.fitchecks f
      where f.id = analyses.fitcheck_id and f.user_id = auth.uid()
    )
  );

create policy "Owners can delete analyses for their own fitchecks"
  on public.analyses for delete
  using (
    exists (
      select 1 from public.fitchecks f
      where f.id = analyses.fitcheck_id and f.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- likes
-- ---------------------------------------------------------------------------
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  fitcheck_id uuid not null references public.fitchecks (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (fitcheck_id, user_id)
);

alter table public.likes enable row level security;

create policy "Likes are readable on visible fitchecks"
  on public.likes for select
  using (
    exists (
      select 1 from public.fitchecks f
      where f.id = likes.fitcheck_id and (f.visibility = 'public' or f.user_id = auth.uid())
    )
  );

create policy "Users can like public fitchecks"
  on public.likes for insert
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.fitchecks f where f.id = fitcheck_id and f.visibility = 'public')
  );

create policy "Users can remove their own like"
  on public.likes for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- comments
-- ---------------------------------------------------------------------------
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  fitcheck_id uuid not null references public.fitchecks (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  comment text not null check (char_length(comment) between 1 and 1000),
  created_at timestamptz not null default now()
);

alter table public.comments enable row level security;

create policy "Comments are readable on visible fitchecks"
  on public.comments for select
  using (
    exists (
      select 1 from public.fitchecks f
      where f.id = comments.fitcheck_id and (f.visibility = 'public' or f.user_id = auth.uid())
    )
  );

create policy "Users can comment on public fitchecks"
  on public.comments for insert
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.fitchecks f where f.id = fitcheck_id and f.visibility = 'public')
  );

create policy "Users can delete their own comments"
  on public.comments for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- bookmarks
-- ---------------------------------------------------------------------------
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  fitcheck_id uuid not null references public.fitchecks (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (fitcheck_id, user_id)
);

alter table public.bookmarks enable row level security;

create policy "Users can view their own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can bookmark public fitchecks"
  on public.bookmarks for insert
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.fitchecks f where f.id = fitcheck_id and f.visibility = 'public')
  );

create policy "Users can remove their own bookmark"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('like', 'comment', 'follower', 'mention', 'system')),
  reference_id uuid,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_id_idx on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

create policy "Users can view their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update their own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- storage: fitcheck images, stored at {user_id}/{filename}
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('fitchecks', 'fitchecks', true)
on conflict (id) do nothing;

create policy "Fitcheck images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'fitchecks');

create policy "Users can upload to their own fitcheck folder"
  on storage.objects for insert
  with check (
    bucket_id = 'fitchecks'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete from their own fitcheck folder"
  on storage.objects for delete
  using (
    bucket_id = 'fitchecks'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
