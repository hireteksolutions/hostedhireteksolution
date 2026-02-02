-- Create blogs table
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view published blogs"
ON public.blogs
FOR SELECT
USING (status = 'published');

CREATE POLICY "Employers can create their own blogs"
ON public.blogs
FOR INSERT
WITH CHECK (auth.uid() = author_id AND has_role(auth.uid(), 'employer'::app_role));

CREATE POLICY "Employers can update their own blogs"
ON public.blogs
FOR UPDATE
USING (auth.uid() = author_id);

CREATE POLICY "Employers can delete their own blogs"
ON public.blogs
FOR DELETE
USING (auth.uid() = author_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_blogs_updated_at
BEFORE UPDATE ON public.blogs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();