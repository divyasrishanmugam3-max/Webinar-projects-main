CREATE SEQUENCE IF NOT EXISTS public.certificate_number_seq;

CREATE OR REPLACE FUNCTION public.next_certificate_id()
RETURNS TEXT
LANGUAGE sql
AS $$
  SELECT 'ILAI-' || EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || '-' || LPAD(nextval('public.certificate_number_seq')::TEXT, 6, '0');
$$;

CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id TEXT UNIQUE NOT NULL DEFAULT public.next_certificate_id(),
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('Workshop', 'Webinar', 'Training', 'Seminar', 'Other')),
  college_name TEXT NOT NULL,
  event_date DATE NOT NULL,
  certificate_type TEXT NOT NULL CHECK (certificate_type IN ('Certificate of Participation', 'Certificate of Completion')),
  issuer_name TEXT NOT NULL,
  issuer_designation TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'active' CHECK (verification_status IN ('active', 'revoked')),
  pdf_url TEXT,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_certificates_certificate_id ON public.certificates (certificate_id);
CREATE INDEX IF NOT EXISTS idx_certificates_student_name ON public.certificates (student_name);
CREATE INDEX IF NOT EXISTS idx_certificates_student_email ON public.certificates (student_email);
CREATE INDEX IF NOT EXISTS idx_certificates_event_name ON public.certificates (event_name);
CREATE INDEX IF NOT EXISTS idx_certificates_status ON public.certificates (verification_status);

CREATE POLICY "Public certificates cannot read"
  ON public.certificates FOR SELECT TO public USING (false);
CREATE POLICY "Public certificates cannot write"
  ON public.certificates FOR INSERT TO public WITH CHECK (false);
CREATE POLICY "Authenticated admins can manage certificates"
  ON public.certificates FOR ALL TO authenticated USING (true) WITH CHECK (true);
