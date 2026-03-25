INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true);

CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'images');

CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'images');