import Link from 'next/link';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import { getSupabaseAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function VerifyCertificatePage({ params }: { params: Promise<{ certificateId: string }> }) {
  const { certificateId } = await params;
  const { data } = await getSupabaseAdminClient().from('certificates').select('certificate_id,student_name,event_name,event_type,college_name,event_date,verification_status,issued_at').eq('certificate_id', certificateId).maybeSingle();
  const notFound = !data;
  const revoked = data?.verification_status === 'revoked';
  const date = data?.event_date ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(`${data.event_date}T00:00:00`)) : '—';
  const issued = data?.issued_at ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(data.issued_at)) : '—';

  return <main className="min-h-screen bg-[#f5f3eb] px-4 py-10 text-slate-900 sm:px-6">
    <div className="mx-auto max-w-3xl">
      <header className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-800">ILAI Professional Academy</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Certificate Verification</h1>
      </header>
      <section className="overflow-hidden rounded-2xl border border-emerald-900/15 bg-white shadow-xl">
        <div className={`p-8 text-center ${notFound || revoked ? 'bg-amber-50' : 'bg-emerald-50'}`}>
          {notFound || revoked ? <ShieldAlert className="mx-auto h-12 w-12 text-amber-700" /> : <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-700" />}
          <h2 className="mt-4 text-2xl font-bold">{notFound ? 'CERTIFICATE NOT FOUND' : revoked ? 'CERTIFICATE REVOKED' : 'CERTIFICATE VERIFIED'}</h2>
          <p className="mt-2 text-sm text-slate-600">{notFound || revoked ? 'This certificate could not be verified.' : 'This certificate was issued by ILAI Professional Academy.'}</p>
        </div>
        {data && <div className="grid gap-5 p-8 sm:grid-cols-2">
          <Info label="Student Name" value={data.student_name} />
          <Info label="Event Name" value={data.event_name} />
          <Info label="Event Type" value={data.event_type} />
          <Info label="College / Organization" value={data.college_name} />
          <Info label="Event Date" value={date} />
          <Info label="Certificate ID" value={data.certificate_id} />
          <Info label="Issued Date" value={issued} />
          <Info label="Issued By" value="ILAI Professional Academy" />
        </div>}
      </section>
      <div className="mt-8 text-center"><Link href="/" className="text-sm font-semibold text-emerald-800 hover:underline">Visit ILAI Professional Academy</Link></div>
    </div>
  </main>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="border-b border-slate-100 pb-3"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-1 font-medium text-slate-900">{value}</p></div>;
}
