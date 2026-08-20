import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/admin-auth';

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

    const apiBase = process.env.NEXT_PUBLIC_SUPABASE_API_URL?.replace(/\/$/, '');
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

    if (!apiBase || !anonKey) {
      return NextResponse.json({ message: 'Supabase is not configured.' }, { status: 500 });
    }

    const restUrl = new URL(`${apiBase}/students`);
    restUrl.searchParams.set('select', '*');
    restUrl.searchParams.set('order', 'enrollment_date.desc');

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
      return NextResponse.json({ message: 'Unable to load students' }, { status: response.status >= 500 ? 502 : 500 });
    }

    const data = await response.json();
    return NextResponse.json({ students: Array.isArray(data) ? data : [] }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(req: Request) {
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
    const apiBase = process.env.NEXT_PUBLIC_SUPABASE_API_URL?.replace(/\/$/, '');
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

    if (!apiBase || !anonKey) {
      return NextResponse.json({ message: 'Supabase is not configured.' }, { status: 500 });
    }

    const response = await fetch(`${apiBase}/students`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify([body]),
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json({ message: 'Unable to create student' }, { status: response.status >= 500 ? 502 : 500 });
    }

    const data = await response.json();
    return NextResponse.json({ student: Array.isArray(data) ? data[0] : data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
