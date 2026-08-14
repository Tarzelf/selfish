-- Phase 0 schema sketch for Selfish (apply when Supabase project exists)

create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  age_confirmed_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists desire_prefs (
  user_id uuid primary key references profiles(id) on delete cascade,
  mood_defaults jsonb default '{}'::jsonb,
  voice_id text,
  intensity_default int check (intensity_default between 1 and 5),
  updated_at timestamptz default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  mood text not null,
  intensity int not null,
  voice_id text not null,
  intention text,
  script jsonb,
  audio_path text,
  status text not null default 'pending',
  created_at timestamptz default now()
);

create table if not exists session_feedback (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  felt_for_me int check (felt_for_me between 1 and 5),
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table desire_prefs enable row level security;
alter table sessions enable row level security;
alter table session_feedback enable row level security;
