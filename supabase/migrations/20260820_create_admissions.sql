CREATE TABLE IF NOT EXISTS public.admissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id TEXT UNIQUE NOT NULL,
  admission_id TEXT UNIQUE,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  mobile_number TEXT NOT NULL,
  whatsapp_number TEXT,
  email TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  pin_code TEXT,
  highest_qualification TEXT,
  course_degree TEXT,
  institution TEXT,
  year_of_completion TEXT,
  occupation_status TEXT,
  course_id TEXT,
  course_name TEXT,
  training_mode TEXT NOT NULL,
  preferred_batch TEXT,
  preferred_class_timing TEXT,
  reason_for_joining TEXT,
  career_goal TEXT,
  career_goal_other TEXT,
  referral_source TEXT,
  referral_source_other TEXT,
  emergency_contact_name TEXT,
  emergency_contact_relationship TEXT,
  emergency_contact_number TEXT,
  declaration_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  terms_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'WAITLIST', 'ENROLLED')),
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admissions
  ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_admissions_application_id
  ON public.admissions (application_id);
CREATE INDEX IF NOT EXISTS idx_admissions_admission_id
  ON public.admissions (admission_id);
CREATE INDEX IF NOT EXISTS idx_admissions_mobile_number
  ON public.admissions (mobile_number);
CREATE INDEX IF NOT EXISTS idx_admissions_email
  ON public.admissions (email);
CREATE INDEX IF NOT EXISTS idx_admissions_status
  ON public.admissions (status);
CREATE INDEX IF NOT EXISTS idx_admissions_lead_id
  ON public.admissions (lead_id);

CREATE OR REPLACE FUNCTION public.set_admissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_admissions_updated_at ON public.admissions;
CREATE TRIGGER trg_set_admissions_updated_at
BEFORE UPDATE ON public.admissions
FOR EACH ROW
EXECUTE FUNCTION public.set_admissions_updated_at();

CREATE POLICY "Public admissions can insert"
  ON public.admissions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public admissions cannot read"
  ON public.admissions
  FOR SELECT
  TO public
  USING (false);

CREATE POLICY "Public admissions cannot update"
  ON public.admissions
  FOR UPDATE
  TO public
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Public admissions cannot delete"
  ON public.admissions
  FOR DELETE
  TO public
  USING (false);

CREATE POLICY "Authenticated admins can manage admissions"
  ON public.admissions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
