-- Optional Supabase table for persisting Markaz COD & Reseller orders
create table if not exists public.markaz_orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique,
  customer_name text not null,
  customer_phone text not null,
  city text not null,
  address text not null,
  payment_method text not null,
  status text not null,
  subtotal integer not null,
  delivery_fee integer not null,
  total_payable integer not null,
  total_reseller_profit integer not null default 0,
  items jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.markaz_orders enable row level security;

drop policy if exists "Allow public insert for guest COD checkout" on public.markaz_orders;

create policy "Allow public insert for guest COD checkout"
  on public.markaz_orders
  for insert
  to anon, authenticated
  with check (true);
