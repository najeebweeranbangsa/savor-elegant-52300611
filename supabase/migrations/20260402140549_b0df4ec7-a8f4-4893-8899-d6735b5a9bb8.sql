ALTER TABLE public.menu_categories ADD COLUMN archived boolean NOT NULL DEFAULT false;
ALTER TABLE public.menu_items ADD COLUMN archived boolean NOT NULL DEFAULT false;