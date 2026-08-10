import type { AuthUser } from '../types';

/**
 * Decode a JWT payload (base64url) without verifying the signature.
 * Verification is done server-side on every request.
 */
export function decodeToken(token: string): AuthUser | null {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as AuthUser;
  } catch {
    return null;
  }
}

/** Check if a JWT is expired based on its `exp` claim. */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    if (!decoded.exp) return false;
    return Date.now() / 1000 > decoded.exp;
  } catch {
    return true;
  }
}
