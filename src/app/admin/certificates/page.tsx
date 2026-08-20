'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, Copy, Download, FileUp, Mail, Plus, Search, ShieldCheck, ShieldOff, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Participant = { name: string; email: string };
type Certificate = { student_name: string; student_email: string; certificate_id: string; event_name: string; college_name: string; event_date: string; verification_status: 'active' | 'revoked'; created_at: string };
const initialEvent = { event_name: '', event_type: 'Workshop', college_name: '', event_date: '', certificate_type: 'Certificate of Participation', issuer_name: '', issuer_designation: '' };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseCsv(text: string): Participant[] {
  return text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).slice(0, 501).map((line) => {
    const parts = line.match(/("(?:[^"]|"")*"|[^,]*)(?:,|$)/g) || [];
    const values = parts.map((part) => part.replace(/,$/, '').trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
    return { name: values[0] || '', email: (values[1] || '').toLowerCase() };
  }).filter((participant, index) => !(index === 0 && participant.name.toLowerCase() === 'name'));
}

export default function AdminCertificatesPage() {
  const [event, setEvent] = useState(initialEvent);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [manual, setManual] = useState<Participant>({ name: '', email: '' });
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const loadCertificates = async () => {
    const params = new URLSearchParams(); if (search) params.set('search', search); if (status) params.set('status', status);
    const response = await fetch(`/api/admin/certificates?${params.toString()}`); const data = await response.json();
    if (response.ok) setCertificates(data.certificates || []); else setMessage(data.message || 'Unable to load certificates.');
  };
  useEffect(() => { void loadCertificates(); }, []);

  const addManual = () => {
    if (!manual.name.trim() || !emailPattern.test(manual.email.trim())) { setMessage('Enter a participant name and valid email address.'); return; }
    setParticipants((current) => [...current, { name: manual.name.trim(), email: manual.email.trim().toLowerCase() }]); setManual({ name: '', email: '' }); setMessage('');
  };
  const handleCsv = async (input: ChangeEvent<HTMLInputElement>) => {
    const file = input.target.files?.[0]; if (!file) return;
    const parsed = parseCsv(await file.text()); const valid = parsed.filter((participant) => participant.name && emailPattern.test(participant.email));
    setParticipants((current) => [...current, ...valid].slice(0, 500)); setMessage(`${valid.length} valid participants added from CSV.`); input.target.value = '';
  };
  const generate = async () => {
  setMessage('');

  if (!participants.length) {
    setMessage('Add at least one participant.');
    return;
  }

  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
    
    console.log("anonKey===",anonKey)
  setLoading(true);
  setProgress(`Generating 0/${participants.length}`);

  try {
    // const response = await fetch('/api/admin/certificates', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     event,
    //     participants,
    //   }),
    // });

       const response = await fetch(
  `https://dutxrxgwslbqlywnhrzj.supabase.co/rest/v1/certificates`,
  {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
    },
     body: JSON.stringify({
        event_name: event.event_name,
event_type: event.event_type,
college_name: event.college_name,
event_date: event.event_date,
certificate_type: event.certificate_type,
issuer_name: event.issuer_name,
issuer_designation: event.issuer_designation,
 "student_name":"Flower",
    "student_email":"flower@gmail.com"

      }),
  }
     );

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || 'Generation failed.');
      return;
    }

    for (let index = 1; index <= data.total; index += 1) {
      setProgress(`Generating ${index}/${data.total}`);

      await new Promise((resolve) =>
        window.setTimeout(resolve, 8)
      );
    }

    setMessage(`${data.total} Certificates Generated Successfully`);
    setParticipants([]);

    await loadCertificates();
  } catch (error) {
    console.error('Certificate generation error:', error);
    setMessage('Something went wrong while generating certificates.');
  } finally {
    setLoading(false);
    setProgress(null);
  }
};
  const download = (id: string) => { window.location.href = `/api/admin/certificates/${encodeURIComponent(id)}/pdf`; };
  const downloadZip = () => { if (certificates.length) window.location.href = `/api/admin/certificates/zip?ids=${certificates.map((item) => encodeURIComponent(item.certificate_id)).join(',')}`; };
  const revoke = async (id: string) => { const response = await fetch(`/api/admin/certificates/${encodeURIComponent(id)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ verification_status: 'revoked' }) }); if (response.ok) await loadCertificates(); };
  const sendEmail = async (id: string) => { const response = await fetch('/api/admin/certificates/email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ certificateId: id }) }); const data = await response.json(); setMessage(response.ok ? 'Certificate email sent.' : data.message); };
  const copyLink = async (id: string) => { await navigator.clipboard.writeText(`${window.location.origin}/verify/${id}`); setMessage('Verification link copied.'); };

  return <main className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-6"><div className="mx-auto max-w-7xl space-y-6">
    <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">Admin Dashboard</p><h1 className="mt-2 text-3xl font-bold">Certificates</h1><p className="mt-1 text-sm text-slate-500">Generate, verify and manage academy event certificates.</p></div><nav className="flex flex-wrap gap-2"><Link href="/admin/leads" className="rounded-full border px-4 py-2 text-sm">Leads</Link><Link href="/admin/admissions" className="rounded-full border px-4 py-2 text-sm">Admissions</Link><Link href="/admin/certificates" className="rounded-full bg-emerald-700 px-4 py-2 text-sm text-white">Certificates</Link></nav></header>
    {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{message}</div>}
    <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]"><div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div><h2 className="text-xl font-bold">Event Details</h2><p className="mt-1 text-sm text-slate-500">Set the details that will appear on every certificate.</p></div><div className="grid gap-4 sm:grid-cols-2">{([['event_name','Event Name'],['college_name','College / Organization Name'],['issuer_name','Signatory Name'],['issuer_designation','Signatory Designation']] as const).map(([key, label]) => <div key={key}><Label>{label}</Label><Input className="mt-2" value={event[key]} onChange={(e) => setEvent({ ...event, [key]: e.target.value })} /></div>)}<div><Label>Event Type</Label><select className="mt-2 h-10 w-full rounded-md border px-3 text-sm" value={event.event_type} onChange={(e) => setEvent({ ...event, event_type: e.target.value })}>{['Workshop','Webinar','Training','Seminar','Other'].map((item) => <option key={item}>{item}</option>)}</select></div><div><Label>Certificate Type</Label><select className="mt-2 h-10 w-full rounded-md border px-3 text-sm" value={event.certificate_type} onChange={(e) => setEvent({ ...event, certificate_type: e.target.value })}>{['Certificate of Participation','Certificate of Completion'].map((item) => <option key={item}>{item}</option>)}</select></div><div><Label>Event Date</Label><Input className="mt-2" type="date" value={event.event_date} onChange={(e) => setEvent({ ...event, event_date: e.target.value })} /></div></div></div>
      <aside className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div><h2 className="text-xl font-bold">Participant Input</h2><p className="mt-1 text-sm text-slate-500">Add names manually or upload a `name,email` CSV.</p></div><div className="space-y-3"><Label>Student Name</Label><Input value={manual.name} onChange={(e) => setManual({ ...manual, name: e.target.value })} placeholder="Rahul Kumar" /><Label>Student Email</Label><Input type="email" value={manual.email} onChange={(e) => setManual({ ...manual, email: e.target.value })} placeholder="rahul@example.com" /><Button type="button" variant="outline" className="w-full" onClick={addManual}><Plus className="mr-2 h-4 w-4" />Add Participant</Button></div><label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"><FileUp className="h-4 w-4" />Upload CSV<input type="file" accept=".csv,text/csv" className="hidden" onChange={handleCsv} /></label><div className="flex items-center justify-between border-t pt-4 text-sm"><span>Participants ready</span><strong className="text-lg text-emerald-700">{participants.length}</strong></div><div className="rounded-lg border-2 border-emerald-900/20 bg-[#fbfaf5] p-4 text-center"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-800">ILAI Professional Academy</p><p className="mt-2 text-sm font-bold text-emerald-900">{event.certificate_type.toUpperCase()}</p><p className="mt-3 text-xs text-slate-500">This certificate is proudly presented to</p><p className="mt-1 text-lg font-bold text-amber-700">{participants[0]?.name || ''}</p><p className="mt-2 text-xs text-slate-600">For participating in {event.event_name || 'your event'}</p><p className="mt-2 text-[10px] text-slate-500">QR verification and certificate ID are created on generation.</p></div></aside></section>
    {participants.length > 0 && <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">Participant Preview</h2><Button variant="ghost" onClick={() => setParticipants([])}><Trash2 className="mr-2 h-4 w-4" />Clear all</Button></div><div className="max-h-64 overflow-auto"><table className="w-full text-left text-sm"><thead className="sticky top-0 bg-slate-100"><tr><th className="px-3 py-2">Name</th><th className="px-3 py-2">Email</th><th /></tr></thead><tbody>{participants.map((participant, index) => <tr key={`${participant.email}-${index}`} className="border-t"><td className="px-3 py-2">{participant.name}</td><td className="px-3 py-2">{participant.email}</td><td className="px-3 py-2 text-right"><button title="Remove participant" onClick={() => setParticipants((current) => current.filter((_, itemIndex) => itemIndex !== index))}><Trash2 className="h-4 w-4 text-slate-400" /></button></td></tr>)}</tbody></table></div><div className="mt-5 flex flex-wrap items-center gap-3"><Button onClick={() => void generate()} disabled={loading} className="bg-emerald-700 hover:bg-emerald-800"><ShieldCheck className="mr-2 h-4 w-4" />{loading ? progress : 'Generate Certificates'}</Button>{loading && <span className="text-sm text-slate-500">Creating unique IDs and QR verification links...</span>}</div></section>}
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h2 className="text-xl font-bold">Generated Certificates</h2><p className="text-sm text-slate-500">{certificates.length} certificates in the current view.</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={downloadZip} disabled={!certificates.length}><Download className="mr-2 h-4 w-4" />Download All as ZIP</Button><Button variant="outline" onClick={() => void loadCertificates()}><Search className="mr-2 h-4 w-4" />Refresh</Button></div></div><div className="mb-4 flex flex-col gap-2 sm:flex-row"><Input placeholder="Search ID, student, email or event" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && void loadCertificates()} /><select className="h-10 rounded-md border px-3 text-sm sm:w-44" value={status} onChange={(e) => { setStatus(e.target.value); void loadCertificates(); }}><option value="">All statuses</option><option value="active">Active</option><option value="revoked">Revoked</option></select></div><div className="overflow-x-auto"><table className="min-w-[900px] w-full text-left text-sm"><thead className="bg-slate-100"><tr>{['Certificate ID','Student','Email','Event','College','Date','Status','Actions'].map((heading) => <th key={heading} className="px-3 py-3 font-semibold">{heading}</th>)}</tr></thead><tbody>{certificates.map((certificate) => <tr key={certificate.certificate_id} className="border-t"><td className="px-3 py-3 font-mono text-xs">{certificate.certificate_id}</td><td className="px-3 py-3 font-medium">{certificate.student_name}</td><td className="px-3 py-3">{certificate.student_email}</td><td className="px-3 py-3">{certificate.event_name}</td><td className="px-3 py-3">{certificate.college_name}</td><td className="px-3 py-3">{certificate.event_date}</td><td className="px-3 py-3"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${certificate.verification_status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{certificate.verification_status}</span></td><td className="px-3 py-3"><div className="flex items-center gap-2"><button title="Download PDF" onClick={() => download(certificate.certificate_id)}><Download className="h-4 w-4" /></button><button title="Copy verification link" onClick={() => void copyLink(certificate.certificate_id)}><Copy className="h-4 w-4" /></button><button title="Send certificate email" onClick={() => void sendEmail(certificate.certificate_id)}><Mail className="h-4 w-4" /></button>{certificate.verification_status === 'active' && <button title="Revoke certificate" onClick={() => void revoke(certificate.certificate_id)}><ShieldOff className="h-4 w-4 text-red-600" /></button>}<a title="View verification" href={`/verify/${certificate.certificate_id}`} target="_blank" rel="noreferrer"><Check className="h-4 w-4 text-emerald-700" /></a></div></td></tr>)}{!certificates.length && <tr><td colSpan={8} className="px-3 py-10 text-center text-slate-500">No certificates generated yet.</td></tr>}</tbody></table></div></section>
  </div></main>;
}
