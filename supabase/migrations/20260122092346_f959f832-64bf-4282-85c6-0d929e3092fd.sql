-- Update jobs policies to include admin access
DROP POLICY IF EXISTS "Employers can create their own jobs" ON public.jobs;
CREATE POLICY "Employers and admins can create jobs" 
ON public.jobs 
FOR INSERT 
WITH CHECK (
  (auth.uid() = employer_id AND has_role(auth.uid(), 'employer'::app_role))
  OR has_role(auth.uid(), 'admin'::app_role)
);

DROP POLICY IF EXISTS "Employers can update their own jobs" ON public.jobs;
CREATE POLICY "Employers and admins can update jobs" 
ON public.jobs 
FOR UPDATE 
USING (
  (auth.uid() = employer_id)
  OR has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  (auth.uid() = employer_id)
  OR has_role(auth.uid(), 'admin'::app_role)
);

DROP POLICY IF EXISTS "Employers can delete their own jobs" ON public.jobs;
CREATE POLICY "Employers and admins can delete jobs" 
ON public.jobs 
FOR DELETE 
USING (
  (auth.uid() = employer_id)
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Update blogs policies to include admin access
DROP POLICY IF EXISTS "Employers can create their own blogs" ON public.blogs;
CREATE POLICY "Employers and admins can create blogs" 
ON public.blogs 
FOR INSERT 
WITH CHECK (
  (auth.uid() = author_id AND has_role(auth.uid(), 'employer'::app_role))
  OR has_role(auth.uid(), 'admin'::app_role)
);

DROP POLICY IF EXISTS "Employers can update their own blogs" ON public.blogs;
CREATE POLICY "Employers and admins can update blogs" 
ON public.blogs 
FOR UPDATE 
USING (
  (auth.uid() = author_id)
  OR has_role(auth.uid(), 'admin'::app_role)
);

DROP POLICY IF EXISTS "Employers can delete their own blogs" ON public.blogs;
CREATE POLICY "Employers and admins can delete blogs" 
ON public.blogs 
FOR DELETE 
USING (
  (auth.uid() = author_id)
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Update applications policies to allow admin to view ALL applications
DROP POLICY IF EXISTS "Employers can view applications for their jobs" ON public.applications;
CREATE POLICY "Employers and admins can view applications" 
ON public.applications 
FOR SELECT 
USING (
  (EXISTS (
    SELECT 1 FROM jobs
    WHERE jobs.id = applications.job_id 
    AND jobs.employer_id = auth.uid()
  ))
  OR (applicant_id = auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admin to update any application status
DROP POLICY IF EXISTS "Employers can update applications for their jobs" ON public.applications;
CREATE POLICY "Employers and admins can update applications" 
ON public.applications 
FOR UPDATE 
USING (
  (EXISTS (
    SELECT 1 FROM jobs
    WHERE jobs.id = applications.job_id 
    AND jobs.employer_id = auth.uid()
  ))
  OR has_role(auth.uid(), 'admin'::app_role)
);