-- Multi-Factor NLP Matching Logic for BALIK
-- This function calculates a weighted score based on Category, Color, Location, NLP Similarity, and Time.
-- Weights: Category (Required), Color (20%), Location (15%), NLP Description (50%), Time (15%)

-- 1. Drop existing function
DROP FUNCTION IF EXISTS match_items;

-- 2. Create the advanced matching function
CREATE OR REPLACE FUNCTION match_items (
  query_embedding vector(384),
  match_threshold float,
  match_count int,
  item_type text,
  -- Multi-factor params
  query_category text DEFAULT NULL,
  query_color text DEFAULT NULL,
  query_location text DEFAULT NULL,
  query_date date DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  image_url text,
  location text,
  date_reported date,
  category text,
  similarity float -- This will store the final weighted score
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    items.id,
    items.title,
    items.description,
    items.image_url,
    items.location,
    items.date_reported,
    items.category,
    (
      -- 1. Description NLP Similarity (50%)
      COALESCE((1 - (items.description_embedding <=> query_embedding)), 0) * 0.50 +
      
      -- 2. Color Match (20%)
      (CASE 
        WHEN query_color IS NOT NULL AND items.metadata->>'color' IS NOT NULL AND LOWER(items.metadata->>'color') = LOWER(query_color) THEN 0.20 
        WHEN query_color IS NOT NULL AND items.metadata->>'color' IS NOT NULL AND 
             (LOWER(items.metadata->>'color') LIKE '%' || LOWER(query_color) || '%' OR 
              LOWER(query_color) LIKE '%' || LOWER(items.metadata->>'color') || '%') THEN 0.10
        ELSE 0 
      END) +
      
      -- 3. Location Proximity (15%)
      (CASE 
        WHEN query_location IS NOT NULL AND LOWER(items.location) = LOWER(query_location) THEN 0.15 
        ELSE 0 
      END) +
      
      -- 4. Time Proximity (15%)
      (CASE 
        WHEN query_date IS NOT NULL AND items.date_reported IS NOT NULL AND 
             ABS(EXTRACT(EPOCH FROM (items.date_reported::timestamp - query_date::timestamp))) / 86400 <= 1 THEN 0.15
        WHEN query_date IS NOT NULL AND items.date_reported IS NOT NULL AND 
             ABS(EXTRACT(EPOCH FROM (items.date_reported::timestamp - query_date::timestamp))) / 86400 <= 3 THEN 0.07
        ELSE 0 
      END)
    ) AS similarity
  FROM items
  WHERE 
    items.type = item_type
    AND (query_category IS NULL OR items.category = query_category)
    AND (
      (
        COALESCE((1 - (items.description_embedding <=> query_embedding)), 0) * 0.50 +
        -- Include partial color match scoring
        (CASE 
          WHEN query_color IS NOT NULL AND items.metadata->>'color' IS NOT NULL AND LOWER(items.metadata->>'color') = LOWER(query_color) THEN 0.20 
          WHEN query_color IS NOT NULL AND items.metadata->>'color' IS NOT NULL AND 
               (LOWER(items.metadata->>'color') LIKE '%' || LOWER(query_color) || '%' OR 
                LOWER(query_color) LIKE '%' || LOWER(items.metadata->>'color') || '%') THEN 0.10
          ELSE 0 
        END) +
        (CASE WHEN query_location IS NOT NULL AND LOWER(items.location) = LOWER(query_location) THEN 0.15 ELSE 0 END) +
        -- Include 3-day time proximity scoring
        (CASE 
          WHEN query_date IS NOT NULL AND items.date_reported IS NOT NULL AND 
               ABS(EXTRACT(EPOCH FROM (items.date_reported::timestamp - query_date::timestamp))) / 86400 <= 1 THEN 0.15
          WHEN query_date IS NOT NULL AND items.date_reported IS NOT NULL AND 
               ABS(EXTRACT(EPOCH FROM (items.date_reported::timestamp - query_date::timestamp))) / 86400 <= 3 THEN 0.07
          ELSE 0 
        END)
      ) >= match_threshold
    )
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
