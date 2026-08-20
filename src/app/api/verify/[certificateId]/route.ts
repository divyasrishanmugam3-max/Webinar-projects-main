import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';

export async function GET(_req: Request, context: { params: Promise<{ certificateId: string }> }) {
  const { certificateId } = await context.params;
  try {
    const { data, error } = await getSupabaseAdminClient().from('certificates').select('certificate_id,student_name,event_name,event_type,college_name,event_date,verification_status,issued_at').eq('certificate_id', certificateId).single();
    if (error || !data) return NextResponse.json({ message: 'Certificate not found' }, { status: 404 });
    return NextResponse.json({ certificate: data });
  } catch {
    return NextResponse.json({ message: 'Certificate not found' }, { status: 404 });
  }
}
