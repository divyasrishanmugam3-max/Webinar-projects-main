CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admission_id TEXT UNIQUE,
  application_id TEXT,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  student_name TEXT NOT NULL,
  email TEXT,
  mobile_number TEXT,
  course_id TEXT,
  course_name TEXT,
  training_mode TEXT,
  enrollment_date TIMESTAMPTZ,
  course_start_date TIMESTAMPTZ,
  course_end_date TIMESTAMPTZ,
  payment_status TEXT DEFAULT 'PENDING',
  student_status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.students
  ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_students_admission_id ON public.students (admission_id);
CREATE INDEX IF NOT EXISTS idx_students_application_id ON public.students (application_id);
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students (email);
CREATE INDEX IF NOT EXISTS idx_students_mobile_number ON public.students (mobile_number);
CREATE INDEX IF NOT EXISTS idx_students_course_name ON public.students (course_name);
CREATE INDEX IF NOT EXISTS idx_students_lead_id ON public.students (lead_id);

CREATE OR REPLACE FUNCTION public.set_students_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_students_updated_at ON public.students;
CREATE TRIGGER trg_set_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW
EXECUTE FUNCTION public.set_students_updated_at();

CREATE POLICY "Public students cannot read"
  ON public.students
  FOR SELECT
  TO public
  USING (false);

CREATE POLICY "Public students cannot update"
  ON public.students
  FOR UPDATE
  TO public
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Public students cannot delete"
  ON public.students
  FOR DELETE
  TO public
  USING (false);

CREATE POLICY "Authenticated admins can manage students"
  ON public.students
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
