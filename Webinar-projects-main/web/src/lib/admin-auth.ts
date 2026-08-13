import crypto from 'crypto';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

type TokenPayload = {
  email: string;
  exp: number;
};

const COOKIE_NAME = 'admin_token';

export function createAdminToken(email: string, expiresInHours = 8) {
  const payload: TokenPayload = {
    email,
    exp: Date.now() + expiresInHours * 60 * 60 * 1000,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64');
  const sig = crypto.createHmac('sha256', ADMIN_PASSWORD).update(data).digest('hex');
  return `${data}.${sig}`;
}

export function verifyAdminToken(token?: string): TokenPayload | null {
  if (!token) return null;
  try {
    const [data, sig] = token.split('.');
    const expected = crypto.createHmac('sha256', ADMIN_PASSWORD).update(data).digest('hex');
    if (!sig || sig !== expected) return null;
    const payload = JSON.parse(Buffer.from(data, 'base64').toString('utf-8')) as TokenPayload;
    if (Date.now() > payload.exp) return null;
    if (payload.email !== ADMIN_EMAIL) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

export { COOKIE_NAME };
