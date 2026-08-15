-- Close loops are a different format from Warm stories and Rest.
-- Stories stay 8–20 min narrative. Close is 3–7 min, written to be replayed.

alter table session_families
  add column if not exists format text not null default 'story'
    check (format in ('close', 'story', 'rest'));

create index if not exists session_families_format_idx on session_families (format);
