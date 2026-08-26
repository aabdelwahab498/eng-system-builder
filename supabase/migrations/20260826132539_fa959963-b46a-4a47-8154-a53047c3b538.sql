CREATE TABLE public.service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  email text,
  whatsapp text,
  service_id text,
  service_title text,
  project_name text,
  description text,
  platform text,
  scope text,
  budget text,
  timeline text,
  preferred_channel text,
  attachment_url text,
  locale text NOT NULL DEFAULT 'en',
  source text NOT NULL DEFAULT 'services_page',
  status text NOT NULL DEFAULT 'new',
  admin_note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.service_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_requests TO authenticated;
GRANT ALL ON public.service_requests TO service_role;

ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can submit a service request"
  ON public.service_requests FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "admins read service requests"
  ON public.service_requests FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "admins update service requests"
  ON public.service_requests FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "admins delete service requests"
  ON public.service_requests FOR DELETE TO authenticated
  USING (public.is_admin());

CREATE TRIGGER service_requests_updated_at
  BEFORE UPDATE ON public.service_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();