"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ADMISSION_STATUS_OPTIONS = [
  'NEW',
  'CONTACTED',
  'COUNSELLING',
  'INTERESTED',
  'ADMISSION_APPROVED',
  'PAYMENT_PENDING',
  'PAYMENT_RECEIVED',
  'AGREEMENT_PENDING',
  'ENROLLED',
  'REJECTED',
  'WITHDRAWN',
];

export default function AdmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [admission, setAdmission] = useState<Record<string, any> | null>(null);
  const [lead, setLead] = useState<Record<string, any> | null>(null);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    let active = true;

    const load = async () => {
      const resolved = await params;
      setId(resolved.id);

      const res = await fetch(`/api/admin/admissions/${resolved.id}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || 'Unable to load admission');
        return;
      }

      if (!active) return;
      setAdmission(data.admission);
      setStatus(data.admission.status || 'NEW');
      setNotes(data.admission.internal_notes || '');

      if (data.admission.lead_id) {
        const leadRes = await fetch(`/api/admin/leads/${data.admission.lead_id}`);
        const leadData = await leadRes.json();
        if (leadRes.ok) setLead(leadData.lead || null);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [params]);

  const updateAdmission = async () => {
    if (!id) return;
    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/admissions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          internal_notes: notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Unable to update admission');
      setAdmission(data.admission);
      if (status === 'ENROLLED') {
        router.push('/admin/students');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update admission');
    } finally {
      setIsSaving(false);
    }
  };

  const generateAdmissionId = async () => {
    if (!id || !admission) return;
    const currentYear = new Date().getFullYear();
    const res = await fetch(`/api/admin/admissions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        admission_id: `IDS-${currentYear}-${String(Date.now()).slice(-4)}`,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setAdmission(data.admission);
    }
  };

  if (!admission) {
    return <main className="min-h-screen bg-slate-50 p-6">Loading admission...</main>;
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">Application Details</p>
              <h1 className="mt-2 text-3xl font-bold">{admission.full_name}</h1>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/admissions" className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50">Back</Link>
              <Button onClick={generateAdmissionId} className="bg-emerald-600 hover:bg-emerald-700">Generate Admission ID</Button>
            </div>
          </div>
        </header>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Application</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Application ID</p><p className="mt-1 font-medium">{admission.application_id || '—'}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Admission ID</p><p className="mt-1 font-medium">{admission.admission_id || '—'}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Status</p><p className="mt-1 font-medium">{admission.status || 'NEW'}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Created</p><p className="mt-1 font-medium">{admission.created_at ? new Date(admission.created_at).toLocaleString() : '—'}</p></div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Student Information</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Full Name</p><p className="mt-1 font-medium">{admission.full_name || '—'}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">DOB</p><p className="mt-1 font-medium">{admission.date_of_birth || '—'}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Gender</p><p className="mt-1 font-medium">{admission.gender || '—'}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Mobile</p><p className="mt-1 font-medium">{admission.mobile_number || '—'}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">WhatsApp</p><p className="mt-1 font-medium">{admission.whatsapp_number || '—'}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Email</p><p className="mt-1 font-medium">{admission.email || '—'}</p></div>
                <div className="md:col-span-2"><p className="text-xs uppercase tracking-wide text-slate-500">Address</p><p className="mt-1 font-medium">{admission.address || '—'}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">City</p><p className="mt-1 font-medium">{admission.city || '—'}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">State</p><p className="mt-1 font-medium">{admission.state || '—'}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">PIN</p><p className="mt-1 font-medium">{admission.pin_code || '—'}</p></div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Education & Course</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Qualification</p><p className="mt-1 font-medium">{admission.highest_qualification || '—'}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Degree</p><p className="mt-1 font-medium">{admission.course_degree || '—'}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Institution</p><p className="mt-1 font-medium">{admission.institution || '—'}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Completion Year</p><p className="mt-1 font-medium">{admission.year_of_completion || '—'}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Occupation</p><p className="mt-1 font-medium">{admission.occupation_status || '—'}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Course</p><p className="mt-1 font-medium">{admission.course_name || '—'}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Training Mode</p><p className="mt-1 font-medium">{admission.training_mode || '—'}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Batch</p><p className="mt-1 font-medium">{admission.preferred_batch || '—'}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Class Timing</p><p className="mt-1 font-medium">{admission.preferred_class_timing || '—'}</p></div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Career & Emergency</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2"><p className="text-xs uppercase tracking-wide text-slate-500">Reason for Joining</p><p className="mt-1 font-medium">{admission.reason_for_joining || '—'}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Career Goal</p><p className="mt-1 font-medium">{admission.career_goal || '—'}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Emergency Contact</p><p className="mt-1 font-medium">{admission.emergency_contact_name || '—'}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Relationship</p><p className="mt-1 font-medium">{admission.emergency_contact_relationship || '—'}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Emergency Contact Number</p><p className="mt-1 font-medium">{admission.emergency_contact_number || '—'}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Declaration Accepted</p><p className="mt-1 font-medium">{admission.declaration_accepted ? 'Yes' : 'No'}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Terms Accepted</p><p className="mt-1 font-medium">{admission.terms_accepted ? 'Yes' : 'No'}</p></div>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Workflow</h2>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm">
                  {ADMISSION_STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-4 min-h-[120px] w-full rounded-md border border-slate-200 p-3 text-sm" placeholder="Add internal notes" />
                <Button onClick={updateAdmission} disabled={isSaving} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  {isSaving ? 'Saving...' : 'Save changes'}
                </Button>
              </div>
            </div>

            {lead && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Lead Information</h2>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium text-slate-600">Lead ID:</span> {lead.id}</p>
                  <p><span className="font-medium text-slate-600">Name:</span> {lead.full_name}</p>
                  <p><span className="font-medium text-slate-600">Email:</span> {lead.email}</p>
                  <p><span className="font-medium text-slate-600">Phone:</span> {lead.whatsapp_number}</p>
                  <p><span className="font-medium text-slate-600">Course:</span> {lead.course_interest}</p>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
              <div className="space-y-3">
                <Button variant="outline" className="w-full" onClick={() => setStatus('ADMISSION_APPROVED')}>Approve Admission</Button>
                <Button variant="outline" className="w-full" onClick={() => setStatus('PAYMENT_RECEIVED')}>Mark Payment Received</Button>
                <Button variant="outline" className="w-full" onClick={() => setStatus('AGREEMENT_PENDING')}>Agreement Pending</Button>
                <Button variant="outline" className="w-full" onClick={() => setStatus('ENROLLED')}>Enroll Student</Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
