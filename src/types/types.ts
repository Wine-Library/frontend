export interface User {
  id: number;
  email: string;
  age: number;
  isVerified: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  repeatPassword: string;
}

export interface ResetPasswordFormValues {
  newPassword: string;
  repeatPassword: string;
}

// types.ts
export interface Wine {
  id: string;
  wineName: string;
  price: number;
  countryOfOrigin: string;
  year: number;
  flagUrl: string;
  popularityRating: number;
  productImage: string;
  wineType: string;
  occasions: string[];
}

export interface CartFavItem {
  wine: Wine;
  quantity: number;
  // Id of the backend cart line item — absent for guest (localStorage-only)
  // carts, required to target the /cart/items/{cartItemId} endpoints.
  cartItemId?: number;
}

export type RegisterResponse = {
  id: number;
  email: string;
  age: number;
  token: string;
};