CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT,
  qualification TEXT,
  current_status TEXT,
  course_interest TEXT,
  main_goal TEXT,
  source TEXT DEFAULT 'Direct',
  registration_date TIMESTAMPTZ DEFAULT NOW(),
  webinar_date TEXT,
  lead_status TEXT DEFAULT 'Registered',
  attendance_status TEXT DEFAULT 'Not Attended',
  counselling_status TEXT DEFAULT 'Not Booked',
  contact_status TEXT DEFAULT 'Not Contacted',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_whatsapp_number ON public.leads (whatsapp_number);
CREATE INDEX IF NOT EXISTS idx_leads_registration_date ON public.leads (registration_date);
CREATE INDEX IF NOT EXISTS idx_leads_lead_status ON public.leads (lead_status);
CREATE INDEX IF NOT EXISTS idx_leads_course_interest ON public.leads (course_interest);
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads (source);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_updated_at ON public.leads;
CREATE TRIGGER trg_set_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
