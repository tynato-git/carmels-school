-- =========================================================
-- HOME POPUP BANNER TABLE
-- Controls the popup shown when a visitor first opens the
-- website. Each row is either:
--   banner_type = 'poster'  -> a custom image poster
--   banner_type = 'toppers' -> a trigger to show the existing
--                              Academic Toppers Announcement
--                              (academic_toppers / results_announcement)
-- Follow the same RLS pattern already used for carousel_slides /
-- academic_toppers in this project: public can read active rows,
-- only authenticated admin users can write.
-- =========================================================

create table if not exists public.home_banners (
  id uuid primary key default gen_random_uuid(),
  banner_type text not null default 'poster' check (banner_type in ('poster', 'toppers')),
  title text,
  subtitle text,
  image_url text,
  link_url text,
  is_active boolean not null default true,
  display_order integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.home_banners enable row level security;

-- Public (anon) can read only active banners — this is what the
-- website's popup-on-load logic queries.
create policy "Public can view active home banners"
  on public.home_banners
  for select
  to anon, authenticated
  using (is_active = true);

-- Authenticated admin users can read every banner (active or not),
-- so the Admin Dashboard list shows everything.
create policy "Admins can view all home banners"
  on public.home_banners
  for select
  to authenticated
  using (true);

create policy "Admins can insert home banners"
  on public.home_banners
  for insert
  to authenticated
  with check (true);

create policy "Admins can update home banners"
  on public.home_banners
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Admins can delete home banners"
  on public.home_banners
  for delete
  to authenticated
  using (true);

-- Optional: keep updated_at fresh automatically (mirrors other tables' behavior)
create or replace function public.set_home_banners_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_home_banners_updated_at on public.home_banners;
create trigger trg_home_banners_updated_at
  before update on public.home_banners
  for each row execute function public.set_home_banners_updated_at();
