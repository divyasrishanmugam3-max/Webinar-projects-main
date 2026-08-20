import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_RE = /^\+?[0-9\s()-]{7,20}$/;

const toText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

function normalizePayload(body: Record<string, unknown>) {
  const fullName = toText(body.full_name);
  const mobileNumber = toText(body.mobile_number);
  const email = toText(body.email).toLowerCase();
  const courseName = toText(body.course_name);
  const trainingMode = toText(body.training_mode);
  const declarationAccepted = Boolean(body.declaration_accepted);
  const termsAccepted = Boolean(body.terms_accepted);

  return {
    full_name: fullName,
    date_of_birth: toText(body.date_of_birth),
    gender: toText(body.gender),
    mobile_number: mobileNumber,
    whatsapp_number: toText(body.whatsapp_number) || mobileNumber,
    email,
    address: toText(body.address),
    city: toText(body.city),
    state: toText(body.state),
    pin_code: toText(body.pin_code),
    highest_qualification: toText(body.highest_qualification),
    course_degree: toText(body.course_degree),
    institution: toText(body.institution),
    year_of_completion: toText(body.year_of_completion),
    occupation_status: toText(body.occupation_status),
    course_id: toText(body.course_id),
    course_name: courseName,
    training_mode: trainingMode,
    preferred_batch: toText(body.preferred_batch),
    preferred_class_timing: toText(body.preferred_class_timing),
    reason_for_joining: toText(body.reason_for_joining),
    career_goal: toText(body.career_goal),
    career_goal_other: toText(body.career_goal_other),
    referral_source: toText(body.referral_source),
    referral_source_other: toText(body.referral_source_other),
    emergency_contact_name: toText(body.emergency_contact_name),
    emergency_contact_relationship: toText(body.emergency_contact_relationship),
    emergency_contact_number: toText(body.emergency_contact_number),
    declaration_accepted: declarationAccepted,
    terms_accepted: termsAccepted,
    lead_id: toText(body.lead_id) || null,
    status: 'NEW',
  };
}

async function generateApplicationId() {
  const supabase = getSupabaseAdminClient();
  const year = new Date().getFullYear();
  const prefix = `IDS-APP-${year}-`;

  const { data, error } = await supabase
    .from('admissions')
    .select('application_id')
    .like('application_id', `${prefix}%`)
    .order('application_id', { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(error.message);
  }

  let sequence = 1;
  if (Array.isArray(data) && data.length > 0 && data[0]?.application_id) {
    const match = String(data[0].application_id).match(/IDS-APP-\d{4}-(\d{4})$/);
    if (match && match[1]) {
      sequence = Number(match[1]) + 1;
    }
  }

  return `${prefix}${String(sequence).padStart(4, '0')}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ message: 'Invalid payload.' }, { status: 400 });
    }

    const payload = normalizePayload(body as Record<string, unknown>);

    if (!payload.full_name) {
      return NextResponse.json({ message: 'Full name is required.' }, { status: 400 });
    }
    if (!payload.mobile_number || !MOBILE_RE.test(payload.mobile_number)) {
      return NextResponse.json({ message: 'Please provide a valid mobile number.' }, { status: 400 });
    }
    if (!payload.email || !EMAIL_RE.test(payload.email)) {
      return NextResponse.json({ message: 'Please provide a valid email address.' }, { status: 400 });
    }
    if (!payload.course_name) {
      return NextResponse.json({ message: 'Course is required.' }, { status: 400 });
    }
    if (!payload.training_mode) {
      return NextResponse.json({ message: 'Training mode is required.' }, { status: 400 });
    }
    if (!payload.declaration_accepted) {
      return NextResponse.json({ message: 'Please confirm the declaration.' }, { status: 400 });
    }
    if (!payload.terms_accepted) {
      return NextResponse.json({ message: 'Please accept the Terms & Conditions.' }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const applicationId = await generateApplicationId();

    const duplicateQuery = await supabase
      .from('admissions')
      .select('id')
      .or(`email.eq.${payload.email},mobile_number.eq.${payload.mobile_number}`)
      .limit(1);

    if (duplicateQuery.error) {
      throw new Error(duplicateQuery.error.message);
    }

    if (Array.isArray(duplicateQuery.data) && duplicateQuery.data.length > 0) {
      return NextResponse.json({ message: 'An application with this email or mobile number already exists.' }, { status: 409 });
    }

    const insertPayload = {
      application_id: applicationId,
      admission_id: null,
      ...payload,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('admissions')
      .insert([insertPayload])
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(
      {
        success: true,
        application_id: data.application_id,
        admission_id: data.admission_id,
        id: data.id,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to submit application.';
    console.error('[admissions] submit error:', message);
    return NextResponse.json({ message }, { status: 500 });
  }
}
