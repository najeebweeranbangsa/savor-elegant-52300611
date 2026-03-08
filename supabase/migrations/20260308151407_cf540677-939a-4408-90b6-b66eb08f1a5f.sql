
-- Add slug column
ALTER TABLE public.blog_posts ADD COLUMN slug text UNIQUE;

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION public.generate_blog_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug text;
  new_slug text;
  counter integer := 0;
BEGIN
  -- Generate base slug: lowercase, replace non-alphanumeric with hyphens, trim hyphens
  base_slug := lower(NEW.title);
  base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  
  new_slug := base_slug;
  
  -- Handle uniqueness
  LOOP
    IF NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = new_slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) THEN
      EXIT;
    END IF;
    counter := counter + 1;
    new_slug := base_slug || '-' || counter;
  END LOOP;
  
  NEW.slug := new_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

CREATE TRIGGER set_blog_slug
  BEFORE INSERT OR UPDATE OF title ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.generate_blog_slug();

-- Backfill existing posts
UPDATE public.blog_posts SET slug = lower(regexp_replace(trim(both '-' from regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g')), '-+', '-', 'g')) WHERE slug IS NULL;

-- Now make it NOT NULL
ALTER TABLE public.blog_posts ALTER COLUMN slug SET NOT NULL;
