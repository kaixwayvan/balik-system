-- RLS Policy Fix for Anonymous Found Item Submissions from Home Page
-- This script ensures that anonymous users can submit found items without login

-- Step 1: Allow user_id to be NULL (for anonymous submissions)
ALTER TABLE public.items ALTER COLUMN user_id DROP NOT NULL;

-- Step 2: Drop old policies if they exist
DROP POLICY IF EXISTS "Users can insert their own items." ON public.items;
DROP POLICY IF EXISTS "Authenticated users can insert items." ON public.items;
DROP POLICY IF EXISTS "Anonymous users can report found items." ON public.items;

-- Step 3: Create policy for authenticated users
-- Authenticated users can insert their own items (lost or found)
CREATE POLICY "Authenticated users can insert items" 
ON public.items FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Step 4: Create policy for anonymous users  
-- Anonymous users can report found items (specifically for Home page submissions)
CREATE POLICY "Anonymous users can report found items" 
ON public.items FOR INSERT 
TO anon 
WITH CHECK (type = 'found' AND user_id IS NULL);

-- Step 5: Ensure RLS is enabled on the items table
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Verification query (optional - shows current policies)
-- SELECT * FROM pg_policies WHERE tablename = 'items';
