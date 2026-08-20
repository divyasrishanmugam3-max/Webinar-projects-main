import { verifyAdminToken } from '@/lib/admin-auth';

export function getAdminFromRequest(req: Request) {
  const cookie = req.headers.get('cookie') || '';
  const token = cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith('admin_token='))?.split('=')[1];
  return verifyAdminToken(token);
}
