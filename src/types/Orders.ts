import type { Wine } from "./types";

export type OrderItem = {
  id: number;
  wineId: number;
  quantity: number;
  price: number;
};

export type Order = {
  id: number;
  userId: number;
  orderItems: OrderItem[];
  orderDate: string;
  total: number;
  status: string;
  street: string;
  city: string;
  zipCode: string;
};

export type OrderItemWithWine = OrderItem & {
  wine?: Wine;
};

export type OrderWithWines = Omit<Order, 'orderItems'> & {
  orderItems: OrderItemWithWine[];
};