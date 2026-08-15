import { NextResponse } from 'next/server';
import { verifyAdminToken, getAdminEnvironmentStatus } from '@/lib/admin-auth';

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const token = cookie
      .split(';')
      .map((s) => s.trim())
      .find((c) => c.startsWith('admin_token='))
      ?.split('=')[1];
    const tokenPresent = Boolean(token);
    const admin = verifyAdminToken(token);
    const envStatus = getAdminEnvironmentStatus();

    if (!admin) {
      // Safe diagnostics: do NOT log token signature. Decode payload part (base64) to help identify expiry/email issues.
      let tokenDebug: any = { tokenPresent };
      if (token) {
        try {
          const parts = token.split('.');
          tokenDebug.tokenParts = parts.length;
          const data = parts[0];
          const decoded = JSON.parse(Buffer.from(data, 'base64').toString('utf-8')) as { email?: string; exp?: number };
          tokenDebug.payload = { email: decoded.email || null, exp: decoded.exp || null, expired: decoded.exp ? Date.now() > decoded.exp : null };
        } catch (e) {
          tokenDebug.parseError = true;
        }
      }

      return NextResponse.json({ message: 'Unauthorized', debug: { tokenInfo: tokenDebug, env: envStatus } }, { status: 401 });
    }

    const url = new URL(req.url);
    const search = (url.searchParams.get('search') || '').trim();
    const status = (url.searchParams.get('status') || '').trim();
    const attendance = (url.searchParams.get('attendance') || '').trim();
    const counselling = (url.searchParams.get('counselling') || '').trim();
    const course = (url.searchParams.get('course') || '').trim();
    const source = (url.searchParams.get('source') || '').trim();
    const contact = (url.searchParams.get('contact') || '').trim();
    const start = (url.searchParams.get('start') || '').trim();
    const end = (url.searchParams.get('end') || '').trim();

    const apiBase = process.env.NEXT_PUBLIC_SUPABASE_API_URL?.replace(/\/$/, '');
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

    if (!apiBase || !anonKey) {
      console.error('[admin-leads] Missing Supabase REST configuration');
      return NextResponse.json({ message: 'Supabase is not configured.' }, { status: 500 });
    }

    const restUrl = new URL(`${apiBase}/leads`);
    restUrl.searchParams.set('select', '*');
    restUrl.searchParams.set('order', 'registration_date.desc');

    if (search) {
      const q = search.replace(/[%_]/g, '\\$&');
      restUrl.searchParams.set('or', `full_name.ilike.*${q}*,email.ilike.*${q}*,whatsapp_number.ilike.*${q}*`);
    }
    if (status) restUrl.searchParams.set('lead_status', `eq.${status}`);
    if (attendance) restUrl.searchParams.set('attendance_status', `eq.${attendance}`);
    if (counselling) restUrl.searchParams.set('counselling_status', `eq.${counselling}`);
    if (course) restUrl.searchParams.set('course_interest', `eq.${course}`);
    if (source) restUrl.searchParams.set('source', `eq.${source}`);
    if (contact) restUrl.searchParams.set('contact_status', `eq.${contact}`);
    if (start) restUrl.searchParams.append('registration_date', `gte.${new Date(`${start}T00:00:00Z`).toISOString()}`);
    if (end) restUrl.searchParams.append('registration_date', `lte.${new Date(`${end}T23:59:59.999Z`).toISOString()}`);

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
      console.error('[admin-leads] Supabase REST error:', {
        status: response.status,
        statusText: response.statusText,
      });
      return NextResponse.json({ message: 'Unable to load leads' }, { status: response.status >= 500 ? 502 : 500 });
    }

    const data = await response.json();
    const leads = Array.isArray(data) ? data : [];

    return NextResponse.json({ leads, total: leads.length }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    console.error('[admin-leads] API error:', message);
    return NextResponse.json({ message }, { status: 500 });
  }
}
