// GET /api/v1/auth/me
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../../_lib";
import { toSharedUser } from "../login/route";

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return err("User not found", 404);
  return ok(toSharedUser(user));
}
