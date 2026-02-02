-- Create blog_images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog_images', 'blog_images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for blog images
CREATE POLICY "Anyone can view blog images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'blog_images');

CREATE POLICY "Employers can upload blog images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'blog_images' AND 
  (SELECT has_role(auth.uid(), 'employer'::app_role))
);

CREATE POLICY "Employers can update their blog images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'blog_images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Employers can delete their blog images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'blog_images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);