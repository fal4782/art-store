export interface UpdateProfileInput {
  firstName: string;
  lastName?: string;
}

export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postalCode: string;
  country: string;
  phone: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressInput {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country?: string;
  phone?: string;
  isDefault?: boolean;
}

export interface UpdateAddressInput extends Partial<AddressInput> {}
