export type Role =
  | 'Administrator'
  | 'Patient'
  | 'Clinician'
  | 'CareCoordinator'
  | 'DeviceTechnician'
  | 'Auditor';

export interface AuthUser {
  userId: number;
  name: string;
  email: string;
  role: Role;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Actual shape returned by backend AuthResponseDto
export interface LoginResponse {
  success: boolean;
  token: string | null;
  requiresPin: boolean;
  message: string | null;
}

export interface PinVerifyRequest {
  email: string;
  pin: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}
