-- IMPORTANT: Run this in your Supabase SQL Editor to enable the new local NLP model.

-- 1. Drop the old function first as it depends on the column type
DROP FUNCTION IF EXISTS match_items;

-- 2. Alter the items table to use 384 dimensions (for Xenova/all-MiniLM-L6-v2) instead of 1536 (OpenAI)
-- Note: If you have existing data in this column, this might fail unless you truncate it.
-- Since it's a new project, we'll assume it's okay to reset this column.
ALTER TABLE public.items DROP COLUMN IF EXISTS description_embedding;
ALTER TABLE public.items ADD COLUMN description_embedding vector(384);

-- 3. Re-create the matching function with the new dimensionality
create or replace function match_items (
  query_embedding vector(384), -- Changed from 1536 to 384
  match_threshold float,
  match_count int,
  item_type text
)
returns table (
  id uuid,
  title text,
  description text,
  image_url text, -- Added useful fields
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
  where items.type = item_type -- We usually search for ITEMS of a specific type (e.g. searching for 'found' items)
    and 1 - (items.description_embedding <=> query_embedding) > match_threshold
  order by items.description_embedding <=> query_embedding
  limit match_count;
end;
$$;
