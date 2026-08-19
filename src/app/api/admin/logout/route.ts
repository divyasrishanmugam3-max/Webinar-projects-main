import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ message: 'logged out' });
  res.headers.set('Set-Cookie', `admin_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
  return res;
}
