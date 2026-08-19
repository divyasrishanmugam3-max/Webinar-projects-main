import { NextResponse } from 'next/server';
import { createAdminToken, getAdminEnvironmentStatus } from '@/lib/admin-auth';

export async function GET() {
  return NextResponse.json(getAdminEnvironmentStatus(), { status: 200 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body || {};
    const { adminEmail, adminPassword } = {
      adminEmail: process.env.ADMIN_EMAIL?.trim(),
      adminPassword: process.env.ADMIN_PASSWORD?.trim(),
    };

    if (!adminEmail || !adminPassword) {
      return NextResponse.json({ message: 'Admin not configured' }, { status: 500 });
    }
    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = createAdminToken(email);
    const res = NextResponse.json({ message: 'ok' });
    res.headers.set('Set-Cookie', `admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${8 * 60 * 60}`);
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
