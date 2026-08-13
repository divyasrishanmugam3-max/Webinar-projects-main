import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyAdminToken } from '@/lib/admin-auth';

const DATA_FILE = path.join(process.cwd(), 'data', 'leads.json');

async function readLeads() {
  try {
    const raw = await fs.promises.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const token = cookie.split(';').map((s) => s.trim()).find((c) => c.startsWith('admin_token='))?.split('=')[1];
    const admin = verifyAdminToken(token);
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';
    const attendance = url.searchParams.get('attendance') || '';
    const course = url.searchParams.get('course') || '';
    const source = url.searchParams.get('source') || '';
    const start = url.searchParams.get('start') || '';
    const end = url.searchParams.get('end') || '';

    let leads = await readLeads();

    // filtering
    if (search) {
      const q = search.toLowerCase();
      leads = leads.filter((l: any) => (l.full_name || '').toLowerCase().includes(q) || (l.email || '').toLowerCase().includes(q) || (l.whatsapp_number || '').toLowerCase().includes(q));
    }
    if (status) leads = leads.filter((l: any) => (l.lead_status || '') === status);
    if (attendance) leads = leads.filter((l: any) => (l.attendance_status || '') === attendance);
    if (course) leads = leads.filter((l: any) => (l.course_interest || '') === course);
    if (source) leads = leads.filter((l: any) => (l.source || '') === source);
    if (start) {
      const s = new Date(start).getTime();
      leads = leads.filter((l: any) => new Date(l.registration_date).getTime() >= s);
    }
    if (end) {
      const e = new Date(end).getTime();
      leads = leads.filter((l: any) => new Date(l.registration_date).getTime() <= e);
    }

    return NextResponse.json({ leads }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
