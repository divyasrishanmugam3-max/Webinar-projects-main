import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { WEBINAR_DETAILS } from '@/types/webinar';

type Lead = {
  id: string;
  full_name: string;
  whatsapp_number: string;
  email: string;
  city?: string;
  qualification?: string;
  current_status?: string;
  course_interest?: string;
  main_goal?: string;
  source?: string;
  registration_date: string;
  webinar_date?: string;
  lead_status: string;
  attendance_status: string;
  counselling_status: string;
};

const DATA_FILE = path.join(process.cwd(), 'data', 'leads.json');

async function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  await fs.promises.mkdir(dir, { recursive: true });
  try {
    await fs.promises.access(DATA_FILE, fs.constants.F_OK);
  } catch (e) {
    await fs.promises.writeFile(DATA_FILE, JSON.stringify([]));
  }
}

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
    } = body;

    if (!full_name || !whatsapp_number || !email) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // basic duplicate check in local store
    await ensureDataDir();
    const raw = await fs.promises.readFile(DATA_FILE, 'utf-8');
    const list: Lead[] = JSON.parse(raw || '[]');
    const dup = list.find((l) => l.email === email || l.whatsapp_number === whatsapp_number);
    if (dup) {
      return NextResponse.json({ message: 'Lead already exists' }, { status: 409 });
    }

    // create lead object
    const id = crypto.randomUUID();
    const lead: Lead = {
      id,
      full_name,
      whatsapp_number,
      email,
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
    };

    // If Supabase is configured, try to insert there.
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        const { error } = await supabase.from('leads').insert([
          {
            id: lead.id,
            full_name: lead.full_name,
            whatsapp_number: lead.whatsapp_number,
            email: lead.email,
            city: lead.city,
            qualification: lead.qualification,
            current_status: lead.current_status,
            course_interest: lead.course_interest,
            main_goal: lead.main_goal,
            source: lead.source,
            registration_date: lead.registration_date,
            webinar_date: lead.webinar_date,
            lead_status: lead.lead_status,
            attendance_status: lead.attendance_status,
            counselling_status: lead.counselling_status,
          },
        ]);
        if (error) {
          console.error('Supabase insert error', error);
        } else {
          return NextResponse.json({ id }, { status: 201 });
        }
      } catch (err) {
        console.error('Supabase client load failed', err);
      }
    }

    // fallback: save locally
    list.push(lead);
    await fs.promises.writeFile(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');

    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
