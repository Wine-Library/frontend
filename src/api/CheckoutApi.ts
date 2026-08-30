// CheckoutApi.ts
import type { Order } from "@/types/Orders";
import { instance } from "./api";

export type CreateOrderPayload = Pick<Order, "userId" | "orderItems" | "street" | "city" | "zipCode">;

export async function placeOrderApi(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await instance.post<Order>("/orders", payload);
  return data;
}

export async function createPaymentIntentApi(amount: number): Promise<{ clientSecret: string }> {
  const { data } = await instance.post<{ clientSecret: string }>("/create-payment-intent", { amount });
  return data;
}
