-- Enable the pgvector extension to work with embeddings
create extension if not exists vector;

-- Add an embedding column to your items table if it doesn't exist
-- It should be 384 dimensions to match 'all-MiniLM-L6-v2'
alter table items add column if not exists embedding vector(384);

-- Create the match_items function for NLP similarity search
create or replace function match_items (
  query_embedding vector(384),
  match_threshold float,
  match_count int,
  item_type text
)
returns table (
  id uuid,
  title text,
  category text,
  description text,
  location text,
  image_url text,
  date_reported date,
  type text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    items.id,
    items.title,
    items.category,
    items.description,
    items.location,
    items.image_url,
    items.date_reported,
    items.type,
    1 - (items.embedding <=> query_embedding) as similarity
  from items
  where items.type = item_type
    and 1 - (items.embedding <=> query_embedding) > match_threshold
  order by items.embedding <=> query_embedding
  limit match_count;
end;
$$;
