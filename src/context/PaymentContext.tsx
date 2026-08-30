import { createPaymentApi, createPaymentIntentApi } from "@/api/payment";
import type { Payment, PaymentIntent } from "@/types/Payment";
import { createContext, useContext, useState, type ReactNode } from "react";

interface PaymentContextType {
  payment: Payment | undefined;
  paymentIntent: PaymentIntent | undefined;
  createPayment: (orderId: number, amount: number, currency: string) => Promise<Payment>;
  createPaymentIntent: (amount: number, currency: string) => Promise<PaymentIntent>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [payment, setPayment] = useState<Payment>();
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent>();

  async function createPayment(orderId: number, amount: number, currency: string) {
    const result = await createPaymentApi({ amount, currency }, orderId);
    setPayment(result);
    return result;
  }

  async function createPaymentIntent(amount: number, currency: string) {
    const result = await createPaymentIntentApi({ amount, currency });
    setPaymentIntent(result);
    return result;
  }

  return (
    <PaymentContext.Provider value={{ paymentIntent, payment, createPayment, createPaymentIntent }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within PaymentProvider");
  }
  return context;
}