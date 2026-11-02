// Same rule as the address API: free formatting, at least 10 digits.
export const isValidPhone = (phone: string) =>
  phone.replace(/\D/g, "").length >= 10;

// For an <input pattern>, which is matched against the whole value.
export const PHONE_PATTERN = "(\\D*\\d){10,}\\D*";
export const PHONE_HINT = "Phone number needs at least 10 digits";
