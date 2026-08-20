import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { getAdminFromRequest } from '@/lib/certificate-auth';
import { createCertificatePdf, verificationUrl } from '@/lib/certificate';

export async function POST(req: Request) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.CERTIFICATE_EMAIL_FROM;
  if (!resendKey || !from) return NextResponse.json({ message: 'Email delivery is not configured. Set RESEND_API_KEY and CERTIFICATE_EMAIL_FROM.' }, { status: 503 });
  try {
    const { certificateId } = await req.json();
    const { data, error } = await getSupabaseAdminClient().from('certificates').select('*').eq('certificate_id', certificateId).single();
    if (error || !data) return NextResponse.json({ message: 'Certificate not found' }, { status: 404 });
    const pdf = await createCertificatePdf(data);
    const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from, to: [data.student_email], subject: `Certificate of Participation - ${data.event_name}`, text: `Dear ${data.student_name},\n\nYour certificate for ${data.event_name} is attached.\nCertificate ID: ${data.certificate_id}\nVerify: ${verificationUrl(data.certificate_id)}\n\nILAI Professional Academy`, attachments: [{ filename: `${data.certificate_id}.pdf`, content: pdf.toString('base64') }] }) });
    if (!response.ok) return NextResponse.json({ message: 'Email provider rejected the message.' }, { status: 502 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Unable to send email' }, { status: 500 });
  }
}
