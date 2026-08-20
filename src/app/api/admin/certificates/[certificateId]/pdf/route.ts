import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { getAdminFromRequest } from '@/lib/certificate-auth';
import { createCertificatePdf } from '@/lib/certificate';

export async function GET(req: Request, context: { params: Promise<{ certificateId: string }> }) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { certificateId } = await context.params;
  try {
    const { data, error } = await getSupabaseAdminClient().from('certificates').select('*').eq('certificate_id', certificateId).single();
    if (error || !data) return NextResponse.json({ message: 'Certificate not found' }, { status: 404 });
    const pdf = await createCertificatePdf(data);
    return new NextResponse(new Uint8Array(pdf), { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${certificateId}.pdf"`, 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Unable to create PDF' }, { status: 500 });
  }
}
