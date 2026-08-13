import { NextResponse } from 'next/server';
import { createAdminToken } from '@/lib/admin-auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body || {};
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      return NextResponse.json({ message: 'Admin not configured' }, { status: 500 });
    }
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = createAdminToken(email);
    const res = NextResponse.json({ message: 'ok' });
    // set httpOnly cookie
    res.headers.set('Set-Cookie', `admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${8 * 60 * 60}`);
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
