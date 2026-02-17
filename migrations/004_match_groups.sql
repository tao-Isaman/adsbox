-- Match groups: groups of 4 customers with same package for printing
create table public.match_groups (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.packages(id),
  name text not null,
  status text not null default 'pending'
    check (status in ('pending', 'printing', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger match_groups_updated_at
  before update on public.match_groups
  for each row execute function public.update_updated_at();

-- Junction table: match group members
create table public.match_group_members (
  id uuid primary key default gen_random_uuid(),
  match_group_id uuid not null references public.match_groups(id) on delete cascade,
  order_id uuid not null references public.orders(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (match_group_id, order_id)
);

-- RLS for match_groups
alter table public.match_groups enable row level security;

-- Admins can fully manage match groups
create policy "Admins can manage match groups"
  on public.match_groups for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Customers can see match groups they belong to
create policy "Customers can read own match groups"
  on public.match_groups for select
  using (
    exists (
      select 1 from public.match_group_members mgm
      join public.orders o on o.id = mgm.order_id
      where mgm.match_group_id = match_groups.id
        and o.customer_id = auth.uid()
    )
  );

-- RLS for match_group_members
alter table public.match_group_members enable row level security;

-- Admins can fully manage members
create policy "Admins can manage match group members"
  on public.match_group_members for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Customers can read their own match group memberships
create policy "Customers can read own match group members"
  on public.match_group_members for select
  using (
    exists (
      select 1 from public.orders
      where id = match_group_members.order_id
        and customer_id = auth.uid()
    )
  );
