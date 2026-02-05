-- Enable the pgvector extension for embeddings
create extension if not exists vector;

-- 1. ITEMS Table (Holds Lost & Found items)
create table if not exists public.items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null, -- Links to Supabase Auth user
  type text check (type in ('lost', 'found')) not null,
  category text not null,
  title text not null,
  description text,
  location text not null,
  date_reported date default current_date not null,
  status text default 'pending' not null, -- pending, resolved, claimed
  image_url text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. ITEM CLAIMS Table (Holds requests to claim/match items)
create table if not exists public.item_claims (
  id uuid default gen_random_uuid() primary key,
  item_id uuid references public.items(id) on delete cascade not null,
  claimer_id uuid references auth.users not null,
  status text default 'pending' not null, -- pending, approved, rejected
  message text, -- Optional message from claimer
  proof_url text, -- Optional proof image
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Prepare Vector Search (NLP)
-- Drop the column if it exists with wrong dimensions (to be safe) and recreate it with 384 dims
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'items' AND column_name = 'description_embedding') THEN
        ALTER TABLE public.items DROP COLUMN description_embedding;
    END IF;
END $$;

ALTER TABLE public.items ADD COLUMN description_embedding vector(384);

-- 4. Enable Row Level Security (RLS)
alter table public.items enable row level security;
alter table public.item_claims enable row level security;

-- Policies (Simple public access for demo, restrict for prod)
create policy "Items are viewable by everyone" on public.items for select using (true);
create policy "Users can insert their own items" on public.items for insert with check (auth.uid() = user_id);
create policy "Users can update their own items" on public.items for update using (auth.uid() = user_id);

create policy "Claims are viewable by items owner or claimer" on public.item_claims for select using (
  auth.uid() = claimer_id OR 
  exists (select 1 from public.items where items.id = item_claims.item_id and items.user_id = auth.uid())
);
create policy "Users can insert claims" on public.item_claims for insert with check (auth.uid() = claimer_id);


-- 5. MATCHING FUNCTION (The "Smart Match" logic)
-- This is a FUNCTION, not a table. It runs the semantic search.
DROP FUNCTION IF EXISTS match_items;

create or replace function match_items (
  query_embedding vector(384),
  match_threshold float,
  match_count int,
  item_type text
)
returns table (
  id uuid,
  title text,
  description text,
  image_url text,
  location text,
  date_reported date,
  category text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    items.id,
    items.title,
    items.description,
    items.image_url,
    items.location,
    items.date_reported,
    items.category,
    1 - (items.description_embedding <=> query_embedding) as similarity
  from items
  where items.type = item_type
    and 1 - (items.description_embedding <=> query_embedding) > match_threshold
  order by items.description_embedding <=> query_embedding
  limit match_count;
end;
$$;
