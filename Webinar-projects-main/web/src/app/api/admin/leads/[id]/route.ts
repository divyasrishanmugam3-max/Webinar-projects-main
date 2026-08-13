import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/admin-auth';
import { getSupabaseAdminClient } from '@/lib/supabase';

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
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

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.from('leads').select('*').eq('id', id).single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ message: 'Not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ lead: data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
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

    const body = await req.json();
    const { lead_status, attendance_status, counselling_status, contact_status } = body || {};
    const allowedLead = ['Registered', 'Confirmed', 'Attended', 'Interested', 'Follow-up', 'Counselling', 'Enrolled', 'Not Interested'];
    const allowedAttendance = ['Not Attended', 'Attended'];
    const allowedCounselling = ['Not Booked', 'Booked', 'Completed'];
    const allowedContact = ['Not Contacted', 'Contacted', 'Follow Up', 'Converted'];

    const updates: Record<string, string> = {};
    if (lead_status && allowedLead.includes(lead_status)) updates.lead_status = lead_status;
    if (attendance_status && allowedAttendance.includes(attendance_status)) updates.attendance_status = attendance_status;
    if (counselling_status && allowedCounselling.includes(counselling_status)) updates.counselling_status = counselling_status;
    if (contact_status && allowedContact.includes(contact_status)) updates.contact_status = contact_status;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ message: 'No valid fields to update' }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('leads')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ message: 'Not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ message: 'ok', lead: data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
