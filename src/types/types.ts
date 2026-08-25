export interface User {
  id: number;
  email: string;
  name: string;
  surname: string;
  phoneNumber: string;
  password: string;
  repeatPassword: string;
  shippingAddress: string;
  isVerified: boolean;
}

export interface ChangeUserDataPayload {
  name: string;
  surname: string;
  phoneNumber: string;
  shippingAddress: string;
  password: string;
  repeatPassword: string;
  email: string;
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

export interface Wine {
  id: string;
  wineName: string;
  price: number;
  countryOfOrigin: string;
  year: number;
  popularityRating: number;
  productImage: string;
  wineType: string;
  occasions: string[];
}

export interface CartFavItem {
  wine: Wine;
  quantity: number;
  cartItemId?: number;
}

export type RegisterResponse = {
  id: number;
  email: string;
  age: number;
  token: string;
};