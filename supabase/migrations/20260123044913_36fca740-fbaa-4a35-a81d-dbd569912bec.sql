-- Add slug column to blogs table
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS slug text UNIQUE;

-- Add slug column to jobs table  
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS slug text UNIQUE;

-- Create function to generate slug from text
CREATE OR REPLACE FUNCTION public.generate_slug(title text)
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 0;
BEGIN
  -- Convert to lowercase, replace spaces and special chars with hyphens
  base_slug := lower(trim(title));
  base_slug := regexp_replace(base_slug, '[^a-z0-9\s-]', '', 'g');
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  
  -- Limit length
  base_slug := left(base_slug, 100);
  
  RETURN base_slug;
END;
$$;

-- Update existing blogs with slugs
UPDATE public.blogs 
SET slug = generate_slug(title) || '-' || left(id::text, 8)
WHERE slug IS NULL;

-- Update existing jobs with slugs
UPDATE public.jobs 
SET slug = generate_slug(title) || '-' || left(id::text, 8)
WHERE slug IS NULL;

-- Make slug NOT NULL after populating
ALTER TABLE public.blogs ALTER COLUMN slug SET NOT NULL;
ALTER TABLE public.jobs ALTER COLUMN slug SET NOT NULL;