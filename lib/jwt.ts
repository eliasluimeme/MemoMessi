import jwt from 'jsonwebtoken';

interface JWTPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

export async function verifyJwt(token: string): Promise<JWTPayload | null> {
  try {
    const secret = process.env.JWT_SECRET || '';
    const decoded = jwt.verify(token, secret) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}
