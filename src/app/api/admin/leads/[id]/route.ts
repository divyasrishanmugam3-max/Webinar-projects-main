import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/admin-auth';

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

    const apiBase = process.env.NEXT_PUBLIC_SUPABASE_API_URL?.replace(/\/$/, '');
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

    if (!apiBase || !anonKey) {
      console.error('[admin-leads:id] Missing Supabase REST configuration');
      return NextResponse.json({ message: 'Supabase is not configured.' }, { status: 500 });
    }

    const restUrl = new URL(`${apiBase}/leads`);
    restUrl.searchParams.set('select', '*');
    restUrl.searchParams.set('id', `eq.${id}`);

    const response = await fetch(restUrl.toString(), {
      method: 'GET',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('[admin-leads:id] Supabase REST error:', {
        status: response.status,
        statusText: response.statusText,
      });
      return NextResponse.json({ message: 'Unable to load lead' }, { status: response.status >= 500 ? 502 : 500 });
    }

    const data = await response.json();
    const rows = Array.isArray(data) ? data : [];

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ lead: rows[0] }, { status: 200 });
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
    const {
      lead_status,
      attendance_status,
      counselling_status,
      contact_status,
      follow_up_date,
      follow_up_notes,
      last_contacted_at,
      current_status,
      course_interest,
      main_goal,
      source,
    } = body || {};

    const allowedLead = ['Registered', 'Confirmed', 'Attended', 'Interested', 'Counselling Booked', 'Enrolled', 'Lost', 'Not Interested'];
    const allowedAttendance = ['Not Attended', 'Attended'];
    const allowedCounselling = ['Not Booked', 'Booked', 'Completed'];
    const allowedContact = ['Not Contacted', 'Contacted', 'Follow-up Required', 'Contacted Successfully'];

    const updates: Record<string, string | null> = {};
    if (lead_status && allowedLead.includes(lead_status)) updates.lead_status = lead_status;
    if (attendance_status && allowedAttendance.includes(attendance_status)) updates.attendance_status = attendance_status;
    if (counselling_status && allowedCounselling.includes(counselling_status)) updates.counselling_status = counselling_status;
    if (contact_status && allowedContact.includes(contact_status)) updates.contact_status = contact_status;
    if (follow_up_date !== undefined) updates.follow_up_date = follow_up_date ? new Date(follow_up_date).toISOString() : null;
    if (follow_up_notes !== undefined) updates.follow_up_notes = follow_up_notes || null;
    if (last_contacted_at !== undefined) updates.last_contacted_at = last_contacted_at ? new Date(last_contacted_at).toISOString() : null;
    if (current_status !== undefined) updates.current_status = current_status || null;
    if (course_interest !== undefined) updates.course_interest = course_interest || null;
    if (main_goal !== undefined) updates.main_goal = main_goal || null;
    if (source !== undefined) updates.source = source || null;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ message: 'No valid fields to update' }, { status: 400 });
    }

    updates.updated_at = new Date().toISOString();

    const apiBase = process.env.NEXT_PUBLIC_SUPABASE_API_URL?.replace(/\/$/, '');
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

    if (!apiBase || !anonKey) {
      console.error('[admin-leads:id] Missing Supabase REST configuration');
      return NextResponse.json({ message: 'Supabase is not configured.' }, { status: 500 });
    }

    const response = await fetch(`${apiBase}/leads?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(updates),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('[admin-leads:id] Supabase REST error:', {
        status: response.status,
        statusText: response.statusText,
      });
      return NextResponse.json({ message: 'Unable to update lead' }, { status: response.status >= 500 ? 502 : 500 });
    }

    const data = await response.json();
    const lead = Array.isArray(data) ? data[0] : data;

    return NextResponse.json({ message: 'ok', lead }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
