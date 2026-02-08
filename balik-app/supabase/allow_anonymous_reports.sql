-- Allow items to be reported without a user_id (anonymous/non-logged-in)
ALTER TABLE public.items ALTER COLUMN user_id DROP NOT NULL;

-- Update the insert policy for items to allow anyone (anon or authenticated) to insert FOUND items
-- Lost items should still probably require an account to track properly, but the user specifically asked for "found item in the home page"
DROP POLICY IF EXISTS "Users can insert their own items." ON public.items;

-- New policy: Authenticated users can insert their own items (lost or found)
CREATE POLICY "Authenticated users can insert items." 
ON public.items FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- New policy: Anonymous users can insert items (specifically intended for 'found' items via Home page)
CREATE POLICY "Anonymous users can report found items." 
ON public.items FOR INSERT 
TO anon 
WITH CHECK (type = 'found' AND user_id IS NULL);
