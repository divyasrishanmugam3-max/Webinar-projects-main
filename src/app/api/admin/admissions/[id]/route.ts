import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/admin-auth';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const cookie = req.headers.get('cookie') || '';
    const token = cookie
      .split(';')
      .map((s) => s.trim())
      .find((c) => c.startsWith('admin_token='))
      ?.split('=')[1];

    if (!verifyAdminToken(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const apiBase = process.env.NEXT_PUBLIC_SUPABASE_API_URL?.replace(/\/$/, '');
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

    if (!apiBase || !anonKey) {
      return NextResponse.json({ message: 'Supabase is not configured.' }, { status: 500 });
    }

    const restUrl = new URL(`${apiBase}/admissions`);
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
      return NextResponse.json({ message: 'Unable to load admission' }, { status: response.status >= 500 ? 502 : 500 });
    }

    const data = await response.json();
    const rows = Array.isArray(data) ? data : [];
    if (rows.length === 0) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ admission: rows[0] }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const cookie = req.headers.get('cookie') || '';
    const token = cookie
      .split(';')
      .map((s) => s.trim())
      .find((c) => c.startsWith('admin_token='))
      ?.split('=')[1];

    if (!verifyAdminToken(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const apiBase = process.env.NEXT_PUBLIC_SUPABASE_API_URL?.replace(/\/$/, '');
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

    if (!apiBase || !anonKey) {
      return NextResponse.json({ message: 'Supabase is not configured.' }, { status: 500 });
    }

    const body = await req.json();
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.status) updates.status = body.status;
    if (body.internal_notes !== undefined) updates.internal_notes = body.internal_notes || null;
    if (body.admission_id !== undefined) updates.admission_id = body.admission_id || null;

    if (body.status === 'ENROLLED') {
      const existingAdmissionRes = await fetch(`${apiBase}/admissions?id=eq.${id}&select=*`, {
        method: 'GET',
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
          'Content-Type': 'application/json',
        },
      });
      const existingAdmissionData = await existingAdmissionRes.json();
      const existingAdmission = Array.isArray(existingAdmissionData) ? existingAdmissionData[0] : existingAdmissionData;

      if (!existingAdmission?.admission_id) {
        const currentYear = new Date().getFullYear();
        const admissionId = `IDS-${currentYear}-${String(Date.now()).slice(-4)}`;
        updates.admission_id = admissionId;
      }

      const studentRecord = {
        admission_id: updates.admission_id || existingAdmission?.admission_id,
        application_id: existingAdmission?.application_id,
        lead_id: existingAdmission?.lead_id || null,
        student_name: existingAdmission?.full_name,
        email: existingAdmission?.email,
        mobile_number: existingAdmission?.mobile_number,
        course_id: existingAdmission?.course_id,
        course_name: existingAdmission?.course_name,
        training_mode: existingAdmission?.training_mode,
        enrollment_date: new Date().toISOString(),
        student_status: 'ACTIVE',
        payment_status: 'PAID',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await fetch(`${apiBase}/students`, {
        method: 'POST',
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify([studentRecord]),
        cache: 'no-store',
      });
    }

    const response = await fetch(`${apiBase}/admissions?id=eq.${id}`, {
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
      return NextResponse.json({ message: 'Unable to update admission' }, { status: response.status >= 500 ? 502 : 500 });
    }

    const row = await response.json();
    return NextResponse.json({ admission: Array.isArray(row) ? row[0] : row }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
