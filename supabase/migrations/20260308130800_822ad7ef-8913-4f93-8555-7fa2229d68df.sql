
-- 1. Add trigger to force reservation status to 'pending' on insert
CREATE OR REPLACE FUNCTION public.enforce_pending_status()
RETURNS TRIGGER AS $$
BEGIN
  NEW.status := 'pending';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

CREATE TRIGGER set_reservation_status_pending
  BEFORE INSERT ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.enforce_pending_status();

-- 2. Tighten the INSERT policy to also require status = 'pending'
ALTER POLICY "Anyone can create reservations" ON public.reservations
  WITH CHECK (status = 'pending');

-- 3. Restrict has_role to only check the calling user's own ID
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = _role
  )
$$;
