
-- Create gallery bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES ('gallery', 'gallery', true, false)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow authenticated users to upload images
CREATE POLICY "Allow users to upload their own gallery images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Policy to allow authenticated users to update their own images
CREATE POLICY "Allow users to update their own gallery images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Policy to allow authenticated users to delete their own images
CREATE POLICY "Allow users to delete their own gallery images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gallery' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Policy to allow public access to gallery images
CREATE POLICY "Allow public to see all gallery images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery');
