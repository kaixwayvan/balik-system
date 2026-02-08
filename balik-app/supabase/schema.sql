-- Enable the pgvector extension to work with embeddings for NLP smart matching
create extension if not exists vector;

-- Profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  username text unique,
  mobile_number text,
  points integer default 0,
  level integer default 0,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Items table (Lost and Found)
create table public.items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade, -- Nullable for anonymous reports
  type text check (type in ('lost', 'found')) not null,
  category text not null,
  title text not null,
  description text,
  location text not null,
  date_reported date default current_date not null,
  time_reported text,
  status text default 'pending' not null, -- pending, matching, resolved, claimed
  image_url text,
  -- For NLP vector search
  description_embedding vector(384), -- Matches Xenova model dimension (384)
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Item Claims/Matches
create table public.item_claims (
  id uuid default gen_random_uuid() primary key,
  item_id uuid references public.items(id) on delete cascade not null,
  claimer_id uuid references public.profiles(id) on delete cascade not null,
  status text default 'pending' not null, -- pending, approved, rejected
  verification_code text, -- For QR code verification
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Achievements
create table public.achievements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  unlocked boolean default false,
  progress integer default 0,
  icon_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security)
alter table public.profiles enable row level security;
alter table public.items enable row level security;
alter table public.item_claims enable row level security;
alter table public.achievements enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

create policy "Items are viewable by everyone." on public.items for select using (true);
create policy "Anyone can insert items." on public.items for insert with check (true);
create policy "Users can update their own items." on public.items for update using (auth.uid() = user_id);

-- NLP Smart Matching Function (Basic Vector Similarity)
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
    1 - (items.description_embedding <=> query_embedding) as similarity
  from items
  where items.type != item_type -- Find opposite types (if searching for 'lost', find 'found')
    and 1 - (items.description_embedding <=> query_embedding) > match_threshold
  order by items.description_embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Trigger to automatically create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, mobile_number)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'mobile_number');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
