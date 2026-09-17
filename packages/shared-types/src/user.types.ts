export type UserRole = 'hotel_owner' | 'bundle_creator' | 'admin';

export type KycStatus = 'not_submitted' | 'pending' | 'approved' | 'rejected';

export type KycDocumentType =
  | 'business_license'
  | 'id_proof'
  | 'tax_certificate'
  | 'hotel_license'
  | 'property_ownership'
  | 'tour_guide_license';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  kycStatus: KycStatus;
  phone?: string | null;
  companyName?: string | null;
  businessLicense?: string | null;
  tourGuideLicense?: string | null;
  yearsExperience?: number | null;
  languagesSpoken?: string[];
  firebaseUid?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  kycStatus: KycStatus;
  phone?: string | null;
  companyName?: string | null;
  memberSince: string;
  avatarUrl?: string | null;
}

export interface UpdateProfileDto {
  name?: string;
  phone?: string;
  companyName?: string;
  avatarUrl?: string;
}
