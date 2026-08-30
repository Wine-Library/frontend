// CheckoutApi.ts
import type { Order, OrderItem } from "@/types/Orders";
import { instance } from "./api";

export type CreateOrderPayload = {
  userId: number;
  street: string;
  city: string;
  zipCode: string;
  orderItems: Array<Pick<OrderItem, "wineId" | "quantity" | "price">>;
};

export async function placeOrderApi(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await instance.post<Order>("/orders", payload);
  return data;
}

export async function createPaymentIntentApi(amount: number): Promise<{ clientSecret: string }> {
  const { data } = await instance.post<{ clientSecret: string }>("/create-payment-intent", { amount });
  return data;
}
