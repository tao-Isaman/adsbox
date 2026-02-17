-- Packages table: predefined ad packages
create table public.packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  box_amount integer not null,
  price numeric(10, 2) not null,
  is_contact_us boolean not null default false,
  created_at timestamptz not null default now()
);

-- RLS: all authenticated users can read packages
alter table public.packages enable row level security;

create policy "Authenticated users can read packages"
  on public.packages for select
  to authenticated
  using (true);

-- Seed the 4 predefined packages
insert into public.packages (name, box_amount, price, is_contact_us) values
  ('10,000 Boxes', 10000, 14000.00, false),
  ('30,000 Boxes', 30000, 39000.00, false),
  ('50,000 Boxes', 50000, 60000.00, false),
  ('More than 50,000', 0, 0.00, true);
