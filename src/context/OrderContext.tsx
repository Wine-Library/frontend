import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Order, OrderItem } from "@/types/Orders";
import { getOrdersApi, placeOrderApi, updateOrderApi } from "@/api/Orders";
import type { CreateOrderPayload } from "@/api/CheckoutApi";

interface OrderContextType {
  cartItems: OrderItem[];
  orderHistory: Order[];
  addToCart: (item: OrderItem) => void;
  removeFromCart: (itemId: number) => void;
  placeOrder: (details: Omit<CreateOrderPayload, "orderItems">) => Promise<void>;
  updateOrder: (orderId: number, status: string) => Promise<Order>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
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

  function addToCart(item: OrderItem) {
    setCartItems((prev) => [...prev, item]);
  }

  function removeFromCart(itemId: number) {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  }

  async function placeOrder(details: Omit<CreateOrderPayload, "orderItems">) {
    try {
      const newOrder = await placeOrderApi({ ...details, orderItems: cartItems });
      setOrderHistory((prev) => [...prev, newOrder]);
      setCartItems([]);
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
    <OrderContext.Provider value={{ updateOrder, cartItems, orderHistory, addToCart, removeFromCart, placeOrder }}>
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