import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/admin-auth';

const ADMISSION_STATUS_OPTIONS = [
  'NEW',
  'CONTACTED',
  'COUNSELLING',
  'INTERESTED',
  'ADMISSION_APPROVED',
  'PAYMENT_PENDING',
  'PAYMENT_RECEIVED',
  'AGREEMENT_PENDING',
  'ENROLLED',
  'REJECTED',
  'WITHDRAWN',
];

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const token = cookie
      .split(';')
      .map((s) => s.trim())
      .find((c) => c.startsWith('admin_token='))
      ?.split('=')[1];

    if (!verifyAdminToken(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const search = (url.searchParams.get('search') || '').trim();
    const status = (url.searchParams.get('status') || '').trim();
    const course = (url.searchParams.get('course') || '').trim();
    const start = (url.searchParams.get('start') || '').trim();
    const end = (url.searchParams.get('end') || '').trim();

    const apiBase = process.env.NEXT_PUBLIC_SUPABASE_API_URL?.replace(/\/$/, '');
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

    if (!apiBase || !anonKey) {
      return NextResponse.json({ message: 'Supabase is not configured.' }, { status: 500 });
    }

    const restUrl = new URL(`${apiBase}/admissions`);
    restUrl.searchParams.set('select', '*');
    restUrl.searchParams.set('order', 'created_at.desc');

    if (search) {
      restUrl.searchParams.set('or', `full_name.ilike.*${search}*,application_id.ilike.*${search}*,admission_id.ilike.*${search}*,mobile_number.ilike.*${search}*,email.ilike.*${search}*`);
    }
    if (status) {
      restUrl.searchParams.set('status', `eq.${status}`);
    }
    if (course) {
      restUrl.searchParams.set('course_name', `eq.${course}`);
    }
    if (start) {
      restUrl.searchParams.append('created_at', `gte.${new Date(`${start}T00:00:00Z`).toISOString()}`);
    }
    if (end) {
      restUrl.searchParams.append('created_at', `lte.${new Date(`${end}T23:59:59.999Z`).toISOString()}`);
    }

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
      return NextResponse.json({ message: 'Unable to load admissions' }, { status: response.status >= 500 ? 502 : 500 });
    }

    const data = await response.json();
    const admissions = Array.isArray(data) ? data : [];

    return NextResponse.json({ admissions, total: admissions.length }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const token = cookie
      .split(';')
      .map((s) => s.trim())
      .find((c) => c.startsWith('admin_token='))
      ?.split('=')[1];

    if (!verifyAdminToken(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const id = String(body?.id || '');
    const status = String(body?.status || '');
    const notes = body?.notes;

    if (!id) {
      return NextResponse.json({ message: 'Admission ID is required.' }, { status: 400 });
    }
    if (status && !ADMISSION_STATUS_OPTIONS.includes(status)) {
      return NextResponse.json({ message: 'Invalid status.' }, { status: 400 });
    }

    const apiBase = process.env.NEXT_PUBLIC_SUPABASE_API_URL?.replace(/\/$/, '');
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

    if (!apiBase || !anonKey) {
      return NextResponse.json({ message: 'Supabase is not configured.' }, { status: 500 });
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (status) updates.status = status;
    if (notes !== undefined) updates.internal_notes = typeof notes === 'string' ? notes : '';

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

    const updated = await response.json();
    return NextResponse.json({ admission: Array.isArray(updated) ? updated[0] : updated }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
