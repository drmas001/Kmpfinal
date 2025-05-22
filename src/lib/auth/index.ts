import { SignJWT, jwtVerify } from 'jose';
import db from '../db';
import { createHash, randomBytes } from 'crypto';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

export interface JWTPayload {
  sub: string;
  email: string;
  role?: string;
}

export async function createToken(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function hashPassword(password: string) {
  return createHash('sha256').update(password).digest('hex');
}

export function generateEmployeeCode() {
  return randomBytes(3).toString('hex').toUpperCase();
}

export async function createUser(email: string, password: string) {
  const hashedPassword = hashPassword(password);
  const stmt = db.prepare(
    'INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)'
  );
  const userId = randomBytes(16).toString('hex');
  stmt.run(userId, email, hashedPassword);
  return userId;
}

export function verifyUser(email: string, password: string) {
  const hashedPassword = hashPassword(password);
  const stmt = db.prepare(
    'SELECT id, email FROM users WHERE email = ? AND password_hash = ?'
  );
  return stmt.get(email, hashedPassword);
}