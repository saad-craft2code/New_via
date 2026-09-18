// POST /api/v1/auth/login
import { NextRequest } from "next/server";
import { ok, err, isDb, db, mock, getAuthUserId } from "../../../_lib";
import { toSharedUser } from "../_shared";

export async function POST(req: NextRequest) {
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }
  const email = String(body.email ?? "").toLowerCase().trim();
  const password = String(body.password ?? "");
  if (!email || !password) return err("Email and password are required", 422);

  if (isDb() && db) {
    try {
      const user = await db.user.findUnique({ where: { email } });
      if (user) {
        const token = `demo-${user.id}`;
        return ok({ token, user: toSharedUser(user) });
      }
    } catch (e) { console.log("DB error, using mock"); }
  }

  const mockUser = mock.users.find((u) => u.email === email);
  if (mockUser) {
    const token = `demo-${mockUser.id}`;
    return ok({ token, user: toSharedUser(mockUser) });
  }
  return err("Invalid credentials", 401);
}
