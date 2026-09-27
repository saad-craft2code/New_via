// GET /api/v1/auth/me
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId, isDb, mock } from "../../../_lib";
import { toSharedUser } from "../login/route";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);

  let user: any = null;
  try {
    if (isDb() && db) {
      user = await db.user.findUnique({ where: { id: userId } });
    }
  } catch (e) {
    console.warn("DB lookup failed in /auth/me, falling back to mock:", e);
    user = null;
  }

  if (!user) {
    user = (mock.users as any[]).find((u) => u.id === userId);
  }

  if (!user) return err("User not found", 404);
  return ok(toSharedUser(user));
}
