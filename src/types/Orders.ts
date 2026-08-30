export type OrderItem = {
  id: number;
  wineId: string;
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