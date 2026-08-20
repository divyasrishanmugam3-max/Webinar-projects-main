import { NextResponse } from 'next/server';
import JSZip from 'jszip';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { getAdminFromRequest } from '@/lib/certificate-auth';
import { createCertificatePdf } from '@/lib/certificate';

export async function GET(req: Request) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const ids = new URL(req.url).searchParams.get('ids')?.split(',').map((id) => id.trim()).filter(Boolean) || [];
    if (!ids.length || ids.length > 500) return NextResponse.json({ message: 'Select between 1 and 500 certificates.' }, { status: 400 });
    const { data, error } = await getSupabaseAdminClient().from('certificates').select('*').in('certificate_id', ids);
    if (error) throw error;
    const zip = new JSZip();
    for (const certificate of data || []) zip.file(`${certificate.certificate_id}.pdf`, await createCertificatePdf(certificate));
    const archive = await zip.generateAsync({ type: 'arraybuffer', compression: 'DEFLATE' });
    return new NextResponse(archive, { headers: { 'Content-Type': 'application/zip', 'Content-Disposition': 'attachment; filename="ilai-certificates.zip"' } });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Unable to create ZIP' }, { status: 500 });
  }
}
