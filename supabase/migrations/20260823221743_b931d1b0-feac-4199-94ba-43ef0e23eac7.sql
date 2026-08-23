-- roles ---------------------------------------------------------------
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- shared updated_at -----------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- content ---------------------------------------------------------------
CREATE TYPE public.content_kind AS ENUM (
  'profile','experience','education','skill_group','project','product',
  'service','article','announcement','seo','cv_settings','social_draft'
);

CREATE TYPE public.workflow_state AS ENUM (
  'draft','review','scheduled','published','archived'
);

CREATE TABLE public.content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind public.content_kind NOT NULL,
  slug text NOT NULL,
  state public.workflow_state NOT NULL DEFAULT 'draft',
  visible_public boolean NOT NULL DEFAULT false,
  visible_portfolio boolean NOT NULL DEFAULT false,
  visible_cv boolean NOT NULL DEFAULT false,
  visible_linkedin boolean NOT NULL DEFAULT false,
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  previous_slugs text[] NOT NULL DEFAULT '{}',
  scheduled_at timestamptz,
  published_at timestamptz,
  archived_at timestamptz,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (kind, slug)
);

CREATE INDEX content_items_kind_state_idx ON public.content_items (kind, state);

GRANT SELECT ON public.content_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_items TO authenticated;
GRANT ALL ON public.content_items TO service_role;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public reads published public content" ON public.content_items
  FOR SELECT TO anon, authenticated
  USING (
    state = 'published'
    AND visible_public = true
    AND (published_at IS NULL OR published_at <= now())
  );

CREATE POLICY "admins read all content" ON public.content_items
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "admins insert content" ON public.content_items
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "admins update content" ON public.content_items
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "admins delete content" ON public.content_items
  FOR DELETE TO authenticated USING (public.is_admin());

CREATE TRIGGER content_items_updated_at
  BEFORE UPDATE ON public.content_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- media -----------------------------------------------------------------
CREATE TABLE public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  storage_path text NOT NULL UNIQUE,
  public_url text NOT NULL,
  mime_type text,
  size_bytes bigint,
  alt_en text,
  alt_ar text,
  caption_en text,
  caption_ar text,
  archived boolean NOT NULL DEFAULT false,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.media_assets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public reads active media" ON public.media_assets
  FOR SELECT TO anon, authenticated USING (archived = false);

CREATE POLICY "admins manage media" ON public.media_assets
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TRIGGER media_assets_updated_at
  BEFORE UPDATE ON public.media_assets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- storage policies -------------------------------------------------------
CREATE POLICY "admins read media bucket" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'media' AND public.is_admin());

CREATE POLICY "admins upload media" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.is_admin());

CREATE POLICY "admins update media" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'media' AND public.is_admin());

CREATE POLICY "admins delete media" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.is_admin());