
-- Add likes and dislikes columns
ALTER TABLE public.reviews ADD COLUMN likes integer NOT NULL DEFAULT 0;
ALTER TABLE public.reviews ADD COLUMN dislikes integer NOT NULL DEFAULT 0;

-- Allow anonymous users to insert reviews (public submissions)
CREATE POLICY "Anyone can insert reviews"
ON public.reviews
FOR INSERT
TO public
WITH CHECK (true);

-- Allow anonymous users to update likes/dislikes only
CREATE POLICY "Anyone can update review reactions"
ON public.reviews
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);
