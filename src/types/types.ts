export interface User {
  id: string;
  email: string;
  age: number;
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

export interface CartItem {
  wine: Wine;
  quantity: number;
}