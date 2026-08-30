import type { Order, OrderItem } from "@/types/Orders";
import { instance } from "./api";
import type { CreateOrderPayload } from "./CheckoutApi";

export async function getOrdersApi(): Promise<Order[]> {
  const { data } = await instance.get<Order[]>("/orders");
  return data;
}

export async function placeOrderApi(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await instance.post<Order>("/orders", payload);
  return data;
}

export async function updateOrderApi(orderId: number, status: string): Promise<Order> {
  const { data } = await instance.patch<Order>(`/orders/${orderId}`, { status });
  return data;
}

export async function getOrderItemsApi(orderId: number): Promise<OrderItem[]> {
  const { data } = await instance.get<OrderItem[]>(`/orders/${orderId}/items`);
  return data;
}

export async function getOrderItemsItemApi(orderId: number, itemId: number): Promise<OrderItem> {
  const { data } = await instance.get<OrderItem>(`/orders/${orderId}/items/${itemId}`);
  return data;
}