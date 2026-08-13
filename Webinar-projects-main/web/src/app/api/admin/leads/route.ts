import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/admin-auth';
import { getSupabaseAdminClient } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const token = cookie
      .split(';')
      .map((s) => s.trim())
      .find((c) => c.startsWith('admin_token='))
      ?.split('=')[1];
    const admin = verifyAdminToken(token);

    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';
    const attendance = url.searchParams.get('attendance') || '';
    const course = url.searchParams.get('course') || '';
    const source = url.searchParams.get('source') || '';
    const start = url.searchParams.get('start') || '';
    const end = url.searchParams.get('end') || '';

    const supabase = getSupabaseAdminClient();
    let query = supabase.from('leads').select('*');

    if (search) {
      const q = search.trim();
      query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%,whatsapp_number.ilike.%${q}%`);
    }
    if (status) query = query.eq('lead_status', status);
    if (attendance) query = query.eq('attendance_status', attendance);
    if (course) query = query.eq('course_interest', course);
    if (source) query = query.eq('source', source);
    if (start) query = query.gte('registration_date', new Date(`${start}T00:00:00Z`).toISOString());
    if (end) query = query.lte('registration_date', new Date(`${end}T23:59:59.999Z`).toISOString());

    const { data, error } = await query.order('registration_date', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ leads: data || [] }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
