
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS archived boolean NOT NULL DEFAULT false;

-- Generate slugs for existing events
UPDATE public.events SET slug = lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'), '^-|-$', '', 'g')) || '-' || substr(id::text, 1, 8) WHERE slug IS NULL;

ALTER TABLE public.events ALTER COLUMN slug SET NOT NULL;
ALTER TABLE public.events ADD CONSTRAINT events_slug_unique UNIQUE (slug);

-- Slug generation trigger
CREATE OR REPLACE FUNCTION public.generate_event_slug()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  base_slug text;
  new_slug text;
  counter integer := 0;
BEGIN
  base_slug := lower(NEW.title);
  base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  
  new_slug := base_slug;
  
  LOOP
    IF NOT EXISTS (SELECT 1 FROM public.events WHERE slug = new_slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) THEN
      EXIT;
    END IF;
    counter := counter + 1;
    new_slug := base_slug || '-' || counter;
  END LOOP;
  
  NEW.slug := new_slug;
  RETURN NEW;
END;
$$;

CREATE TRIGGER generate_event_slug_trigger
  BEFORE INSERT OR UPDATE OF title ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.generate_event_slug();
