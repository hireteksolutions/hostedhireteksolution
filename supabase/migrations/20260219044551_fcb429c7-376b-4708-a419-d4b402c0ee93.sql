
-- Drop existing policies and recreate as permissive
DROP POLICY IF EXISTS "Employers can view resumes for their job applications" ON storage.objects;

CREATE POLICY "Anyone can read resumes"
ON storage.objects
FOR SELECT
USING (bucket_id = 'resumes');
