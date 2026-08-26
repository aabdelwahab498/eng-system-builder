CREATE TABLE public.payment_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name text NOT NULL DEFAULT '',
  email text,
  whatsapp text,
  service_id text,
  service_title text,
  project_name text,
  amount text,
  currency text,
  method_id text,
  proof_path text,
  proof_filename text,
  proof_type text,
  proof_size_bytes bigint,
  status text NOT NULL DEFAULT 'pending_review',
  note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.payment_submissions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_submissions TO authenticated;
GRANT ALL ON public.payment_submissions TO service_role;

ALTER TABLE public.payment_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can submit a payment proof"
ON public.payment_submissions FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "admins read payment submissions"
ON public.payment_submissions FOR SELECT TO authenticated
USING (is_admin());

CREATE POLICY "admins update payment submissions"
ON public.payment_submissions FOR UPDATE TO authenticated
USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "admins delete payment submissions"
ON public.payment_submissions FOR DELETE TO authenticated
USING (is_admin());

CREATE TRIGGER payment_submissions_updated_at
BEFORE UPDATE ON public.payment_submissions
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Storage policies for the private payment-proofs bucket
CREATE POLICY "anyone can upload a payment proof"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'payment-proofs');

CREATE POLICY "admins read payment proofs"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'payment-proofs' AND is_admin());

CREATE POLICY "admins delete payment proofs"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'payment-proofs' AND is_admin());