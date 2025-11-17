import jwt from "jsonwebtoken";

export function getUserIdFromToken(token: string | undefined): string | null {
  if (!token) return null;

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded.id;
  } catch {
    return null;
  }
}
