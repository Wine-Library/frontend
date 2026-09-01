import type { Order, OrderItem } from "@/types/Orders";
import { instance } from "./api";
import { getWines } from "./wines";
import type { Wine } from "@/types";

export type CreateOrderPayload = {
  street: string;
  city: string;
  zipCode: string;
};

export interface OrderItemWithWine extends OrderItem {
  wine?: Wine;
}

export interface OrderWithWines extends Omit<Order, "orderItems"> {
  orderItems: OrderItemWithWine[];
}

export async function getOrdersApi(): Promise<Order[]> {
  const { data } = await instance.get<Order[] | { content?: Order[] }>("/orders");
  if (Array.isArray(data)) return data;
  return Array.isArray(data?.content) ? data.content : [];
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

export async function getOrderHistory(): Promise<OrderWithWines[]> {
  const [orders, wines] = await Promise.all([getOrdersApi(), getWines()]);
  const wineById = new Map(wines.map((wine) => [String(wine.id), wine]));

  return orders.map((order) => ({
    ...order,
    orderItems: order.orderItems.map((orderItem) => ({
      ...orderItem,
      wine: wineById.get(String(orderItem.wineId)),
    })),
  }));
}