-- Orders table: customer ad purchases
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  package_id uuid not null references public.packages(id),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'matched', 'printing', 'completed')),
  poster_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.update_updated_at();

-- RLS
alter table public.orders enable row level security;

-- Customers can read their own orders
create policy "Customers can read own orders"
  on public.orders for select
  using (auth.uid() = customer_id);

-- Customers can insert their own orders
create policy "Customers can create orders"
  on public.orders for insert
  with check (auth.uid() = customer_id);

-- Admins can read all orders
create policy "Admins can read all orders"
  on public.orders for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Admins can update any order
create policy "Admins can update all orders"
  on public.orders for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
