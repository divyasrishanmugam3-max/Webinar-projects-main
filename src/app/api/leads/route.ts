import { NextResponse } from 'next/server';
import { WEBINAR_DETAILS } from '@/types/webinar';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      full_name,
      whatsapp_number,
      email,
      city,
      qualification,
      current_status,
      course_interest,
      main_goal,
      source,
      webinar_date,
    } = body || {};

    if (!full_name || !whatsapp_number || !email) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const normalizedEmail = String(email).trim();
    const normalizedPhone = String(whatsapp_number).trim();
    const apiBase = process.env.NEXT_PUBLIC_SUPABASE_API_URL?.replace(/\/$/, '');
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

    if (!apiBase || !anonKey) {
      console.error('[leads] Missing Supabase REST configuration');
      return NextResponse.json({ message: 'Supabase is not configured.' }, { status: 500 });
    }

    const duplicateUrl = new URL(`${apiBase}/leads`);
    duplicateUrl.searchParams.set('select', 'id');
    duplicateUrl.searchParams.set('or', `email.eq.${normalizedEmail},whatsapp_number.eq.${normalizedPhone}`);

    const duplicateResponse = await fetch(duplicateUrl.toString(), {
      method: 'GET',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!duplicateResponse.ok) {
      console.error('[leads] Duplicate check error:', {
        status: duplicateResponse.status,
        statusText: duplicateResponse.statusText,
      });
      return NextResponse.json({ message: 'Unable to validate leads' }, { status: 502 });
    }

    const existing = await duplicateResponse.json();
    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json({ message: 'Lead already exists' }, { status: 409 });
    }

    const insertPayload = [
      {
        full_name: String(full_name).trim(),
        whatsapp_number: normalizedPhone,
        email: normalizedEmail,
        city: city || '',
        qualification: qualification || '',
        current_status: current_status || '',
        course_interest: course_interest || '',
        main_goal: main_goal || '',
        source: source || 'Direct',
        registration_date: new Date().toISOString(),
        webinar_date: webinar_date || WEBINAR_DETAILS.dateTimeStr,
        lead_status: 'Registered',
        attendance_status: 'Not Attended',
        counselling_status: 'Not Booked',
        contact_status: 'Not Contacted',
      },
    ];

    const insertResponse = await fetch(`${apiBase}/leads`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(insertPayload),
    });

    if (!insertResponse.ok) {
      console.error('[leads] Insert error:', {
        status: insertResponse.status,
        statusText: insertResponse.statusText,
      });
      return NextResponse.json(
        { message: 'Unable to create lead' },
        { status: insertResponse.status >= 500 ? 502 : 500 }
      );
    }

    const inserted = await insertResponse.json();
    const created = Array.isArray(inserted) ? inserted[0] : inserted;

    return NextResponse.json({ id: created?.id ?? null }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
