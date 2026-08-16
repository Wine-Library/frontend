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
  name: string;
  price: number;
  originCountry: string;
  flagUrl: string;
  popularityRating: number;
  imageUrl: string;
  type: string;
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