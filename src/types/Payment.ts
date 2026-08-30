export type Payment = {
  sessionId: string;
  sessionUrl: string;
};

export type CreatePaymentPayload = {
  amount: number;
  currency: string;
};

export type PaymentIntent = {
  clientSecret: string;
};