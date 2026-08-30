import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Order } from "@/types/Orders";
import { getOrdersApi, placeOrderApi, updateOrderApi } from "@/api/Orders";
import type { CreateOrderPayload } from "@/api/CheckoutApi";

interface OrderContextType {
  orderHistory: Order[];
  placeOrder: (details: Omit<CreateOrderPayload, "orderItems">, orderItems: CreateOrderPayload["orderItems"]) => Promise<void>;
  updateOrder: (orderId: number, status: string) => Promise<Order>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);

  useEffect(() => {
    async function loadOrders() {
      try {
        const orders = await getOrdersApi();
        setOrderHistory(orders);
      } catch (err) {
        console.error("Failed to load orders:", err);
      }
    }
    loadOrders();
  }, []);

  async function placeOrder(details: Omit<CreateOrderPayload, "orderItems">, orderItems: CreateOrderPayload["orderItems"]) {
    try {
      const newOrder = await placeOrderApi({ ...details, orderItems });
      setOrderHistory((prev) => [...prev, newOrder]);
    } catch (err) {
      console.error("Failed to place order:", err);
      throw err;
    }
  }

  async function updateOrder(itemId: number, status: string) {
    try {
      const updatedOrder = await updateOrderApi(itemId, status );
      setOrderHistory((prev) =>
        prev.map((order) => (order.id === itemId ? updatedOrder : order))
      );
      localStorage.setItem("order", JSON.stringify(updatedOrder)); 
      return updatedOrder;
    } catch (err) {
      console.error("Change failed:", err);
      throw err;
    }
  }

  return (
    <OrderContext.Provider value={{ updateOrder, orderHistory, placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within OderProvider");
  }
  return context;
}