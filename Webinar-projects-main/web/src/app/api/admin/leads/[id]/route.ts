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

async function writeLeads(leads: any[]) {
  await fs.promises.writeFile(DATA_FILE, JSON.stringify(leads, null, 2), 'utf-8');
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const token = cookie.split(';').map((s) => s.trim()).find((c) => c.startsWith('admin_token='))?.split('=')[1];
    const admin = verifyAdminToken(token);
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const leads = await readLeads();
    const lead = leads.find((l: any) => l.id === params.id);
    if (!lead) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json({ lead }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const token = cookie.split(';').map((s) => s.trim()).find((c) => c.startsWith('admin_token='))?.split('=')[1];
    const admin = verifyAdminToken(token);
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { lead_status, attendance_status, counselling_status } = body || {};
    const allowedLead = ['Registered','Confirmed','Attended','Interested','Follow-up','Counselling','Enrolled','Not Interested'];
    const allowedAttendance = ['Not Attended','Attended'];
    const allowedCounselling = ['Not Booked','Booked','Completed'];

    const leads = await readLeads();
    const idx = leads.findIndex((l: any) => l.id === params.id);
    if (idx === -1) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    if (lead_status && allowedLead.includes(lead_status)) leads[idx].lead_status = lead_status;
    if (attendance_status && allowedAttendance.includes(attendance_status)) leads[idx].attendance_status = attendance_status;
    if (counselling_status && allowedCounselling.includes(counselling_status)) leads[idx].counselling_status = counselling_status;

    await writeLeads(leads);
    return NextResponse.json({ message: 'ok', lead: leads[idx] }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
