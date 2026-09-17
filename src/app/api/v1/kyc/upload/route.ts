// /api/v1/kyc/upload — POST (submit KYC document)
import { NextRequest } from "next/server";
import { db, ok, err, getAuthUserId } from "../../../_lib";

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return err("Unauthorized", 401);
  let body: any = {};
  try { body = await req.json(); } catch { return err("Invalid JSON body", 400); }

  const type = String(body.type ?? "IdProof");
  const fileUrl = String(body.fileUrl ?? "");
  const fileName = String(body.fileName ?? "document.pdf");
  const mimeType = String(body.mimeType ?? "application/pdf");

  if (!fileUrl) return err("fileUrl is required", 422);

  const doc = await db.kycDocument.create({
    data: {
      userId,
      type,
      fileUrl,
      fileName,
      mimeType,
      status: "Pending",
    },
  });

  // Mark user's KYC as pending
  await db.user.update({
    where: { id: userId },
    data: {
      kycStatus: "Pending",
      kycSubmittedAt: new Date(),
      kycReviewedAt: null,
      kycRejectionReason: null,
    },
  });

  return ok(doc, 201);
}
