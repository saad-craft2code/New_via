// Shared auth utilities — imported by multiple route files
// This is NOT a route file (no route.ts extension) so it can export functions

export function toSharedUser(user: any) {
  const sharedRole = user.role === "HotelOwner" || user.role === "hotel_owner"
    ? "hotel_owner"
    : user.role === "BundleCreator" || user.role === "bundle_creator"
    ? "bundle_creator"
    : user.role === "Admin" || user.role === "admin"
    ? "admin"
    : "bundle_creator";

  const kycStatus =
    user.kycStatus === "Approved" || user.kycStatus === "approved" ? "approved" :
    user.kycStatus === "Pending" || user.kycStatus === "pending" ? "pending" :
    user.kycStatus === "Rejected" || user.kycStatus === "rejected" ? "rejected" :
    "not_submitted";

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: sharedRole,
    phone: user.phone ?? undefined,
    companyName: user.companyName ?? undefined,
    businessLicense: user.businessLicense ?? undefined,
    tourGuideLicense: user.tourGuideLicense ?? undefined,
    yearsExperience: user.yearsExperience ?? undefined,
    languagesSpoken: user.languagesSpoken ?? [],
    avatarUrl: user.avatarUrl ?? undefined,
    kycStatus,
    kycSubmittedAt: user.kycSubmittedAt ?? undefined,
    kycReviewedAt: user.kycReviewedAt ?? undefined,
    kycRejectionReason: user.kycRejectionReason ?? undefined,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
