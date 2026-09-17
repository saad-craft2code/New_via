"use client";

import { api } from "@/lib/api";

export interface KycDocument {
  id: string;
  userId: string;
  type:
    | "BusinessLicense"
    | "IdProof"
    | "TaxCertificate"
    | "HotelLicense"
    | "PropertyOwnership"
    | "TourGuideLicense";
  fileUrl: string;
  fileName: string;
  mimeType: string;
  status: "NotSubmitted" | "Pending" | "Approved" | "Rejected";
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface KycStatus {
  kycStatus: "NotSubmitted" | "Pending" | "Approved" | "Rejected";
  kycSubmittedAt: string | null;
  kycReviewedAt: string | null;
  kycRejectionReason: string | null;
  documents: KycDocument[];
}

export type KycDocTypeInput =
  | "business_license"
  | "id_proof"
  | "tax_certificate"
  | "hotel_license"
  | "property_ownership"
  | "tour_guide_license";

export const kycService = {
  status: () => api.get<KycStatus>("/kyc"),
  upload: (type: KycDocTypeInput, file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", type);
    return api.upload<KycDocument[]>("/kyc/documents", fd);
  },
  uploadMock: (type: KycDocTypeInput, fileUrl: string, fileName: string) =>
    api.post<KycDocument[]>("/kyc/documents", { type, fileUrl, fileName }),
  submit: () =>
    api.post<{ kycStatus: string; kycSubmittedAt: string }>("/kyc/submit"),
};
