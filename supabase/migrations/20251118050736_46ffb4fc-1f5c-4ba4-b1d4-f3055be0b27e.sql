-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('employer', 'job_seeker', 'admin');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- RLS policies for jobs
CREATE POLICY "Anyone can view active jobs"
  ON public.jobs FOR SELECT
  USING (status = 'active' OR employer_id = auth.uid());

CREATE POLICY "Employers can create their own jobs"
  ON public.jobs FOR INSERT
  WITH CHECK (
    auth.uid() = employer_id AND
    public.has_role(auth.uid(), 'employer')
  );

CREATE POLICY "Employers can update their own jobs"
  ON public.jobs FOR UPDATE
  USING (auth.uid() = employer_id)
  WITH CHECK (auth.uid() = employer_id);

CREATE POLICY "Employers can delete their own jobs"
  ON public.jobs FOR DELETE
  USING (auth.uid() = employer_id);

-- Create applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  applicant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  applicant_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  resume_url TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- RLS policies for applications
CREATE POLICY "Employers can view applications for their jobs"
  ON public.applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = applications.job_id
      AND jobs.employer_id = auth.uid()
    )
    OR applicant_id = auth.uid()
  );

CREATE POLICY "Anyone can create applications"
  ON public.applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Employers can update applications for their jobs"
  ON public.applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = applications.job_id
      AND jobs.employer_id = auth.uid()
    )
  );

-- Trigger for updating updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();