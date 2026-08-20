import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { getAdminFromRequest } from '@/lib/certificate-auth';

export async function PATCH(req: Request, context: { params: Promise<{ certificateId: string }> }) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { certificateId } = await context.params;
  try {
    const body = await req.json();
    if (body?.verification_status !== 'active' && body?.verification_status !== 'revoked') return NextResponse.json({ message: 'Invalid verification status.' }, { status: 400 });
    const { data, error } = await getSupabaseAdminClient().from('certificates').update({ verification_status: body.verification_status }).eq('certificate_id', certificateId).select('*').single();
    if (error) throw error;
    return NextResponse.json({ certificate: data });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Unable to update certificate' }, { status: 500 });
  }
}
