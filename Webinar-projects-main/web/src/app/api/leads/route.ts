import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
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
    const supabase = getSupabaseAdminClient();

    const { data: existing, error: duplicateError } = await supabase
      .from('leads')
      .select('id')
      .or(`email.eq.${normalizedEmail},whatsapp_number.eq.${normalizedPhone}`);

    if (duplicateError) {
      throw duplicateError;
    }

    if (existing && existing.length > 0) {
      return NextResponse.json({ message: 'Lead already exists' }, { status: 409 });
    }

    const { data, error } = await supabase
      .from('leads')
      .insert([
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
      ])
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
