import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { getAdminFromRequest } from '@/lib/certificate-auth';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EVENT_TYPES = ['Workshop', 'Webinar', 'Training', 'Seminar', 'Other'];
const CERTIFICATE_TYPES = ['Certificate of Participation', 'Certificate of Completion'];

export async function GET(req: Request) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get('search')?.trim() || '';
    const status = url.searchParams.get('status')?.trim() || '';
    const supabase = getSupabaseAdminClient();
    let query = supabase.from('certificates').select('*').order('created_at', { ascending: false });
    if (search) query = query.or(`certificate_id.ilike.%${search}%,student_name.ilike.%${search}%,student_email.ilike.%${search}%,event_name.ilike.%${search}%`);
    if (status) query = query.eq('verification_status', status);
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ certificates: data || [] });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Unable to load certificates' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const event = body?.event || {};
    const participants = Array.isArray(body?.participants) ? body.participants : [];
    const required = ['event_name', 'college_name', 'event_date', 'issuer_name', 'issuer_designation'];
    const missing = required.find((key) => !String(event[key] || '').trim());
    if (missing) return NextResponse.json({ message: `${missing.replaceAll('_', ' ')} is required.` }, { status: 400 });
    if (!EVENT_TYPES.includes(event.event_type) || !CERTIFICATE_TYPES.includes(event.certificate_type)) return NextResponse.json({ message: 'Invalid event or certificate type.' }, { status: 400 });
    if (!participants.length || participants.length > 500) return NextResponse.json({ message: 'Add between 1 and 500 participants.' }, { status: 400 });
    const cleanParticipants = participants.map((participant: { name?: unknown; email?: unknown }) => ({ name: String(participant.name || '').trim(), email: String(participant.email || '').trim().toLowerCase() }));
    const invalid = cleanParticipants.find((participant: { name: string; email: string }) => !participant.name || !EMAIL_RE.test(participant.email));
    if (invalid) return NextResponse.json({ message: 'Every participant needs a name and valid email address.' }, { status: 400 });

    const supabase = getSupabaseAdminClient();
    const rows = cleanParticipants.map((participant: { name: string; email: string }) => ({
      student_name: participant.name,
      student_email: participant.email,
      event_name: String(event.event_name).trim(),
      event_type: event.event_type,
      college_name: String(event.college_name).trim(),
      event_date: event.event_date,
      certificate_type: event.certificate_type,
      issuer_name: String(event.issuer_name).trim(),
      issuer_designation: String(event.issuer_designation).trim(),
    }));
    const { data, error } = await supabase.from('certificates').insert(rows).select('*');
    if (error) throw error;
    return NextResponse.json({ certificates: data || [], total: data?.length || 0 }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Unable to generate certificates' }, { status: 500 });
  }
}
