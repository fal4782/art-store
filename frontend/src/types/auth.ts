export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  role: "ADMIN" | "CUSTOMER";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}
