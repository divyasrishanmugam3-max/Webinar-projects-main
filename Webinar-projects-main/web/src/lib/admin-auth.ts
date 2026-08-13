import crypto from 'crypto';

type TokenPayload = {
  email: string;
  exp: number;
};

const COOKIE_NAME = 'admin_token';

export function getAdminEnvironmentStatus() {
  return {
    ADMIN_EMAIL_configured: Boolean(process.env.ADMIN_EMAIL?.trim()),
    ADMIN_PASSWORD_configured: Boolean(process.env.ADMIN_PASSWORD?.trim()),
    SUPABASE_URL_configured: Boolean(process.env.SUPABASE_URL?.trim()),
    SUPABASE_SERVICE_ROLE_KEY_configured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()),
  };
}

export function getAdminCredentials() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim() || '';
  const adminPassword = process.env.ADMIN_PASSWORD?.trim() || '';
  return { adminEmail, adminPassword };
}

export function createAdminToken(email: string, expiresInHours = 8) {
  const { adminPassword } = getAdminCredentials();
  const payload: TokenPayload = {
    email,
    exp: Date.now() + expiresInHours * 60 * 60 * 1000,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64');
  const sig = crypto.createHmac('sha256', adminPassword).update(data).digest('hex');
  return `${data}.${sig}`;
}

export function verifyAdminToken(token?: string): TokenPayload | null {
  if (!token) return null;
  try {
    const { adminEmail, adminPassword } = getAdminCredentials();
    const [data, sig] = token.split('.');
    const expected = crypto.createHmac('sha256', adminPassword).update(data).digest('hex');
    if (!sig || sig !== expected) return null;
    const payload = JSON.parse(Buffer.from(data, 'base64').toString('utf-8')) as TokenPayload;
    if (Date.now() > payload.exp) return null;
    if (payload.email !== adminEmail) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

export { COOKIE_NAME };
