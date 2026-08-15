-- Selfish — initial schema.
-- Catalog is first-party, pre-rendered content published by the pipeline
-- (/packages/pipeline). Clients only ever read the catalog; there is no
-- generation path reachable from any client (the "no runtime generation"
-- invariant, documented in docs/PLAN.md §6).

-- ————— Enums —————
create type shelf as enum ('desire', 'rest');
create type heat_level as enum ('comfort', 'slow-burn', 'spicy');
create type pace as enum ('slow', 'measured');
create type voice_gender as enum ('M', 'F', 'NB');

-- ————— Narrators & voices (licensing is first-class, not an afterthought) —————
create table narrators (
  id uuid primary key default gen_random_uuid(),
  legal_name text not null,
  public_credit text not null,
  -- License must explicitly cover synthetic erotic performance (ELVIS-Act-aware).
  license_doc_url text not null,
  license_covers_erotic boolean not null default false,
  license_signed_at timestamptz not null,
  revenue_share_bps integer not null check (revenue_share_bps between 0 and 10000),
  created_at timestamptz not null default now()
);

create table voices (
  id text primary key,                -- e.g. 'v-jasper'
  name text not null,
  gender voice_gender not null,
  descriptor text not null,
  accent text not null,
  narrator_id uuid not null references narrators(id),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ————— Series & sessions —————
create table series (
  id text primary key,                -- e.g. 's-latekeys'
  title text not null,
  blurb text not null,
  voice_id text not null references voices(id),
  created_at timestamptz not null default now()
);

create table session_families (
  id text primary key,                -- e.g. 'f-back-to-yours'
  shelf shelf not null,
  title text not null,
  blurb text not null,
  dynamic text not null,
  voice_id text not null references voices(id),
  series_id text references series(id),
  episode integer,
  moods text[] not null default '{}',
  tags text[] not null default '{}',
  content_notes text[] not null default '{}',
  heat_min heat_level not null,
  heat_max heat_level not null,
  published boolean not null default false,
  -- Full provenance: brief → prompt → script → classifier verdict → approver → render.
  audit_manifest jsonb not null,
  created_at timestamptz not null default now()
);

create table session_variants (
  id text primary key,                -- e.g. 'f-back-to-yours-2'
  family_id text not null references session_families(id) on delete cascade,
  label text not null,
  heat heat_level not null,
  pace pace not null,
  extended_buildup boolean not null default false,
  duration_sec integer not null check (duration_sec > 0),
  -- Storage path of the pre-rendered, watermarked master. Never generated on demand.
  audio_path text not null,
  loudness_lufs numeric,
  created_at timestamptz not null default now()
);

-- ————— Users —————
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  -- Declared age gate (client) + Apple Declared Age Range (server notification) both recorded.
  age_confirmed_at timestamptz,
  ai_disclosure_accepted_at timestamptz,
  heat_cap heat_level not null default 'comfort',
  moods text[] not null default '{}',
  hard_limits text[] not null default '{}',
  discreet_mode boolean not null default true,
  created_at timestamptz not null default now()
);

create table entitlements (
  user_id uuid primary key references profiles(id) on delete cascade,
  plan text not null default 'free',  -- 'free' | 'plus-monthly' | 'plus-annual'
  source text,                        -- 'iap' | 'web'
  active_until timestamptz,
  updated_at timestamptz not null default now()
);

create table listening_progress (
  user_id uuid not null references profiles(id) on delete cascade,
  family_id text not null references session_families(id) on delete cascade,
  variant_id text not null references session_variants(id) on delete cascade,
  progress numeric not null check (progress between 0 and 1),
  updated_at timestamptz not null default now(),
  primary key (user_id, family_id)
);

create table ratings (
  user_id uuid not null references profiles(id) on delete cascade,
  family_id text not null references session_families(id) on delete cascade,
  stars integer not null check (stars between 1 and 5),
  created_at timestamptz not null default now(),
  primary key (user_id, family_id)
);

-- Per-variant preference events: the data moat (skip / replay / dial-down at
-- variant granularity). Drives recommendations and commissioning decisions.
create table preference_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  variant_id text not null references session_variants(id) on delete cascade,
  event text not null check (event in ('play', 'finish', 'skip', 'replay', 'switch_softer', 'switch_further', 'switch_slower')),
  at_progress numeric check (at_progress between 0 and 1),
  created_at timestamptz not null default now()
);

-- ————— Row-level security —————
alter table narrators enable row level security;   -- no client access at all
alter table voices enable row level security;
alter table series enable row level security;
alter table session_families enable row level security;
alter table session_variants enable row level security;
alter table profiles enable row level security;
alter table entitlements enable row level security;
alter table listening_progress enable row level security;
alter table ratings enable row level security;
alter table preference_events enable row level security;

-- Catalog: readable by any authenticated user; only published content.
create policy "read voices" on voices for select to authenticated using (active);
create policy "read series" on series for select to authenticated using (true);
create policy "read published families" on session_families for select to authenticated using (published);
create policy "read variants of published families" on session_variants for select to authenticated
  using (exists (select 1 from session_families f where f.id = family_id and f.published));

-- Personal data: owner-only.
create policy "own profile" on profiles for all to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
create policy "own entitlement read" on entitlements for select to authenticated
  using (user_id = auth.uid());
create policy "own progress" on listening_progress for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own ratings" on ratings for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own preference events" on preference_events for insert to authenticated
  with check (user_id = auth.uid());

-- Aggregated (anonymous) rating exposed via a view; individual rows stay private.
create view family_ratings as
  select family_id, round(avg(stars)::numeric, 1) as rating, count(*) as votes
  from ratings group by family_id;
