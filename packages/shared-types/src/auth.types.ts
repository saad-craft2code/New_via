import type { UserRole, User } from './user.types';

export interface LoginRequest {
  email: string;
  password: string;
  role?: UserRole;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone?: string;
  companyName?: string;
  businessLicense?: string;
  tourGuideLicense?: string;
  yearsExperience?: number;
  languagesSpoken?: string[];
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn?: number;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}
