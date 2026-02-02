-- Drop the overly permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can create applications" ON applications;

-- Create secure INSERT policy that requires authentication
CREATE POLICY "Authenticated users can create applications"
ON applications FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = applicant_id);

-- Allow applicants to update their own applications
CREATE POLICY "Applicants can update own applications"
ON applications FOR UPDATE
USING (auth.uid() = applicant_id);

-- Allow applicants to delete their own applications (GDPR compliance)
CREATE POLICY "Applicants can delete own applications"
ON applications FOR DELETE
USING (auth.uid() = applicant_id);