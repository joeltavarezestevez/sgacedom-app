import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
}

export function isJwtExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (!decoded.exp) {
      return true;
    }

    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}
