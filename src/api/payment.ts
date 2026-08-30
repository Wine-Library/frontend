import { instance } from "./api";
import type { CreatePaymentPayload, Payment, PaymentIntent } from "@/types/Payment";

export async function createPaymentApi(payload: CreatePaymentPayload, orderId: number): Promise<Payment> {
  const { data } = await instance.post<Payment>(`/payments/${orderId}`, payload);
  return data;
}

export async function createPaymentIntentApi(payload: CreatePaymentPayload): Promise<PaymentIntent> {
  const { data } = await instance.post<PaymentIntent>("/payments/create-payment-intent", payload);
  return data;
}

export async function createPaymentSuccessApi() {
  const { data } = await instance.get<Payment[]>("/payments/success");
  return data;
}