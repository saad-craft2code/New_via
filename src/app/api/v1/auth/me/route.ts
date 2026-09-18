// GET /api/v1/auth/me
import { NextRequest } from "next/server";
import { ok, err, isDb, db, mock, getAuthUserId } from "../../../../_lib";
import { toSharedUser } from "../_shared";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  if (isDb() && db) {
    try {
      const user = await db.user.findUnique({ where: { id: userId } });
      if (user) return ok(toSharedUser(user));
    } catch (e) { console.log("DB error, using mock"); }
  }
  const mockUser = mock.users.find(u => u.id === userId);
  if (mockUser) return ok(toSharedUser(mockUser));
  return err("User not found", 404);
}
