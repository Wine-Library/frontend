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
}

export type RegisterResponse = {
  id: number;
  email: string;
  age: number;
  token: string;
};