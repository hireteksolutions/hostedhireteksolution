
-- Drop the restrictive policy
DROP POLICY IF EXISTS "Anyone can create applications" ON public.applications;

-- Recreate as permissive
CREATE POLICY "Anyone can create applications"
ON public.applications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
